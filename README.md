# Pakistan Kitchen Engineering — AI Sales Assistant Demo

A responsive WhatsApp-inspired sales demonstration with Groq chat, browser-persisted leads, a staff dashboard, sample equipment catalog, follow-up simulation, and human handoff. No real WhatsApp messages or staff notifications are sent.

## Run

Requires Node.js 22. The application uses built-in Node modules and has no package dependencies.

```sh
cp .env.example .env
# Set GROQ_API_KEY securely in .env; never commit it.
npm start
```

Open port 3000. Optional variables: `PORT`, `GROQ_MODEL` (default `openai/gpt-oss-20b`). Without a key, dashboard features work and chat shows an explicit setup state. Keys stay server-side. The backend needs HTTPS access to `api.groq.com`. If the hosting environment supplies proxy-backed credentials, ensure its Node fetch configuration supports the platform proxy; this environment can use `NODE_USE_ENV_PROXY=1`.

## Deployment

Deploy as a Node web service, start command `npm start`, set `GROQ_API_KEY` in the host's secret settings, and expose the injected `PORT`. Do not serve only the public folder: live AI requires the server. This session does not include a Sites connector or public hosting deployment tool.

## Demo journey

Ask for a double basket gas fryer, request a quote, and supply fictional name, phone, city, and quantity. The server requests structured extraction from Groq; a sufficiently complete lead appears in this browser's dashboard. Open it, simulate follow-up, then assign to sales staff. Reset restores the seven fictional records and clears live demo data.

Use fictional contact details. All prices are sample data. Browser-only data is not shared across devices. A simulated follow-up changes the lead to Qualified (awaiting response), stores its timestamp, and appears in conversation history. Closed and handed-off records cannot receive simulated follow-ups. Public production hosting should add durable server storage and deployment-level abuse protection before wider use; the demo has message limits, a 25-second API timeout, and a per-IP in-memory request throttle.

## Checks

`npm test` exercises the server's catalog, setup state, request handling, and static assets. Validate actual Groq replies with a valid server secret; no live AI success is claimed without that verification.

## AI language and connection diagnostics

The assistant matches the latest meaningful customer message (English, Urdu script, or Roman Urdu), preserves language across contact-only replies, and redirects unrelated questions to kitchen equipment. Generated demo confirmations, follow-ups, and handoff messages use the same language. The UI and browser storage are unchanged.

The default model is now `openai/gpt-oss-20b`. On Render, set `GROQ_MODEL=openai/gpt-oss-20b` or remove an old explicit model override; changing the code default does not override an environment variable. Ensure `GROQ_API_KEY` is set in Render's environment, not only in Codex. Do not paste secrets into logs or source.

Server logs contain only event, diagnostic code, HTTP status (when available), and model. They never include authorization headers, prompts, customer messages, upstream error bodies, or keys:

- `GROQ_MODEL`: selected model unavailable; correct `GROQ_MODEL` on Render.
- `GROQ_AUTH`: key rejected or unauthorized; check the server key and Groq account permissions.
- `GROQ_RATE_LIMIT`: account usage limit reached; wait and check Groq usage/limits. Client retry is manual to avoid repeated account usage.
- `GROQ_UPSTREAM`: upstream rejected the request or has a temporary service problem. Check the logged HTTP status.
- `GROQ_NETWORK` / `GROQ_TIMEOUT`: connection failure or 25-second request deadline.
- `GROQ_RESPONSE_FORMAT` / `GROQ_TRUNCATED`: incomplete or invalid structured response; retry with a shorter message.

A JSON-validation rejection or upstream 5xx is retried once within the same 25-second deadline. Authentication, model and rate-limit failures are not automatically retried. No scripted replies replace a failed AI request.

With the server running, `npm test` runs mocked error handling and local server regression checks. `npm run test:live` makes nine real, potentially billable Groq requests through the application and spaces them 22 seconds apart to reduce account rate-limit failures. Use `TEST_BASE_URL` to select the local test server. `LIVE_CASE_FILTER` optionally selects case names by regular expression; selected runs do not assert that skipped scenarios passed.
