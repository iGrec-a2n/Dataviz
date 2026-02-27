# Mini TP (2h) — Analyse de parties de flipper

## Organisation

- Travail en **equipe** (equipes deja definies en cours).
- Sujet identique pour toutes les equipes.
- Duree: **2h**.
- Rendu: fin de journee, dans Moodle (devoir de votre equipe).

## Dataset (collecte de parties reelles/simulees)

- `data/flipper_games.csv`

Colonnes principales:
- joueur: `player_id`
- machine: `machine_id`, `machine_type`
- zone arcade: `arcade_zone`
- partie: `game_mode`, `game_duration_s`, `pause_s`
- risque/etat: `tilt_risk_pct`, `error_code`, `game_status`, `incident_label`

## Questions

### Exercice 01 — Chargement et controle

1. Charger le CSV dans un DataFrame `games`.
2. Afficher les 5 premieres lignes.
3. Afficher les types des colonnes.
4. Indiquer le nombre de lignes et de colonnes.
5. Afficher le nombre de joueurs uniques (`player_id.nunique()`).

Attendu:
- Un bloc de code Python executable.
- Une phrase courte: "le dataset contient X lignes, Y colonnes et Z joueurs".

### Exercice 02 — Nettoyage minimal

1. Supprimer les doublons.
2. Conserver uniquement les parties avec `game_duration_s > 0`.
3. Conserver uniquement les lignes avec `tilt_risk_pct` entre 0 et 100.
4. Conserver uniquement les lignes avec `pause_s >= 0`.
5. Verifier le nombre de lignes avant/apres nettoyage.

Attendu:
- Un DataFrame nettoye nomme `games_clean`.
- Un mini-bilan chiffre (nombre de lignes retirees).

### Exercice 03 — Indicateurs par zone arcade

1. Creer une colonne binaire `is_error`:
   - 1 si `game_status == "failed"`
   - 0 sinon
2. Calculer par `arcade_zone`:
   - nombre de parties
   - nombre de joueurs uniques
   - taux d'erreur moyen
   - pause moyenne (`pause_s`)
3. Trier par taux d'erreur decroissant.

Attendu:
- Un tableau `zone_kpi` clair et trie.
- 2 observations metier rapides.

### Exercice 04 — Visualisation barplot

1. A partir de `zone_kpi`, tracer un barplot du taux d'erreur par `arcade_zone`.
2. Utiliser un tri decroissant.
3. Ajouter un titre, un label `x`, un label `y`.
4. Ajouter une rotation de labels si necessaire.

Attendu:
- Un graphique lisible.
- Une phrase d'interpretation: zone la plus critique + action possible.

### Exercice 05 — Boxplot de performance machine

1. Tracer un boxplot de `game_duration_s` par `machine_type`.
2. Produire une version avec outliers visibles.
3. Produire une version sans outliers (`showfliers=False`).
4. Interpreter la mediane et la dispersion pour chaque type.

Attendu:
- 2 graphiques.
- 3 conclusions courtes (stabilite, variabilite, anomalies).

## Challenge final (bonus)

Construire un score `risk_score` pour classer les machines de flipper les plus a risque:

`risk_score = 0.5 * error_rate + 0.3 * pause_norm + 0.2 * tilt_risk_norm`

Indications:
- calculer `error_rate`, `avg_pause_s`, `avg_tilt_risk_pct` par `machine_id`
- normaliser `avg_pause_s` et `avg_tilt_risk_pct` entre 0 et 1
- option recommandee: filtrer les machines avec au moins 30 parties

Rendu challenge:
1. Top 5 des machines les plus a risque.
2. 2 recommandations concretes (maintenance, reglage, exploitation).

## Rendu Moodle (obligatoire)

Depot dans Moodle:
- section **Devoir**
- sous-section du **devoir de votre equipe**

Regles:
- un seul depot par equipe
- fichier notebook: `TP2H_<equipe>.ipynb`
- court compte-rendu (5 a 10 lignes) dans la cellule finale du notebook
