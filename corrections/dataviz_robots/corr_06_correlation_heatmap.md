# Correction 06 — Corrélation et heatmap

## Code

```python
import matplotlib.pyplot as plt
import seaborn as sns

num_cols = ["mission_duration_s", "downtime_s", "battery_pct", "speed_mps", "temperature_c"]
corr = robots_clean[num_cols].corr(numeric_only=True)

plt.figure(figsize=(8, 6))
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", vmin=-1, vmax=1, square=True)
plt.title("Matrice de corrélation")
plt.tight_layout()
plt.show()
```

## Vérification attendue

- La diagonale vaut 1.
- Les interprétations distinguent bien corrélation et causalité.

