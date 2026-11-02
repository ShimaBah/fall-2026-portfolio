# Shiny app: Terra Nova River at Glovertown - monthly river flow

Live app (Posit Connect Cloud):
https://connect.posit.cloud/shimabahramnejad/content/01a19c64-4e47-30c7-7834-0bcd53e62864

Choose a year (1985-2024) to see the monthly mean river flow for that year.

## Data
- Source: Environment and Climate Change Canada, HYDAT via MSC GeoMet
- Station: 02YS005, Terra Nova River at Glovertown, Newfoundland and Labrador
- Daily discharge, averaged by month. Discharge is river flow in cubic metres per second.
- Years in the app: 1985-2024 (40 years, 480 monthly values)

## Files
- `app.R` - R Shiny app. Fetches the HYDAT daily-mean API in R (httr/jsonlite),
  averages daily discharge by year-month, and plots the chosen year.
- `etl_python.py` - Python ETL pipeline for the same data (pandas/requests,
  run via reticulate in R). Extracts the paginated GeoMet API, drops missing
  discharge, averages by year-month, and saves `terra_nova_monthly.csv`.
  The live app itself fetches in R, so it does not depend on Python at runtime.

## Earlier version
The first published version of this app (2026-11-02 morning) was a simple
disp vs horsepower scatterplot using R built-in mtcars data. It was replaced
the same day by this Terra Nova River app.
