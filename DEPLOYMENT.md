# Publish this existing application on Render

This is a Node web service, not a static site. GitHub Pages cannot run its Groq backend. No application rebuild or architecture changes are required.

1. Sign in at https://dashboard.render.com/ and choose **New → Web Service**.
2. Connect the existing GitHub repository `rehan-mehmood-tech/Pakistan-Kitchen-Engineering-whatsapp-agent`, branch `main`.
3. Use runtime **Node**, leave the root directory empty, build command `npm install --ignore-scripts --no-audit --no-fund`, start command `npm start`.
4. Add these environment variables in Render:
   - `NODE_VERSION`: `24`
   - `GROQ_MODEL`: `openai/gpt-oss-20b`
   - `GROQ_API_KEY`: enter the real key securely in Render. Codex's proxy-backed secret does not transfer to Render.
5. Choose your plan and click **Create Web Service**. When deployment is live, open the HTTPS URL Render assigns. That is the link to share on WhatsApp. A free plan, if available, may sleep when idle.

The application uses Render's injected PORT automatically. Do not set the Codex proxy variables on Render.

## Verification before sharing

Open the public URL in a private browser window. Ask about the double basket gas fryer (sample PKR 85,000), request a quotation, and supply fictional name, phone, city and quantity. Check the lead in the dashboard, simulate a follow-up, and assign it to staff. These actions are a local demonstration, not real WhatsApp messages or staff notifications. Browser storage is device-specific.

## Verified in Codex

The existing application started successfully. Four server checks passed; the missing-key test was skipped because a key is configured. Live Groq replies and structured lead capture returned HTTP 200 using `GROQ_MODEL=openai/gpt-oss-20b`. The code's default `llama-3.3-70b-versatile` returned `model_not_found`, so the model override above is required for the tested account. No application logic or UI was changed.

No public website deployment was performed from Codex: this session has no website publishing tool or configured hosting credentials. Publishing a Codex development environment does not deploy the website.
