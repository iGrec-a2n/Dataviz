# Heures — dashboard de suivi du temps de travail

Application web pour compter les heures travaillées chaque jour, avec objectifs min/max (jour et semaine), formatage conditionnel, recommandation pour « rentrer dans les clous », et historique des balances hebdomadaires.

## Lancer

```bash
cd heures-dashboard
npm install
npm run dev
```

Ouvre l’URL affichée (souvent `http://localhost:5173`).

## Fonctionnalités

- **Saisie quotidienne** : heures par jour de la semaine (lun–dim), jours travaillés configurables
- **Objectifs** : min/max par jour et par semaine
- **Dans les clous** : calcule le total fait, le reste à faire, et l’idéal par jour restant pour viser le milieu de fourchette
- **Couleurs conditionnelles** : vert (dans la fourchette), ambre (sous le min), rouge (au-dessus du max)
- **Historique** : semaines passées avec total + balance (±h vs milieu de fourchette)
- **Persistance** : données dans `localStorage` du navigateur

## Défauts

- Jour : 7–8 h
- Semaine : 35–39 h
- Jours travaillés : lundi–vendredi
