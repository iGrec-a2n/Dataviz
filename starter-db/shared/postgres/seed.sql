-- Fil rouge "robot" (Postgres 17+)
-- Objectif:
-- 1) modeliser le dataset robots_missions.csv
-- 2) charger les donnees d'analyse dans Postgres
--
-- Prerequis docker-compose:
-- - volume ./data monte dans le conteneur postgres sur /data
-- - base cible: robot
--
-- Execution:
-- psql -U postgres -d robot -v ON_ERROR_STOP=1 -f /shared/postgres/seed.sql

DROP VIEW IF EXISTS vw_zone_kpi;
DROP VIEW IF EXISTS vw_robot_type_kpi;
DROP VIEW IF EXISTS vw_robot_mission_clean;
DROP TABLE IF EXISTS fct_robot_mission;
DROP TABLE IF EXISTS dim_task;
DROP TABLE IF EXISTS dim_zone;
DROP TABLE IF EXISTS dim_robot;
DROP TABLE IF EXISTS stg_robot_mission;

-- Staging: structure 1:1 avec le CSV source
CREATE TABLE stg_robot_mission (
  timestamp TEXT,
  robot_id TEXT,
  robot_type TEXT,
  zone TEXT,
  task_type TEXT,
  mission_duration_s TEXT,
  downtime_s TEXT,
  battery_pct TEXT,
  speed_mps TEXT,
  temperature_c TEXT,
  error_code TEXT,
  mission_status TEXT,
  incident_label TEXT
);

COPY stg_robot_mission
FROM '/data/robots_missions.csv'
WITH (
  FORMAT csv,
  HEADER true
);

-- Dimensions
CREATE TABLE dim_robot (
  robot_id TEXT PRIMARY KEY,
  robot_type TEXT NOT NULL,
  CONSTRAINT chk_robot_type
    CHECK (robot_type IN ('picker', 'carrier', 'forklift'))
);

CREATE TABLE dim_zone (
  zone TEXT PRIMARY KEY
);

CREATE TABLE dim_task (
  task_type TEXT PRIMARY KEY
);

-- Table de faits
CREATE TABLE fct_robot_mission (
  mission_sk BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_ts TIMESTAMP NOT NULL,
  robot_id TEXT NOT NULL REFERENCES dim_robot(robot_id),
  zone TEXT NOT NULL REFERENCES dim_zone(zone),
  task_type TEXT NOT NULL REFERENCES dim_task(task_type),
  mission_duration_s INT NOT NULL,
  downtime_s INT NOT NULL CHECK (downtime_s >= 0),
  battery_pct NUMERIC(5, 2) NOT NULL CHECK (battery_pct >= 0),
  speed_mps NUMERIC(8, 3) NOT NULL CHECK (speed_mps >= 0),
  temperature_c NUMERIC(6, 2) NOT NULL,
  error_code TEXT NULL,
  mission_status TEXT NOT NULL CHECK (mission_status IN ('completed', 'failed')),
  incident_label SMALLINT NOT NULL CHECK (incident_label IN (0, 1)),
  is_error SMALLINT GENERATED ALWAYS AS (
    CASE WHEN mission_status = 'failed' THEN 1 ELSE 0 END
  ) STORED
);

CREATE INDEX idx_fct_robot_mission_event_ts ON fct_robot_mission(event_ts);
CREATE INDEX idx_fct_robot_mission_zone ON fct_robot_mission(zone);
CREATE INDEX idx_fct_robot_mission_robot_id ON fct_robot_mission(robot_id);
CREATE INDEX idx_fct_robot_mission_task_type ON fct_robot_mission(task_type);
CREATE INDEX idx_fct_robot_mission_status ON fct_robot_mission(mission_status);
CREATE INDEX idx_fct_robot_mission_error_code ON fct_robot_mission(error_code);

CREATE VIEW vw_robot_mission_clean AS
SELECT *
FROM fct_robot_mission
WHERE mission_duration_s > 0
  AND battery_pct BETWEEN 0 AND 100;

INSERT INTO dim_robot (robot_id, robot_type)
SELECT DISTINCT
  robot_id,
  robot_type
FROM stg_robot_mission
WHERE robot_id IS NOT NULL
  AND robot_id <> '';

INSERT INTO dim_zone (zone)
SELECT DISTINCT
  zone
FROM stg_robot_mission
WHERE zone IS NOT NULL
  AND zone <> '';

INSERT INTO dim_task (task_type)
SELECT DISTINCT
  task_type
FROM stg_robot_mission
WHERE task_type IS NOT NULL
  AND task_type <> '';

INSERT INTO fct_robot_mission (
  event_ts,
  robot_id,
  zone,
  task_type,
  mission_duration_s,
  downtime_s,
  battery_pct,
  speed_mps,
  temperature_c,
  error_code,
  mission_status,
  incident_label
)
SELECT
  timestamp::timestamp,
  robot_id,
  zone,
  task_type,
  mission_duration_s::int,
  downtime_s::int,
  battery_pct::numeric(5, 2),
  speed_mps::numeric(8, 3),
  temperature_c::numeric(6, 2),
  NULLIF(error_code, ''),
  mission_status,
  incident_label::smallint
FROM stg_robot_mission;

CREATE VIEW vw_zone_kpi AS
SELECT
  zone,
  COUNT(*) AS mission_count,
  ROUND(AVG(is_error)::numeric, 4) AS error_rate,
  ROUND(AVG(mission_duration_s)::numeric, 2) AS avg_mission_duration_s,
  ROUND(AVG(downtime_s)::numeric, 2) AS avg_downtime_s,
  ROUND(AVG(battery_pct)::numeric, 2) AS avg_battery_pct
FROM vw_robot_mission_clean
GROUP BY zone
ORDER BY error_rate DESC, mission_count DESC;

CREATE VIEW vw_robot_type_kpi AS
SELECT
  r.robot_type,
  COUNT(*) AS mission_count,
  ROUND(AVG(f.is_error)::numeric, 4) AS error_rate,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY f.downtime_s)::numeric, 2) AS median_downtime_s,
  ROUND(AVG(f.speed_mps)::numeric, 3) AS avg_speed_mps
FROM vw_robot_mission_clean f
JOIN dim_robot r ON r.robot_id = f.robot_id
GROUP BY r.robot_type
ORDER BY error_rate DESC, mission_count DESC;

DROP TABLE stg_robot_mission;
