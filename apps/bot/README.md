## @realityware/bot

forked from [evan gan's horizons support bot](https://github.com/evan-gan/ticketSlackBot), and rewroted it with the same logic.

## Development
make sure you already installed `bun` and initialized the whole repo `git clone -b main https://github.com/hexaaagon/hackclub-realityware.git`.
you need to setup [supabase](https://supabase.com/),

1. copy `.env.example` to `.env` located in this directory `/apps/bot`
2. Go to [Slack API Apps](https://api.slack.com/apps)
3. Click "Create New App"
4. Click "From a manifest"
5. Select "YAML"
6. Copy and paste the manifest from `/apps/bot/manifest.yaml`
7. Install the app to your workspace
8. Navigate to "OAuth & Permissions" (in left sidebar once app created)
9. Copy the "Bot User OAuth Token" (starts with `xoxb-`) & put it in the .env
10. Navigate to "Basic Information"
11. Scroll down to "App-Level Tokens" and click "Generate token and Scopes"
12. Select all the options from the dropdown and name your token
13. Click generate and copy it (starts with `xapp-`) and put it in the .env
14. now, generate random keys (`openssl rand -base64 64`), add them to `DASHBOARD_BACKEND_TOKEN` and save it (will be used for the dashboard)
15. run `bun install`

you're ready to developing this! run `bun dev` (run in root if you want running it with dashboard) if you'd wanna start!
