# Premier League Live Dashboard

A single-page React + Vite experience that surfaces live Premier League information — standings,
leaderboards, fixtures and club hubs — using the free [football-data.org](https://www.football-data.org/)
API.

## Getting started

```bash
npm install
```

### Configure your API token

1. Sign up for a free account at [football-data.org](https://www.football-data.org/)
2. Copy your personal API token (the service emails it after registration)
3. Create a `.env` file in the project root and expose the token for Vite:

```bash
echo "VITE_FOOTBALL_DATA_TOKEN=your-token-here" > .env
```

The app reads this environment variable at runtime and injects it into every request via the
`X-Auth-Token` header.

## Development

Run the Vite development server with hot reloading:

```bash
npm run dev
```

## Production build

Compile an optimized build and check that TypeScript passes:

```bash
npm run build
```

## Project highlights

- Hash-based navigation with views for home, teams, team detail, stats and about
- Live standings, upcoming fixtures and latest results direct from football-data.org
- Dynamic leaderboards for goals, assists and combined contributions
- Club hubs featuring results, fixtures, squad lists and quick-form insights
- Analytics dashboard summarising attacks, win pace, form momentum and narrative notes
- Guaranteed coverage of all 20 Premier League clubs with a full league table view and team directory built from the live standings feed
