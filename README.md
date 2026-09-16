# whiskey-hunter

An on-demand OpenComputer serverless agent for researching limited whisky and whiskey releases. Uses Exa to find release announcements and production details, then returns up to five cited entries with dates, evidence and uncertainty.

## Scope

Release research, not a shopping service. No retailer sourcing, stock alerts, price comparisons, shipping checks, auction bidding or purchases. No schedule is enabled. No email or social messages are sent.

Tell it which distilleries or series interest you, the release date range, and editions already in your collection. It asks before searching if that brief is missing. A broad editorial research brief is also supported. Never assumes knowledge of someone else's collection.

## Run

Requires Node 22+, an OpenComputer account, and an Exa API key from https://dashboard.exa.ai/api-keys.

```sh
npm install
npx opencomputer login
npx opencomputer link --create-project whiskey-hunter
npm run connect:exa
npm run deploy
npm run session -- --agent whiskey-hunter "Research official limited-edition release announcements from the distilleries in my next message. Ask for my interests before searching."
```

Link your own OpenComputer project before deploying. `connect:exa` reads the key with terminal echo disabled and sends it through stdin to OpenComputer's managed secret store. Do not paste keys into agent chat or commit them. The connection permits POST requests only to Exa's `/search` path; its key is injected by the egress proxy.

## Output

Exact expression/year/batch; announcement or release date; sourced age/ABV/cask/bottle count; relevance to your brief; citations; confidence; research timestamp and remaining unknowns. Old news is not presented as a new release. Missing evidence is labelled rather than filled in.

## Runtime and cost

`opencomputer/agents/whiskey-hunter/agent.ts` selects `anthropic/claude-sonnet-4.6`; change the model string to an available provider/model. OpenComputer runs the loop, tools, VM and durable session history. Preferences persist within a session; no cross-session memory is configured.

Each Exa call requests at most five results and 4,000 text characters each. The prompt limits searches to six per user request; this is not an enforced dollar cap. Exa, model and runtime charges apply. There are no automatic search retries, and no cron runs. A failed/empty search is reported explicitly.

## Checks

```sh
npm run build
npm test
npm run doctor
```

Tests check query/date validation, output bounds, unsafe URL rejection, duplicate removal and malformed upstream responses. Live Exa verification requires a configured key and is separate from these tests.
