import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  attackingStats,
  heroMatch,
  leagueTable,
  momentumTrend,
  recentHighlights,
  tableInsights,
  teams,
  topScorers,
  type Team,
} from './data/mockData'

type Route = {
  page: 'home' | 'teams' | 'team' | 'stats' | 'about'
  teamId?: string
}

const parseHash = (hash: string): Route => {
  const cleaned = hash.replace(/^#/, '').replace(/^\//, '')
  if (!cleaned || cleaned === '') {
    return { page: 'home' }
  }

  const [segment, slug] = cleaned.split('/')
  switch (segment) {
    case 'teams':
      return { page: 'teams' }
    case 'team':
      if (slug) {
        return { page: 'team', teamId: decodeURIComponent(slug) }
      }
      return { page: 'teams' }
    case 'stats':
      return { page: 'stats' }
    case 'about':
      return { page: 'about' }
    default:
      return { page: 'home' }
  }
}

const navigation = [
  { label: 'Home', path: '#/' },
  { label: 'Teams', path: '#/teams' },
  { label: 'Stats', path: '#/stats' },
  { label: 'About', path: '#/about' },
]

type NavigationProps = {
  current: Route['page']
  onNavigate: (path: string) => void
}

const NavigationBar = ({ current, onNavigate }: NavigationProps) => (
  <nav className="flex flex-wrap gap-3">
    {navigation.map((item) => {
      const active =
        (item.label === 'Home' && current === 'home') || item.label.toLowerCase() === current
      return (
        <button
          key={item.path}
          type="button"
          onClick={() => onNavigate(item.path)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            active
              ? 'border-brand bg-brand/20 text-brand shadow-lg shadow-brand/30'
              : 'border-slate-700 bg-slate-900/40 text-slate-200 hover:border-brand/50 hover:text-brand'
          }`}
        >
          {item.label}
        </button>
      )
    })}
  </nav>
)

type HomePageProps = {
  onNavigate: (path: string) => void
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  const topFive = leagueTable.slice(0, 5)

  return (
    <div className="space-y-10">
      <section className="glass-card overflow-hidden">
        <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_minmax(0,1fr)]">
          <div className="space-y-6">
            <span className="stat-badge">Match of the week</span>
            <div className="space-y-3">
              <h2 className="page-title text-4xl font-bold text-white md:text-5xl">
                {heroMatch.homeTeam}{' '}
                <span className="text-brand">{heroMatch.homeScore}</span>
                <span className="mx-2 text-slate-400">vs</span>
                <span className="text-brand">{heroMatch.awayScore}</span> {heroMatch.awayTeam}
              </h2>
              <p className="text-lg text-slate-300">{heroMatch.competition}</p>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                {heroMatch.date}
              </p>
            </div>
            <p className="max-w-2xl text-slate-200">
              Arsenal&apos;s electric front line overwhelmed Chelsea at the Emirates, with Bukayo Saka
              pulling the strings and new signing Declan Rice dictating the tempo. Relive the key
              numbers, check the league picture and catch what&apos;s next in this week&apos;s live centre.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('#/teams')}
                className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-brand/30 transition hover:shadow-brand/40"
              >
                Explore all teams
              </button>
              <button
                type="button"
                onClick={() => onNavigate('#/stats')}
                className="rounded-full border border-slate-600 px-6 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand/40 hover:text-brand"
              >
                Dive into stats
              </button>
            </div>
          </div>
          <div className="gradient-border">
            <div className="gradient-inner space-y-6">
              <h3 className="text-xl font-semibold text-slate-100">Latest score centre</h3>
              <ul className="space-y-4">
                {recentHighlights.map((match) => (
                  <li key={match.id} className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{match.date}</span>
                      <span>{match.competition}</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-100">
                      {match.homeTeam}{' '}
                      <span className="text-brand">{match.homeScore}</span>
                      <span className="mx-2 text-slate-500">—</span>
                      <span className="text-brand">{match.awayScore}</span> {match.awayTeam}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-100">Top of the league</h3>
            <span className="text-sm text-slate-400">Matchday 9 snapshot</span>
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-800/70">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Pos</th>
                  <th className="px-4 py-3">Club</th>
                  <th className="px-4 py-3">P</th>
                  <th className="px-4 py-3">W</th>
                  <th className="px-4 py-3">D</th>
                  <th className="px-4 py-3">L</th>
                  <th className="px-4 py-3">GD</th>
                  <th className="px-4 py-3">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-200">
                {topFive.map((entry) => (
                  <tr key={entry.teamId} className="table-row">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-400">{entry.position}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onNavigate(`#/team/${entry.teamId}`)}
                        className="text-left font-semibold text-slate-100 transition hover:text-brand"
                      >
                        {entry.team}
                      </button>
                      <p className="text-xs text-slate-500">Form: {entry.form}</p>
                    </td>
                    <td className="px-4 py-3">{entry.played}</td>
                    <td className="px-4 py-3">{entry.won}</td>
                    <td className="px-4 py-3">{entry.drawn}</td>
                    <td className="px-4 py-3">{entry.lost}</td>
                    <td className="px-4 py-3">{entry.goalDifference}</td>
                    <td className="px-4 py-3 font-semibold text-brand">{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-100">Top scorers</h3>
            <span className="text-sm text-slate-400">Goals + assists</span>
          </div>
          <ul className="mt-4 space-y-3">
            {topScorers.map((scorer, index) => (
              <li
                key={scorer.id}
                className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/20 font-semibold text-brand">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-100">{scorer.player}</p>
                    <p className="text-xs text-slate-400">{scorer.team}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 text-slate-300">
                  <span className="text-brand">{scorer.goals} G</span>
                  <span>{scorer.assists} A</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

type TeamsPageProps = {
  onNavigate: (path: string) => void
}

const TeamsPage = ({ onNavigate }: TeamsPageProps) => (
  <div className="space-y-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="page-title text-3xl font-semibold text-white">Premier League clubs</h2>
        <p className="text-slate-300">Tap a crest to open the club hub with fixtures, form and star players.</p>
      </div>
      <button
        type="button"
        onClick={() => onNavigate('#/')}
        className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand/50 hover:text-brand"
      >
        Back to home
      </button>
    </div>

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {teams.map((team) => (
        <article key={team.id} className="team-card">
          <div className="flex items-center gap-4">
            <img
              src={team.logo}
              alt={`${team.name} crest`}
              className="h-16 w-16 rounded-full border border-slate-700/70 bg-slate-900/60 p-2"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{team.name}</h3>
              <p className="text-sm text-slate-400">Founded {team.founded}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{team.description}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {team.strengths.map((strength) => (
              <span key={strength} className="rounded-full bg-slate-900/60 px-3 py-1">
                {strength}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>
              Form:{' '}
              <span className="font-semibold text-brand">{team.lastFive.join(' ')}</span>
            </span>
            <span>{team.stadium}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(`#/team/${team.id}`)}
            className="rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/30"
          >
            View club hub
          </button>
        </article>
      ))}
    </div>
  </div>
)

type TeamPageProps = {
  team?: Team
  onNavigate: (path: string) => void
}

const OutcomeBadge = ({ outcome }: { outcome: 'W' | 'D' | 'L' }) => {
  const map = {
    W: 'bg-brand/25 text-brand border-brand/50',
    D: 'bg-slate-800/60 text-slate-200 border-slate-600/60',
    L: 'bg-red-500/20 text-red-300 border-red-500/40',
  }
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${map[outcome]}`}
    >
      {outcome}
    </span>
  )
}

const TeamDetailsPage = ({ team, onNavigate }: TeamPageProps) => {
  if (!team) {
    return (
      <div className="glass-card p-8 text-center">
        <h2 className="page-title text-3xl font-semibold text-white">Team not found</h2>
        <p className="mt-3 text-slate-300">
          We couldn&apos;t locate that club in our data set. Try heading back to the teams overview.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('#/teams')}
          className="mt-6 rounded-full bg-accent/30 px-6 py-2 text-sm font-semibold text-accent transition hover:bg-accent/40"
        >
          Browse teams
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={() => onNavigate('#/teams')}
          className="self-start rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand/50 hover:text-brand"
        >
          ← All clubs
        </button>
        <div className="text-right text-sm text-slate-400 md:text-left">
          <p>Last updated: Matchday 9 snapshot</p>
        </div>
      </div>

      <section className="gradient-border">
        <div className="gradient-inner grid gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
          <img
            src={team.logo}
            alt={`${team.name} crest`}
            className="mx-auto h-28 w-28 rounded-full border border-brand/40 bg-slate-900/70 p-4"
          />
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="page-title text-4xl font-bold text-white">{team.name}</h2>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{team.stadium}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300 md:justify-end">
                <span className="rounded-full bg-brand/20 px-3 py-1 text-brand">Coach: {team.coach}</span>
                <span className="rounded-full bg-slate-900/60 px-3 py-1">Founded {team.founded}</span>
              </div>
            </div>
            <p className="text-slate-200">{team.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              {team.strengths.map((strength) => (
                <span key={strength} className="rounded-full bg-slate-900/60 px-3 py-1">
                  {strength}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="stat-badge">Form: {team.lastFive.join(' ')}</span>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-accent">
                W {team.stats.wins} · D {team.stats.draws} · L {team.stats.losses}
              </span>
              <span className="rounded-full bg-slate-900/60 px-3 py-1">
                Goals: {team.stats.goalsFor} for / {team.stats.goalsAgainst} against
              </span>
              <span className="rounded-full bg-brand/20 px-3 py-1 text-brand">
                Clean sheets: {team.stats.cleanSheets}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white">Upcoming fixtures</h3>
          <ul className="mt-4 space-y-3">
            {team.upcomingFixtures.map((fixture) => (
              <li key={fixture.id} className="fixture-card">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{fixture.date}</span>
                  <span>{fixture.competition}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-slate-100">
                  <span className="text-lg font-semibold">vs {fixture.opponent}</span>
                  <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
                    {fixture.venue}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white">Recent results</h3>
          <ul className="mt-4 space-y-3">
            {team.recentResults.map((result) => (
              <li key={result.id} className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3">
                <div>
                  <p className="text-sm text-slate-400">{result.date}</p>
                  <p className="text-base font-semibold text-slate-100">
                    vs {result.opponent}
                    <span className="ml-3 text-brand">{result.score}</span>
                  </p>
                  <p className="text-xs text-slate-500">{result.competition}</p>
                </div>
                <OutcomeBadge outcome={result.outcome} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="glass-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-semibold text-white">Key players</h3>
          <span className="text-sm text-slate-400">Goal contributions this season</span>
        </div>
        <div className="mt-4 divide-y divide-slate-800/60">
          {team.players.map((player) => (
            <div key={player.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-100">{player.name}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{player.position}</p>
              </div>
              <div className="flex gap-6 text-sm text-slate-300">
                <span className="rounded-full bg-brand/15 px-3 py-1 text-brand">{player.goals} goals</span>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-accent">{player.assists} assists</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

type StatsPageProps = {
  onNavigate: (path: string) => void
}

const Sparkline = ({ label, data }: { label: string; data: number[] }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = Math.max(max - min, 1)
  const gradientId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-gradient`
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="sparkline rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span className="font-semibold text-slate-100">{label}</span>
        <span className="text-xs uppercase tracking-wider text-slate-500">Last 5</span>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(96,165,250,0.6)" />
            <stop offset="100%" stopColor="rgba(96,165,250,0)" />
          </linearGradient>
        </defs>
        <polyline
          fill={`url(#${gradientId})`}
          stroke="rgba(96,165,250,0.45)"
          strokeWidth="2"
          points={`0,100 ${points} 100,100`}
        />
        <polyline
          fill="none"
          stroke="rgba(110,231,183,0.8)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  )
}

const StatsPage = ({ onNavigate }: StatsPageProps) => {
  const maxGoals = Math.max(...attackingStats.map((club) => club.goalsFor))
  const maxWins = Math.max(...attackingStats.map((club) => club.wins))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="page-title text-3xl font-semibold text-white">Advanced numbers</h2>
          <p className="text-slate-300">
            A quick analytics pass covering attacking output, efficiency and five-match momentum.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('#/')}
          className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand/50 hover:text-brand"
        >
          Back to dashboard
        </button>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white">Goals scored per club</h3>
          <p className="text-sm text-slate-400">Bar length scaled to the league&apos;s top attack.</p>
          <div className="mt-5 space-y-4">
            {attackingStats.map((club) => (
              <div key={`${club.team}-goals`} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="font-medium text-slate-100">{club.team}</span>
                  <span className="font-semibold text-brand">{club.goalsFor} goals</span>
                </div>
                <div className="h-3 rounded-full bg-slate-900/60">
                  <div
                    className="h-3 rounded-full bg-brand"
                    style={{ width: `${(club.goalsFor / maxGoals) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white">Win column pace</h3>
          <p className="text-sm text-slate-400">Victories after nine games compared to the leaders.</p>
          <div className="mt-5 space-y-4">
            {attackingStats.map((club) => (
              <div key={`${club.team}-wins`} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="font-medium text-slate-100">{club.team}</span>
                  <span className="font-semibold text-accent">{club.wins} wins</span>
                </div>
                <div className="h-3 rounded-full bg-slate-900/60">
                  <div
                    className="h-3 rounded-full bg-accent"
                    style={{ width: `${(club.wins / maxWins) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white">Momentum tracker</h3>
        <p className="text-sm text-slate-400">
          Form translated to points-per-match (W=3, D=1) over the last five fixtures.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(momentumTrend).map(([club, data]) => (
            <Sparkline key={club} label={club} data={data} />
          ))}
        </div>
      </section>

      <section className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white">Analyst notebook</h3>
        <ul className="mt-4 space-y-3 text-slate-300">
          {tableInsights.map((insight) => (
            <li key={insight} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const AboutPage = () => (
  <section className="glass-card space-y-6 p-8">
    <h2 className="page-title text-3xl font-semibold text-white">Built by rhemanwoko</h2>
    <p className="text-slate-300">
      I love pairing clean data visualisation with compelling football storytelling. This dashboard
      was crafted with React 19, Tailwind (via CDN), TypeScript and Vite to provide a modern matchday
      experience.
    </p>
    <p className="text-slate-300">
      Data is mocked to showcase the layout, but the architecture is ready for live integrations
      using the football-data.org API and an <code className="rounded bg-slate-900 px-1.5 py-0.5">X-Auth-Token</code>
      header.
    </p>
    <div className="flex flex-wrap gap-3 text-sm text-slate-300">
      <span className="rounded-full bg-brand/20 px-3 py-1 text-brand">React + Vite</span>
      <span className="rounded-full bg-accent/20 px-3 py-1 text-accent">Tailwind design language</span>
      <span className="rounded-full bg-slate-900/60 px-3 py-1">TypeScript</span>
    </div>
    <a
      href="https://github.com/rhemanwoko"
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand/50 hover:text-brand"
    >
      Visit my GitHub profile
    </a>
  </section>
)

const Footer = () => (
  <footer className="mt-16 flex flex-col items-center gap-3 text-xs text-slate-500 md:flex-row md:justify-between">
    <p>Premier League Live Dashboard · Mock data refreshed Oct 2024</p>
    <p>
      Built with ⚽ by{' '}
      <a href="https://github.com/rhemanwoko" className="text-brand hover:text-accent">
        rhemanwoko
      </a>
    </p>
  </footer>
)

const App = () => {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '/'
    }

    const handler = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const onNavigate = (path: string) => {
    const target = path.startsWith('#') ? path.slice(1) : path
    window.location.hash = target
    setRoute(parseHash(`#${target}`))
  }

  const activeTeam = useMemo(() => {
    if (route.page === 'team' && route.teamId) {
      return teams.find((club) => club.id === route.teamId)
    }
    return undefined
  }, [route])

  return (
    <div className="app-shell space-y-10">
      <header className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Premier League 2024/25</p>
            <h1 className="page-title text-4xl font-bold text-white md:text-5xl">Premier League Live Centre</h1>
            <p className="max-w-2xl text-slate-300">
              Live standings, fixtures, player contributions and momentum charts — all in one clean
              dashboard built for matchday.
            </p>
          </div>
          <NavigationBar current={route.page} onNavigate={onNavigate} />
        </div>
      </header>

      <main className="space-y-12">
        {route.page === 'home' && <HomePage onNavigate={onNavigate} />}
        {route.page === 'teams' && <TeamsPage onNavigate={onNavigate} />}
        {route.page === 'team' && <TeamDetailsPage team={activeTeam} onNavigate={onNavigate} />}
        {route.page === 'stats' && <StatsPage onNavigate={onNavigate} />}
        {route.page === 'about' && <AboutPage />}
      </main>

      <Footer />
    </div>
  )
}

export default App
