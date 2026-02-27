# Correction 03 — Indicateurs par zone

## Code

```python
robots_clean["is_error"] = (robots_clean["mission_status"] != "ok").astype(int)

zone_kpi = (
    robots_clean
    .groupby("zone", as_index=False)
    .agg(
        missions=("zone", "size"),
        error_rate=("is_error", "mean"),
        avg_downtime=("downtime_s", "mean"),
    )
    .sort_values("error_rate", ascending=False)
)

print(zone_kpi)
```

## Vérification attendue

- `error_rate` est entre 0 et 1.
- Le tri décroissant est respecté.

