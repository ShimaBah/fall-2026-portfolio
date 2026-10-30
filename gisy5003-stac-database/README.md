# STAC Metadata Database Design (GISY5003)

STAC-based metadata database for bathymetry survey data, designed in PostgreSQL.

Design stage (Assignments 1A/1B, Fall 2026):
- Conceptual / logical model based on the SpatioTemporal Asset Catalog (STAC).
- Collections, dataset items (identifier, title, description, latitude/longitude bounds, start/end dates, coordinate reference system), assets (URL, title, description, type/format, unique key, role — for example a GeoTIFF bathymetry file plus a PNG thumbnail), and providers with roles (for example licensor + host for COGS; licensor + producer + processor for a student dataset).
- Entity-relationship diagram: `BahramnejadShima_A1ERD.docx` in this folder, as submitted for the design stage.

Status: the physical database in SQL (Assignment 2, due 15 November 2026) is not yet in this repo. It will be added when it is submitted, as `assignment_2.sql`.
