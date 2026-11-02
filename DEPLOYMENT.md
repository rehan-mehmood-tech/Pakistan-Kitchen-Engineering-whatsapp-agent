# Update the existing Render deployment

Use the existing GitHub repository `rehan-mehmood-tech/Pakistan-Kitchen-Engineering-whatsapp-agent`, branch `main`, and existing Render service. No new repository, framework or service is required.

1. Push the tested source changes to `main`.
2. If Render auto-deploy is enabled, wait for the deployment for that commit to become Live. Otherwise select **Manual Deploy → Deploy latest commit** in the existing service.
3. Preserve the current environment settings. Confirm `NODE_VERSION=24`, `GROQ_MODEL=openai/gpt-oss-20b` (or unset to use the default), and a valid `GROQ_API_KEY` entered securely in Render. Codex's proxy-backed key is not transferred to Render.
4. Existing build command `npm install --ignore-scripts --no-audit --no-fund` and start command `npm start` still work. The app has no runtime package dependencies or frontend build step. Render's injected `PORT` is used automatically.
5. Verify https://pakistan-kitchen-engineering-whatsapp.onrender.com in a private browser window after it is Live.

## Public acceptance checks

- Send `hello`, `salam o alikum`, `aoa, kya haal ha`, and a Roman Urdu language preference. Expect real conversational replies, not JSON-format errors or off-topic refusals.
- Ask about a double basket gas fryer: expect relevant fictional options and no financial figures, budget questions or inventory commitments.
- Supply fictional name, phone, city and quantity one at a time. Check progressive details, one dashboard lead, human follow-up readiness, simulated follow-up and handoff.
- Refresh: welcome state and no previous personal details. New tabs and close/reopen must also start independently.
- Keep a tab open and continue: context should remain. Test a failed-request retry without duplicate turns or leads.
- Existing unrelated browser storage must survive; only obsolete `pke-demo-v1` data is removed.

## Safe production diagnostics

Filter Render logs by the request reference shown in the UI. Logs identify phase, category, provider status, model, attempt and duration without customer text or secrets. `GROQ_AUTH` means check the Render key/account permissions; `GROQ_MODEL` means correct an obsolete model override; `GROQ_RATE_LIMIT` means wait or inspect Groq usage limits. Never share raw authorization headers or private conversation payloads.

No production success should be claimed until the deployed commit and public acceptance checks are verified. A Git push may trigger auto-deploy; publishing a Codex environment is a separate operation and is not required.
