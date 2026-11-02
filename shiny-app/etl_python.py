# Python ETL for Terra Nova River daily flow
# Source: Environment and Climate Change Canada, HYDAT via MSC GeoMet
# Station 02YS005, Terra Nova River at Glovertown, Newfoundland and Labrador
# Extract: paginated GeoMet API, hydrometric-daily-mean, STATION_NUMBER=02YS005
# Transform: drop missing discharge, parse dates, average daily discharge by year-month
# Load: terra_nova_monthly.csv (year, month, discharge in m3/s)
# Run in R via reticulate, or in Python directly. This pipeline was run
# locally on 2026-11-02 and produced 480 monthly rows, 1985-2024.
# The live Shiny app (app.R) fetches the same API in R and averages by month,
# so the published app does not depend on Python at runtime.

import requests
import pandas as pd

base = "https://api.weather.gc.ca/collections/hydrometric-daily-mean/items"
rows = []
offset = 0
while True:
    params = {"STATION_NUMBER": "02YS005", "limit": 10000, "offset": offset, "f": "json"}
    r = requests.get(base, params=params, timeout=60)
    r.raise_for_status()
    data = r.json()
    feats = data.get("features", [])
    for f in feats:
        p = f.get("properties", {})
        rows.append({"date": p.get("DATE"), "discharge": p.get("DISCHARGE")})
    if len(feats) < 10000:
        break
    offset += 10000

df = pd.DataFrame(rows)
df = df.dropna(subset=["discharge"])
df["date"] = pd.to_datetime(df["date"])
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
monthly = df.groupby(["year", "month"], as_index=False)["discharge"].mean()
monthly.to_csv("terra_nova_monthly.csv", index=False)
print(monthly.head())
print(len(monthly))
