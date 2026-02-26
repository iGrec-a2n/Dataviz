# Exercice 02 — Nettoyage minimal

## Contexte
Le dataset contient des lignes incohérentes qui peuvent biaiser l'analyse.

## Consigne

1. Supprimer les doublons.
2. Conserver uniquement les missions avec `mission_duration_s > 0`.
3. Conserver uniquement les lignes avec `battery_pct` entre 0 et 100.
4. Vérifier le nombre de lignes avant/après nettoyage.

## Attendu

- Un DataFrame nettoyé nommé `robots_clean`.
- Un mini-bilan chiffré (nombre de lignes retirées).

