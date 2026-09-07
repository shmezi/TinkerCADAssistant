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


Messaging required by system:
Worker -> Main-Content : On URL Change
Main-Content -> Worker : Request downloads

Main-Content -> Worker -> Api-Content : Request data
Api-Content -> Worker -> Main-Content : Return data


Command / Relay framework:

2 Main sections:

1. Core relay - service-worker | Content script's register their domain ex: api, main or even the worker.
2. Client devices - all | Each device registers against the core and can send anyone in the network a message and recieve aswell.

Clients can send other clients messages.

A message format shall be as follows:

ClientId | ReplyID | Command | CommandArgs

Every message sent via the service SHALL get a response.