# Correction 02 — Nettoyage minimal

## Code

```python
rows_before = len(robots)

robots_clean = robots.drop_duplicates().copy()
robots_clean = robots_clean[robots_clean["mission_duration_s"] > 0]
robots_clean = robots_clean[robots_clean["battery_pct"].between(0, 100)]

rows_after = len(robots_clean)
print("Lignes retirées:", rows_before - rows_after)
print("Lignes restantes:", rows_after)
```

## Vérification attendue

- `robots_clean` contient moins (ou autant) de lignes que `robots`.
- Aucune valeur hors plage sur `battery_pct`.

