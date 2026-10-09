# Implementation notes

The supplied dataset was not available as a valid CSV in the current build environment, so the application intentionally does not contain fabricated analytics. Upload the real CSV through Data Import. The importer supports optional date/rating/product/category/source fields and detects likely names automatically.

If Gemini is not configured, upload and inspection still work; AI analysis requires GEMINI_API_KEY. MongoDB is required for persistence.
