# Pakistan Kitchen Engineering — AI Sales Assistant Demo

A responsive WhatsApp-inspired sales demonstration with Groq chat, browser-persisted leads, a staff dashboard, sample equipment catalog, follow-up simulation, and human handoff. No real WhatsApp messages or staff notifications are sent.

## Run

Requires Node.js 22. The application uses built-in Node modules and has no package dependencies.

```sh
cp .env.example .env
# Set GROQ_API_KEY securely in .env; never commit it.
npm start
```

Open port 3000. Optional variables: `PORT`, `GROQ_MODEL` (default `llama-3.3-70b-versatile`). Without a key, dashboard features work and chat shows an explicit setup state. Keys stay server-side. The backend needs HTTPS access to `api.groq.com`. If the hosting environment supplies proxy-backed credentials, ensure its Node fetch configuration supports the platform proxy; this environment can use `NODE_USE_ENV_PROXY=1`.

## Deployment

Deploy as a Node web service, start command `npm start`, set `GROQ_API_KEY` in the host's secret settings, and expose the injected `PORT`. Do not serve only the public folder: live AI requires the server. This session does not include a Sites connector or public hosting deployment tool.

## Demo journey

Ask for a double basket gas fryer, request a quote, and supply fictional name, phone, city, and quantity. The server requests structured extraction from Groq; a sufficiently complete lead appears in this browser's dashboard. Open it, simulate follow-up, then assign to sales staff. Reset restores the seven fictional records and clears live demo data.

Use fictional contact details. All prices are sample data. Browser-only data is not shared across devices. A simulated follow-up changes the lead to Qualified (awaiting response), stores its timestamp, and appears in conversation history. Closed and handed-off records cannot receive simulated follow-ups. Public production hosting should add durable server storage and deployment-level abuse protection before wider use; the demo has message limits, a 25-second API timeout, and a per-IP in-memory request throttle.

## Checks

`npm test` exercises the server's catalog, setup state, request handling, and static assets. Validate actual Groq replies with a valid server secret; no live AI success is claimed without that verification.
