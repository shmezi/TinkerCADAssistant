TinkerCad 4.0 Design:

3 Main Moving parts:

1. UI Injecting - (API-Content)
2. Backend, Logistical path (Worker):
   - Communication & Relaying of information
   - Downloading content
3. Data fetching site via Backend (Worker)

Systems:
1. UI Injection
2. Full page UI

Patch logic:
1. URL Listener -> Detects when a user navigates and the URL changes.
2. Table of current selectors with their resolvers.
3. Each URL change the table is reset and filled with the current url patches.
4. A loop is run overtop all of the patches for a page.

This patching logic allows us to optimize between each page, making sure we don't have duplicate logic etc.