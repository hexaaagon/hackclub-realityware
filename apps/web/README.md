# @realityware/web

## Development
make sure you already installed `bun` and initialized the whole repo `git clone -b main https://github.com/hexaaagon/hackclub-realityware.git`.
you need to setup [supabase](https://supabase.com/), [hackatime](https://hackatime.hackclub.com/oauth/applications), and [hack club account](https://auth.hackclub.com/developer/apps). and optionally [posthog](https://posthog.com/)

1. copy `.env.example` to `.env` located in root
2. provide providers api keys and values `.env`
3. generate random keys (`openssl rand -base64 64`), add them to `ENCRYPTION_SECRET_KEY`
4. setup slack bot in [here](https://github.com/hexaaagon/hackclub-realityware/blob/main/apps/bot/README.md) and provide the password to `SLACK_BOT_BACKEND_TOKEN`
5. run `bun install` and do what the log says
6. run `bun install` again

you're ready to developing this! run `bun dev` (in root) if you'd wanna start!
