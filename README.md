<img alt="Hack Club Realityware Banner" src="./.github/assets/banner.png" />

<div align="center">
  <h1>Hack Club Realityware</h1>
  <p>Hack Club's (drafted) YSWS.</p>
</div>

<div align="center">
  <a href="https://hexaa.sh/realityware" target="_blank">realityware.hexaa.sh</a>
  &nbsp;
  <a href="https://hexaa.sh/realityware-ysws" target="_blank">rsvp now</a>
  &nbsp;
  <a href="https://hackclub.enterprise.slack.com/archives/C09QEU276SE" target="_blank">#realityware</a>
</div>

## What's Hack Club Realityware?
Hack Club Realityware is another YSWS from Hack Club, the main objective is to solve a real-world problem using technology, and bring it to life. You will get a prize afterwards!

## Monorepo Structure
```yml
apps:
  - backend: Using Hono, act as a Rest API and an RPC for the frontend and the bot.
  - frontend: Using Next.js, accessible via `realityware.hexaa.sh`.
  - docs: Currently blank, will be used to host the documentation for the project.
  - bot: Using @slack/bolt and Hono, used to interact with the Hack Club Slack workspace and act as an RPC for the backend.
  
packages:
  - auth: Using `better-auth` as the authentication provider.
  - database: Using Supabase and `drizzle-orm` as the database.
  - env: A type-safe environment variable loader using `t3-env`.
  - rpc: Using Hono RPC for type-safe RPC calls between the backend and the bot.
  - shard: A shared package used across the monorepo, containing types and zod schemas.
  - telemetry: A Posthog wrapper used to track telemetry data.
  - util: A shared utility package used across the monorepo.
```

## AI Usage
AI was used to help hexaa to debug and fix errors.

## Are you a Horizons Reviewer?
I've built a further explanation [here](https://github.com/hexaaagon/hackclub-realityware/blob/dev/REVIEWERS.md).
