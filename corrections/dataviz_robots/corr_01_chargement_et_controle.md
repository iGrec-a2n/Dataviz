# Correction 01 — Chargement et contrôle

## Code

```python
import pandas as pd

robots = pd.read_csv("starter-db/data/robots_missions.csv")

print(robots.head())
print(robots.dtypes)
print(robots.shape)
```

## Vérification attendue

- Le chargement ne génère pas d'erreur.
- `shape` renvoie bien `(lignes, colonnes)`.

