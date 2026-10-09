# Architecture

React/Vite frontend communicates with Node/Express REST APIs. Express handles authentication, CSV upload, cleaning, Gemini orchestration and MongoDB persistence. Gemini is isolated in a backend service. Aggregations and trend calculations run locally on the server so the API is not called for every dashboard statistic.

## Pipeline
CSV → validation → column detection → cleaning/deduplication → MongoDB → batched Gemini analysis → normalized analysis → aggregation → synthesis → React dashboard.

## Academic modules
Authentication; Data Import; Preprocessing; AI/NLP Analysis; Similarity/Grouping; Recurring Issues; Trends/Emerging Issues; Synthesis; Business Insights; Dashboard; Reports.
