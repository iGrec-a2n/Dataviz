# Correction 05 — Boxplot downtime

## Code

```python
import matplotlib.pyplot as plt
import seaborn as sns

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

sns.boxplot(data=robots_clean, x="robot_type", y="downtime_s", ax=axes[0])
axes[0].set_title("Downtime par type (avec outliers)")

sns.boxplot(data=robots_clean, x="robot_type", y="downtime_s", showfliers=False, ax=axes[1])
axes[1].set_title("Downtime par type (sans outliers)")

for ax in axes:
    ax.set_xlabel("Type de robot")
    ax.set_ylabel("Downtime (s)")

plt.tight_layout()
plt.show()
```

## Vérification attendue

- La médiane et la dispersion sont comparables entre types.
- La version sans outliers facilite la lecture du cœur de distribution.

