---
marp: true
title: "Cours SQL — Plan"
description: "Plan du cours SQL (PostgreSQL) + fil rouge + exercices"
paginate: true
---

# Cours SQL (PostgreSQL)

---

## Objectifs 

- Installer PostgreSQL et importer une base d'exemple
- Comprendre SQL vs NoSQL (grands modèles)
- Créer des tables (DDL) simplement
- Interroger des données (`SELECT`, filtres, tri, pagination)
- Comprendre le relationnel (PK/FK) et croiser des tables (jointures)
- Produire des indicateurs (agrégation)

- Exercices Tps et `starter-db` 
- [Dépôt](https://github.com/Antoine07/db)


---

## Fil rouge (utilisé dans tous les chapitres)

Base `shop` (fil rouge e-commerce) :
- `customers` (clients)
- `products` (produits)
- `orders` (commandes)
- `order_items` (lignes de commande)
- `categories` (catégories)

Objectif : savoir interroger et faire évoluer ce schéma proprement.

---

## Schéma UML

![Schéma UML Boutique](https://antoine07.github.io/db_web2.2/assets/boutique_uml.svg)


---

## Chapitre Dataviz


- [Dataviz robots avec Python](https://antoine07.github.io/db_web2.2/dataviz_robots_python.html)

