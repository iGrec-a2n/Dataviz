# Correction 04 — Visualisation barplot

## Code

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.barplot(data=zone_kpi, x="zone", y="error_rate", order=zone_kpi["zone"], color="tomato")
plt.title("Taux d'erreur par zone")
plt.xlabel("Zone")
plt.ylabel("Taux d'erreur")
plt.xticks(rotation=20)
plt.tight_layout()
plt.show()
```

## Vérification attendue

- Le graphique est lisible.
- La zone la plus à risque apparaît en premier.

