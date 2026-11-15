import json, pandas as pd, numpy as np, os, urllib.request
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as MplPolygon
from matplotlib.collections import PatchCollection

base = os.path.dirname(os.path.abspath(__file__))
can_path = os.path.join(base, "canada.geo.json")
with open(can_path) as f:
    can = json.load(f)

df = pd.read_csv(os.path.join(base, "station_inventory_en.csv"), skiprows=3)
nl = df[df['Province'] == 'NEWFOUNDLAND'].copy()
nl['years_run'] = nl['Last Year'] - nl['First Year']
nl['era'] = pd.cut(nl['First Year'], bins=[0, 1950, 1980, 3000], labels=['Before 1950', '1950-1980', 'After 1980'])

fig, ax = plt.subplots(figsize=(12, 9))
fig.patch.set_facecolor('white')
ax.set_facecolor('#eaf2f8')

patches = []
for feat in can['features']:
    geom = feat['geometry']
    polys = [geom['coordinates']] if geom['type'] == 'Polygon' else geom['coordinates']
    for poly in polys:
        for ring in poly:
            patches.append(MplPolygon(ring, closed=True))
ax.add_collection(PatchCollection(patches, facecolor='#d9d9d9', edgecolor='white', linewidths=0.6, zorder=1))

colors = {'Before 1950': '#1b4f72', '1950-1980': '#2e86c1', 'After 1980': '#f39c12'}
for era, col in colors.items():
    sub = nl[nl['era'] == era]
    sz = 20 + (sub['years_run'] / 108.0) * 160
    ax.scatter(sub['Longitude (Decimal Degrees)'], sub['Latitude (Decimal Degrees)'],
               s=sz, c=col, alpha=0.85, edgecolors='white', linewidths=0.5, zorder=3, label=f"{era}  (n={(nl['era'] == era).sum()})")

ax.scatter([-52.70], [47.57], marker='*', s=360, c='#c0392b', edgecolors='white', linewidths=0.8, zorder=5)
ax.text(-53.6, 47.75, "St. John's", ha='right', fontsize=10, fontweight='bold', color='#c0392b', zorder=5)

ax.annotate("Belle Isle\noldest, 1871", xy=(-55.38, 51.88), xytext=(-63.0, 54.8),
            fontsize=9, color='#1b4f72', fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#1b4f72', lw=1.2))
ax.annotate("Port aux Basques\nlongest run, 108 yrs", xy=(-59.15, 47.62), xytext=(-66.3, 50.2),
            fontsize=9, color='#1b4f72', fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#1b4f72', lw=1.2))

ax.set_xlim(-67.5, -51.5)
ax.set_ylim(46.3, 60.6)
ax.set_aspect('equal', adjustable='box')
ax.set_xlabel("Longitude", fontsize=10)
ax.set_ylabel("Latitude", fontsize=10)
ax.grid(True, color='white', linewidth=0.7, alpha=0.9, zorder=0)
ax.tick_params(labelsize=9)
ax.legend(title="First year", loc='lower left', fontsize=10, title_fontsize=11, framealpha=0.95, facecolor='white')

fig.suptitle("Newfoundland's weather stations: 1871-2026", fontsize=20, fontweight='bold', x=0.5, y=0.97)
fig.text(0.5, 0.93, "341 stations  •  How spread out are they, and how long has each one run?", fontsize=12, color='#333333', ha='center')
fig.text(0.5, 0.905, "Colour = when it started  •  Bigger dot = ran for longer  •  ★ St. John's", fontsize=11, color='#555555', ha='center')
fig.text(0.5, 0.02, "Data: Environment Canada, Station Inventory (modified 30 Sep 2026)  •  50 stations still active in 2026  •  Median start year: 1981", fontsize=9, color='#666666', ha='center')
fig.text(0.5, 0.005, "Made by prompting only — #30DayMapChallenge 2026, Day 10: Prompting only  •  Shima Bahramnejad, Geospatial Data Analytics, NSCC COGS", fontsize=9, color='#666666', ha='center')

plt.tight_layout(rect=[0, 0.04, 1, 0.89])
out = os.path.join(base, "day10_nl_weather_stations.png")
plt.savefig(out, dpi=200, bbox_inches='tight')
print("saved", out)
print("NL stations:", len(nl))
