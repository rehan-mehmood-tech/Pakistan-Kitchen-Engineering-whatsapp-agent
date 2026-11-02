# Pakistan Kitchen Engineering — AI Sales Assistant Demo

A lightweight Node.js and vanilla JavaScript demonstration. No real WhatsApp messages or staff notifications are sent. The equipment catalog and seeded leads are fictional. No financial figures or budget qualification are included.

## Run

Requires Node.js 22 or newer. The application has no external runtime dependencies.

```sh
cp .env.example .env
# Enter GROQ_API_KEY securely in .env; never commit it.
npm start
```

Open port 3000. Optional server variables: `PORT` and `GROQ_MODEL` (default `openai/gpt-oss-20b`). Missing-key state remains explicit. The backend needs HTTPS access to `api.groq.com`. In a Codex environment with injected proxy-backed secrets, use Node 24's `node --use-env-proxy --env-file-if-exists=.env server.mjs`. Do not copy Codex proxy settings to Render.

## Response architecture

One Groq Chat Completions request generates natural-language text. No `response_format`, JSON envelope, or model-generated lead schema is required for conversation. The selected GPT-OSS model uses its supported low reasoning effort. Another configured model is used as configured; credentials and model failures are explicit, without a silent model or scripted-chat fallback.

`leads.mjs` separately extracts explicit customer-provided fields and contextual answers to qualification questions. It validates lengths, names, catalog interests and Pakistani mobile formats. It never extracts facts from assistant examples. Partial details appear immediately; equipment need, name and a valid contact number make a lead ready for human follow-up. City is preferred but optional. Ambiguous product types remain marked as needing confirmation. Unknown free-form details may need a clear label (e.g. `city: Abbottabad`) or an answer to a direct question. Extraction is conservative and rule-based, not general-purpose multilingual entity recognition. Extraction failure returns a warning and does not discard a valid AI reply.

Progressive updates reuse a single current lead ID. A failed response can be retried without adding the customer turn or a second lead. The client reuses the turn's request ID for correlation. There is no server-side idempotency cache, so retrying after a lost connection can incur another provider call; it still updates one local lead.

## Temporary sessions

Each page load creates a fresh in-memory session, welcome message and seven fictional sample leads. Chat messages, active customer details and newly created demo leads reset on refresh, close/reopen or opening another tab. Back-forward cache restoration reloads the demo to avoid restoring private context. Reset starts another fresh session.

Only the obsolete `pke-demo-v1` browser storage key is removed. No other storage is cleared, no database is used, and no backend conversation sessions are introduced. Active-page navigation between chat, dashboard and catalog preserves current context.

## Conversation limits

Customer messages: 2,000 characters each. Accepted assistant replies and submitted assistant history: 8,000 characters each. At most 100 messages per request. The model context retains all customer turns (up to 16,000 customer characters total), and recent assistant turns up to a 24,000-character history budget. Omitting old assistant turns displays a notice. Customer requirements are never silently dropped. Above the supported budget, an understandable error keeps existing messages visible and asks the visitor to copy relevant information and reset. The HTTP request byte limit is 200,000 bytes.

## Errors and diagnostics

A provider request has a 25-second total deadline including retries. Temporary provider 5xx/network failures retry at most once. Empty, oversized or truncated completions receive one corrective request asking for a shorter complete reply. Authentication, model, rate-limit and JSON-validation rejections are not retried identically. No raw upstream exception, key, prompt, phone number or private conversation is logged.

Diagnostics contain request ID, model, phase (`generation` or `extraction`), category, attempt, provider status when available and elapsed milliseconds. The UI offers manual retry with a request reference on server errors. An account rate limit requires waiting or adjusting Groq account limits; it cannot be repaired by prompt changes. The demonstration's existing throttle also limits traffic to 15 requests per minute per socket IP. A shared reverse-proxy IP can share this limit; per-visitor production rate limiting remains a deployment consideration.

## Tests

```sh
npm test            # deterministic unit and isolated HTTP integration tests; no API key needed
npm run check       # syntax checks; there is no compilation/build step
npm run test:live   # opt-in, real Groq requests; start server first
```

Live checks make nine potentially billable requests, paced 22 seconds apart. They cover greetings, non-financial product discovery, early contact details, optional city refusal, cafe menu recommendations, uncertainty, and English/Urdu responses. A provider account limit may still require a later retry.

Browser tests use test-only Playwright, not an application dependency. If Playwright is already installed, use `npm run test:browser`. This cloud workspace can use the separate test runner:

```sh
PLAYWRIGHT_MODULE_PATH=/tmp/pke-browser-check/node_modules/playwright/index.mjs npm run test:browser
```

Set `CHROMIUM_PATH` if the browser is not `/usr/bin/chromium`. Browser tests run an isolated mocked-AI HTTP server; they validate actual DOM interactions, reload/new-tab isolation, legacy-key cleanup, unrelated storage preservation, progressive leads, retries, mobile widths, follow-ups, handoff, catalog and reset. Real Groq behavior is tested separately.

## Deploy

Use the existing Render Node web service connected to GitHub `main`. Start command: `npm start`; Node version: 24; model: `openai/gpt-oss-20b`; key entered securely in Render. See [DEPLOYMENT.md](DEPLOYMENT.md). Static hosting alone cannot run the backend. Local tests and a Git push do not prove Render has deployed successfully.

## Inquiry-only business policy

The assistant discovers equipment requirements and collects basic contact information; it never closes sales, negotiates, quotes amounts, discusses payment terms or asks for budgets. `catalog.mjs` contains 25 structured fictional options spanning fryers, cooking, baking, refrigeration, preparation, washing/ventilation and food holding. No financial fields are exposed through the catalog API or catalog UI.

`policy.mjs` checks generated replies for prohibited financial content, repeated requests for known/declined fields, and exact-address requests. Financial sentences are removed only when enough complete, safe AI-generated text remains. Otherwise a violating reply gets at most one corrective AI request; persistent violations return a safe retry error instead of leaking the reply. No scripted conversational fallback is substituted. This is defense in depth alongside the system prompt, not a mathematical guarantee for every wording in every language.

Lead fields now include multiple equipment interests, category, type, quantity, intended use, business type, preferences, optional notes, and skipped/unknown fields. Financial data is not extracted into lead fields or notes. Customer messages themselves remain in transient conversation memory, including any financial information a visitor voluntarily typed. New equipment preferences preserve existing contact/location information. Statuses distinguish New Inquiry, Exploring Requirements, Contact Details Collected and Ready for Human Follow-Up. Follow-ups and staff assignments remain simulations.
