# Cours Dataviz — Slides + Notebook + PostgreSQL (Docker)

Ce repo contient le support des chapitres:
- **Dataviz robots avec Python**
- **Correlations et projet flipper**

## Structure du projet

- Slides Marp : `slides/`
- Setup Docker Notebook : `starter-db/`
- Dataset : `starter-db/data/robots_missions.csv`
- Dataset mini TP : `data/flipper_games.csv`
- Exercices progressifs : `exercices/dataviz_robots/`
- TP equipes (2h30) : `tp/mini_tp_2h_equipes_flippers_robots.md`
- Corrections séparées : `corrections/dataviz_robots/`
- Correction mini TP : `corrections/mini_tp_flipper_2h_correction.md`

Cours en ligne :
- https://antoine07.github.io/Dataviz/
- https://antoine07.github.io/Dataviz/dataviz_robots.html
- https://antoine07.github.io/Dataviz/dataviz_correlations_flipper.html

## Démarrage (Docker)

Prérequis :
- Docker Desktop (ou Docker Engine + Compose)

Depuis la racine du repo (services `notebook`, `postgres`, `adminer`) :

```bash
cd starter-db
docker compose up -d --build
```

Accès Notebook :
- URL : `http://localhost:8889`
- Token : `sql-nosql` (ou valeur de `JUPYTER_TOKEN`)

Le repo est monté dans le conteneur ici :
- `/home/jovyan/work`

On peut ouvrir directement :
- `starter-db/notebooks/analyse_robots.ipynb`

Accès PostgreSQL :
- Host : `localhost`
- Port : `5433`
- User : `postgres`
- Password : `postgres`
- DB par défaut : `robot`

Accès Adminer :
- URL : `http://localhost:8080`

## Alternative (sans Docker)

Prérequis :
- Python 3.11+

Depuis la racine du repo :

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install notebook==7.4.5 pandas==3.0.1 matplotlib==3.9.0 seaborn==0.13.2
```

Lancer Jupyter Notebook :

```bash
jupyter notebook \
  --ip=127.0.0.1 \
  --port=8889 \
  --no-browser \
  --ServerApp.token=sql-nosql
```

Puis ouvrir :
- URL : `http://localhost:8889`
- Notebook : `starter-db/notebooks/analyse_robots.ipynb`

Sortir de l'environnement virtuel :

```bash
deactivate
```

## Alternative en ligne (Google Colab)

Si vous ne pouvez pas installer Docker ou Python localement, utilisez Colab.

1. Ouvrir https://colab.research.google.com
2. Créer un nouveau notebook
3. Installer les dépendances dans une cellule :

```python
!pip install -q pandas matplotlib seaborn
```

4. Uploader les datasets (`data/flipper_games.csv`, `starter-db/data/robots_missions.csv`) dans l'onglet fichiers
5. Adapter les chemins dans le notebook, par exemple :

```python
flipper_path = "/content/flipper_games.csv"
robots_path = "/content/robots_missions.csv"
```

Cette option est pratique pour avancer rapidement, mais le workflow recommandé du cours reste Docker.

## PostgreSQL - Option 

Ouvrir `psql` :

```bash
cd starter-db
docker compose exec postgres psql -U postgres -d robot
```

Charger le schema `robot` (modele sur le dataset analyse) :

```bash
cd starter-db
docker compose exec -T postgres psql -U postgres -d robot -v ON_ERROR_STOP=1 -f /shared/postgres/seed.sql
```

## Personnalisation (ports / token) si nécessaire

```bash
cd starter-db
POSTGRES_PORT=55433 ADMINER_PORT=18080 NOTEBOOK_PORT=18889 JUPYTER_TOKEN=mon-token docker compose up -d --build
```

Puis ouvre :
- Notebook : `http://localhost:18889`
- Adminer : `http://localhost:18080`
- PostgreSQL : port `55433`

## Arrêter l'environnement

```bash
cd starter-db
docker compose down
```

## Suppression propre des conteneurs

Supprimer les conteneurs et le réseau du projet :

```bash
cd starter-db
docker compose down --remove-orphans
```

Supprimer aussi les volumes du projet (efface les données PostgreSQL locales) :

```bash
cd starter-db
docker compose down --volumes --remove-orphans
```

Reset complet (supprime conteneurs, volumes et images construites localement) :

```bash
cd starter-db
docker compose down --volumes --rmi local --remove-orphans
```

Vérifier qu'il ne reste plus de conteneur du projet :

```bash
docker ps -a --filter name=dataviz
```
