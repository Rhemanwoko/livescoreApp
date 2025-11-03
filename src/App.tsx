import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  fetchPremierLeagueSnapshot,
  fetchTeamDetail,
} from './api/footballData'
import type {
  LeagueStanding,
  MatchSummary,
  PremierLeagueSnapshot,
  TeamDetail,
  TeamSummary,
  TopScorer,
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

const PREMIER_LEAGUE_CLUB_COUNT = 20

const formatOrdinal = (value: number) => {
  const mod100 = value % 100
  if (mod100 >= 11 && mod100 <= 13) {
    return `${value}th`
  }

  switch (value % 10) {
    case 1:
      return `${value}st`
    case 2:
      return `${value}nd`
    case 3:
      return `${value}rd`
    default:
      return `${value}th`
  }
}

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
  standings: LeagueStanding[]
  scorers: TopScorer[]
  heroMatch?: MatchSummary
  highlights: MatchSummary[]
  upcoming: MatchSummary[]
  loading: boolean
  error?: string | null
}

type LeaderboardMetric = 'goals' | 'assists' | 'contributions'

const LeaderboardStatBlock = ({
  leader,
  metric,
}: {
  leader: TopScorer
  metric: LeaderboardMetric
}) => {
  const goals = leader.goals ?? 0
  const assists = leader.assists ?? 0

  if (metric === 'contributions') {
    const contributions = goals + assists
    return (
      <>
        <div className="text-right">
          <p className="text-lg font-semibold text-brand">{contributions}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500">Goal involvements</p>
        </div>
        <div className="flex flex-col text-xs text-slate-400">
          <span>{goals} goals</span>
          <span>{assists} assists</span>
        </div>
      </>
    )
  }

  if (metric === 'goals') {
    return (
      <>
        <div className="text-right">
          <p className="text-lg font-semibold text-accent">{goals}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500">Goals</p>
        </div>
        <span className="text-xs text-slate-400">{assists} assists</span>
      </>
    )
  }

  return (
    <>
      <div className="text-right">
        <p className="text-lg font-semibold text-amber-300">{assists}</p>
        <p className="text-xs uppercase tracking-wide text-slate-500">Assists</p>
      </div>
      <span className="text-xs text-slate-400">{goals} goals</span>
    </>
  )
}

const LeaderboardCard = ({
  title,
  subtitle,
  metric,
  leaders,
}: {
  title: string
  subtitle: string
  metric: LeaderboardMetric
  leaders: TopScorer[]
}) => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      <span className="text-sm text-slate-400">{subtitle}</span>
    </div>
    {leaders.length === 0 ? (
      <p className="mt-4 text-sm text-slate-400">Live leaderboards are unavailable at the moment.</p>
    ) : (
      <ul className="mt-4 space-y-3">
        {leaders.slice(0, 5).map((leader, index) => (
          <li
            key={leader.id}
            className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/20 font-semibold text-brand">
                #{index + 1}
              </span>
              {leader.teamCrest && (
                <img
                  src={leader.teamCrest}
                  alt={`${leader.team} crest`}
                  className="h-9 w-9 rounded-full border border-slate-800/60 bg-slate-900/70 object-contain p-1"
                />
              )}
              <div>
                <p className="font-semibold text-slate-100">{leader.player}</p>
                <p className="text-xs text-slate-400">{leader.team}</p>
              </div>
            </div>
            <div className="flex items-end gap-5 text-right text-slate-300">
              <LeaderboardStatBlock leader={leader} metric={metric} />
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
)

const formatScoreline = (match: MatchSummary) =>
  `${match.homeTeam} ${match.homeScore} — ${match.awayScore} ${match.awayTeam}`

const HomePage = ({
  onNavigate,
  standings,
  scorers,
  heroMatch,
  highlights,
  upcoming,
  loading,
  error,
}: HomePageProps) => {
  const goalLeaders = useMemo(
    () => [...scorers].sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0)),
    [scorers],
  )
  const assistLeaders = useMemo(
    () => [...scorers].sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0)),
    [scorers],
  )
  const contributionLeaders = useMemo(
    () =>
      [...scorers].sort(
        (a, b) => (b.goals ?? 0) + (b.assists ?? 0) - ((a.goals ?? 0) + (a.assists ?? 0)),
      ),
    [scorers],
  )

  const topFive = standings.slice(0, 5)

  return (
    <div className="space-y-10">
      <section className="glass-card overflow-hidden">
        <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_minmax(0,1fr)]">
          <div className="space-y-6">
            <span className="stat-badge">Premier League spotlight</span>
            <div className="space-y-3">
              <h2 className="page-title text-4xl font-bold text-white md:text-5xl">
                {heroMatch ? (
                  <>
                    {heroMatch.homeTeam}{' '}
                    <span className="text-brand">{heroMatch.homeScore}</span>
                    <span className="mx-2 text-slate-400">vs</span>
                    <span className="text-brand">{heroMatch.awayScore}</span> {heroMatch.awayTeam}
                  </>
                ) : (
                  'Live Premier League centre'
                )}
              </h2>
              <p className="text-lg text-slate-300">
                {heroMatch
                  ? `${heroMatch.competition} · ${heroMatch.date}`
                  : 'Track the table, matches and player race with real-time data.'}
              </p>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Updated moments ago
              </p>
            </div>
            <p className="max-w-2xl text-slate-200">
              Stay across the title race, European pushes and relegation battle. Live standings
              sync with the official Premier League feed while score centres and leaderboards keep
              the story moving.
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
            {(loading || error) && (
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4 text-sm text-slate-300">
                {loading ? 'Fetching live Premier League data…' : error}
              </div>
            )}
          </div>
          <div className="gradient-border">
            <div className="gradient-inner space-y-6">
              <h3 className="text-xl font-semibold text-slate-100">Latest score centre</h3>
              <ul className="space-y-4">
                {highlights.slice(0, 4).map((match) => (
                  <li key={match.id} className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{match.date}</span>
                      <span>{match.competition}</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-100">{formatScoreline(match)}</p>
                  </li>
                ))}
                {!highlights.length && (
                  <li className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-4 text-sm text-slate-400">
                    Match results will appear here once the API responds.
                  </li>
                )}
              </ul>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Upcoming fixtures
                </h4>
                <ul className="mt-3 space-y-3">
                  {upcoming.map((fixture) => (
                    <li key={`upcoming-${fixture.id}`} className="rounded-lg border border-slate-800/80 bg-slate-900/30 p-3 text-sm text-slate-300">
                      <p className="font-semibold text-slate-100">
                        {fixture.homeTeam} vs {fixture.awayTeam}
                      </p>
                      <p className="text-xs text-slate-500">{fixture.date}</p>
                    </li>
                  ))}
                  {!upcoming.length && (
                    <li className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3 text-xs text-slate-400">
                      Upcoming fixtures load automatically once available.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-100">Top of the league</h3>
            <span className="text-sm text-slate-400">Live standings</span>
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
                      <p className="text-xs text-slate-500">Form: {entry.form || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3">{entry.played}</td>
                    <td className="px-4 py-3">{entry.won}</td>
                    <td className="px-4 py-3">{entry.drawn}</td>
                    <td className="px-4 py-3">{entry.lost}</td>
                    <td className="px-4 py-3">{entry.goalDifference}</td>
                    <td className="px-4 py-3 font-semibold text-brand">{entry.points}</td>
                  </tr>
                ))}
                {!topFive.length && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-400">
                      Live standings are unavailable right now. Try again shortly.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <LeaderboardCard
            title="Goal contribution leaders"
            subtitle="Combined goals and assists"
            metric="contributions"
            leaders={contributionLeaders}
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <LeaderboardCard
              title="Golden Boot race"
              subtitle="Most goals"
              metric="goals"
              leaders={goalLeaders}
            />
            <LeaderboardCard
              title="Assist providers"
              subtitle="Most assists"
              metric="assists"
              leaders={assistLeaders}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

type TeamsPageProps = {
  onNavigate: (path: string) => void
  teams: TeamSummary[]
  loading: boolean
  error?: string | null
}

const TeamsPage = ({ onNavigate, teams, loading, error }: TeamsPageProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="page-title text-3xl font-semibold text-white">Premier League clubs</h2>
          <p className="text-slate-300">Tap a crest to open the club hub with fixtures, form and squad lists.</p>
          <p className="text-sm text-slate-400">
            {teams.length
              ? `Showing ${teams.length} of ${PREMIER_LEAGUE_CLUB_COUNT} clubs`
              : 'Awaiting live club data from football-data.org'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('#/')}
          className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand/50 hover:text-brand"
        >
          Back to home
        </button>
      </div>

      {(loading || error) && (
        <div className="glass-card p-4 text-sm text-slate-300">
          {loading ? 'Loading live club information…' : error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => {
          const formBadge = team.form?.split(',').join(' ') ?? 'N/A'
          return (
            <article key={team.id} className="team-card">
              <div className="flex items-center gap-4">
                {team.crest && (
                  <img
                    src={team.crest}
                    alt={`${team.name} crest`}
                    className="h-16 w-16 rounded-full border border-slate-700/70 bg-slate-900/60 p-2"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                  <p className="text-sm text-slate-400">{team.founded ? `Founded ${team.founded}` : team.venue}</p>
                  {typeof team.position === 'number' && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">
                      Premier League · {formatOrdinal(team.position)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {team.coach && <span className="rounded-full bg-slate-900/60 px-3 py-1">Coach: {team.coach}</span>}
                {team.venue && <span className="rounded-full bg-slate-900/60 px-3 py-1">Venue: {team.venue}</span>}
                {typeof team.points === 'number' && (
                  <span className="rounded-full bg-brand/15 px-3 py-1 text-brand">{team.points} pts</span>
                )}
                {typeof team.goalDifference === 'number' && (
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-accent">GD {team.goalDifference}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>
                  Form{' '}
                  <span className="font-semibold text-brand">{formBadge}</span>
                </span>
                {team.clubColors && <span>{team.clubColors}</span>}
              </div>
              <button
                type="button"
                onClick={() => onNavigate(`#/team/${team.id}`)}
                className="rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/30"
              >
                View club hub
              </button>
            </article>
          )
        })}
        {!teams.length && !loading && (
          <div className="glass-card p-6 text-center text-slate-300">
            <p>No clubs to display at the moment. Refresh to try again.</p>
          </div>
        )}
      </div>
    </div>
  )
}

type TeamPageProps = {
  team?: TeamDetail
  onNavigate: (path: string) => void
  loading: boolean
  error?: string | null
}

const OutcomeBadge = ({ outcome }: { outcome: 'W' | 'D' | 'L' }) => {
  const map = {
    W: 'bg-brand/25 text-brand border-brand/50',
    D: 'bg-slate-800/60 text-slate-200 border-slate-600/60',
    L: 'bg-red-500/20 text-red-300 border-red-500/40',
  }
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${map[outcome]}`}>
      {outcome}
    </span>
  )
}

const TeamDetailsPage = ({ team, onNavigate, loading, error }: TeamPageProps) => {
  if (loading) {
    return (
      <div className="glass-card p-6 text-sm text-slate-300">
        Loading club hub…
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card space-y-4 p-6 text-slate-300">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => onNavigate('#/teams')}
          className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand/50 hover:text-brand"
        >
          Back to teams
        </button>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="glass-card space-y-4 p-6 text-slate-300">
        <p>Select a team from the standings or clubs grid to load its live hub.</p>
        <button
          type="button"
          onClick={() => onNavigate('#/teams')}
          className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand/50 hover:text-brand"
        >
          Browse clubs
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={() => onNavigate('#/teams')}
        className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand/50 hover:text-brand"
      >
        Back to clubs overview
      </button>

      <section className="glass-card p-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {team.crest && (
                <img
                  src={team.crest}
                  alt={`${team.name} crest`}
                  className="h-20 w-20 rounded-full border border-slate-700/70 bg-slate-900/60 p-3"
                />
              )}
              <div>
                <h2 className="page-title text-3xl font-semibold text-white">{team.name}</h2>
                <p className="text-sm text-slate-400">{team.venue}</p>
                {typeof team.position === 'number' && (
                  <span className="mt-2 inline-flex items-center rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">
                    {formatOrdinal(team.position)} in the Premier League
                  </span>
                )}
              </div>
            </div>
            <p className="text-slate-300">{team.description ?? 'Club hub loaded with live competition data.'}</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              {team.founded && <span className="rounded-full bg-slate-900/60 px-3 py-1">Founded {team.founded}</span>}
              {team.coach && <span className="rounded-full bg-slate-900/60 px-3 py-1">Coach: {team.coach}</span>}
              {team.clubColors && (
                <span className="rounded-full bg-slate-900/60 px-3 py-1">Colours: {team.clubColors}</span>
              )}
            </div>
            {!!team.strengths?.length && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Strengths
                </h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-300">
                  {team.strengths.map((strength) => (
                    <li key={strength} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Last five results
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {team.lastFive.length
                ? team.lastFive.map((result, index) => <OutcomeBadge key={`${team.id}-last-${index}`} outcome={result} />)
                : 'No recent form available'}
            </div>
            {team.stats && (
              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <span className="rounded-full bg-accent/20 px-3 py-1 text-accent">
                  W {team.stats.wins} · D {team.stats.draws} · L {team.stats.losses}
                </span>
                <span className="rounded-full bg-slate-900/60 px-3 py-1">
                  Goals: {team.stats.goalsFor} for / {team.stats.goalsAgainst} against
                </span>
                <span className="rounded-full bg-brand/20 px-3 py-1 text-brand">{team.stats.points} points</span>
              </div>
            )}
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
                  <span className="text-lg font-semibold">
                    {fixture.venue === 'Home' ? 'vs' : 'at'} {fixture.opponent}
                  </span>
                  <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
                    {fixture.venue}
                  </span>
                </div>
              </li>
            ))}
            {!team.upcomingFixtures.length && (
              <li className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4 text-sm text-slate-400">
                No scheduled fixtures found.
              </li>
            )}
          </ul>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white">Recent results</h3>
          <ul className="mt-4 space-y-3">
            {team.recentResults.map((result) => (
              <li
                key={result.id}
                className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3"
              >
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
            {!team.recentResults.length && (
              <li className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4 text-sm text-slate-400">
                Recent results not available.
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="glass-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-semibold text-white">Squad list</h3>
          <span className="text-sm text-slate-400">Direct from the Premier League feed</span>
        </div>
        <div className="mt-4 divide-y divide-slate-800/60">
          {team.squad.map((player) => (
            <div key={player.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-100">{player.name}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{player.position}</p>
              </div>
              <div className="flex gap-4 text-sm text-slate-300">
                {player.shirtNumber && (
                  <span className="rounded-full bg-brand/15 px-3 py-1 text-brand">#{player.shirtNumber}</span>
                )}
                <span className="rounded-full bg-slate-900/60 px-3 py-1">{player.nationality}</span>
              </div>
            </div>
          ))}
          {!team.squad.length && (
            <p className="py-4 text-sm text-slate-400">Squad information not yet available.</p>
          )}
        </div>
      </section>
    </div>
  )
}

type StatsPageProps = {
  onNavigate: (path: string) => void
  standings: LeagueStanding[]
  scorers: TopScorer[]
}

const Sparkline = ({ label, data }: { label: string; data: number[] }) => {
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
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

const buildMomentum = (standings: LeagueStanding[]) => {
  const resultMap: Record<string, number[]> = {}

  standings.forEach((club) => {
    const lastFive = club.form?.split(',').slice(-5) ?? []
    resultMap[club.team] = lastFive.map((symbol) => {
      switch (symbol.trim()) {
        case 'W':
          return 3
        case 'D':
          return 1
        case 'L':
          return 0
        default:
          return 0
      }
    })
  })

  return resultMap
}

const buildInsights = (standings: LeagueStanding[], scorers: TopScorer[]): string[] => {
  if (!standings.length) {
    return ['Live standings will populate once the Premier League feed responds.']
  }

  const insights: string[] = []
  const leader = standings[0]
  insights.push(
    `${leader.team} lead the league on ${leader.points} points after ${leader.played} matches.`,
  )

  const bestAttack = standings.reduce((prev, curr) =>
    curr.goalsFor > prev.goalsFor ? curr : prev,
  )
  insights.push(`${bestAttack.team} boast the sharpest attack with ${bestAttack.goalsFor} goals.`)

  const bestDefence = standings.reduce((prev, curr) =>
    curr.goalsAgainst < prev.goalsAgainst ? curr : prev,
  )
  insights.push(
    `${bestDefence.team} have the tightest defence conceding just ${bestDefence.goalsAgainst} goals.`,
  )

  if (scorers.length) {
    const topScorer = scorers[0]
    insights.push(
      `${topScorer.player} (${topScorer.team}) leads the Golden Boot race with ${topScorer.goals} goals.`,
    )
  }

  const relegationFight = standings.slice(-3)
  if (relegationFight.length === 3) {
    insights.push(
      `The drop zone currently features ${relegationFight
        .map((club) => club.team)
        .join(', ')} chasing safety.`,
    )
  }

  return insights
}

const StatsPage = ({ onNavigate, standings, scorers }: StatsPageProps) => {
  const attackingStats = useMemo(
    () =>
      standings.map((club) => ({
        team: club.team,
        goalsFor: club.goalsFor,
        wins: club.won,
      })),
    [standings],
  )

  const maxGoals = Math.max(...attackingStats.map((club) => club.goalsFor), 1)
  const maxWins = Math.max(...attackingStats.map((club) => club.wins), 1)
  const momentumTrend = useMemo(() => buildMomentum(standings), [standings])
  const tableInsights = useMemo(() => buildInsights(standings, scorers), [standings, scorers])

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
          <p className="text-sm text-slate-400">Bar length scaled to the league's top attack.</p>
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
          <p className="text-sm text-slate-400">Victories compared to the league leaders.</p>
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
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Full Premier League table</h3>
          <span className="text-sm text-slate-400">
            {standings.length
              ? `${standings.length} clubs`
              : 'Waiting for live standings'}
          </span>
        </div>
        {standings.length ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800/70">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Pos</th>
                  <th className="px-4 py-3">Club</th>
                  <th className="px-4 py-3">P</th>
                  <th className="px-4 py-3">W</th>
                  <th className="px-4 py-3">D</th>
                  <th className="px-4 py-3">L</th>
                  <th className="px-4 py-3">GF</th>
                  <th className="px-4 py-3">GA</th>
                  <th className="px-4 py-3">GD</th>
                  <th className="px-4 py-3">Pts</th>
                  <th className="px-4 py-3">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-200">
                {standings.map((club) => (
                  <tr key={club.teamId}>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-400">{club.position}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {club.crest && (
                          <img
                            src={club.crest}
                            alt={`${club.team} crest`}
                            className="h-9 w-9 rounded-full border border-slate-800/60 bg-slate-900/70 object-contain p-1"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => onNavigate(`#/team/${club.teamId}`)}
                          className="text-left font-semibold text-slate-100 transition hover:text-brand"
                        >
                          {club.team}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">{club.played}</td>
                    <td className="px-4 py-3">{club.won}</td>
                    <td className="px-4 py-3">{club.drawn}</td>
                    <td className="px-4 py-3">{club.lost}</td>
                    <td className="px-4 py-3">{club.goalsFor}</td>
                    <td className="px-4 py-3">{club.goalsAgainst}</td>
                    <td className="px-4 py-3">{club.goalDifference}</td>
                    <td className="px-4 py-3 font-semibold text-brand">{club.points}</td>
                    <td className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400">
                      {club.form || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            Live standings will appear automatically once the Premier League feed responds.
          </p>
        )}
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
          {!Object.keys(momentumTrend).length && (
            <p className="text-sm text-slate-400">Momentum charts appear once live form data is available.</p>
          )}
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
      Premier League matchweeks move fast, so this dashboard plugs straight into the official
      football-data.org API. Standings, scorers, fixtures and squads refresh live to create a
      complete information hub.
    </p>
    <p className="text-slate-300">
      The experience is crafted with React 19, Vite and TypeScript alongside a Tailwind-inspired UI
      layer. Analytics cards, rich leaderboards and team hubs make it easy to track every storyline.
    </p>
    <div className="flex flex-wrap gap-3 text-sm text-slate-300">
      <span className="rounded-full bg-brand/20 px-3 py-1 text-brand">React + Vite</span>
      <span className="rounded-full bg-accent/20 px-3 py-1 text-accent">Tailwind design language</span>
      <span className="rounded-full bg-slate-900/60 px-3 py-1">TypeScript</span>
      <span className="rounded-full bg-slate-900/60 px-3 py-1">football-data.org API</span>
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
    <p>Premier League Live Dashboard · Powered by football-data.org</p>
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
  const [snapshot, setSnapshot] = useState<PremierLeagueSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [teamCache, setTeamCache] = useState<Record<string, TeamDetail>>({})
  const [teamLoading, setTeamLoading] = useState(false)
  const [teamError, setTeamError] = useState<string | null>(null)

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '/'
    }

    const handler = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  useEffect(() => {
    const loadSnapshot = async () => {
      setLoading(true)
      try {
        const data = await fetchPremierLeagueSnapshot()
        setSnapshot(data)
        setError(null)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to fetch Premier League data right now. Please try again later.'
        const helpful = /401|403|Unauthorized|token/i.test(message)
          ? `${message}. Double-check that VITE_FOOTBALL_DATA_TOKEN is set in your .env file.`
          : message
        setError(helpful)
        setSnapshot(null)
      } finally {
        setLoading(false)
      }
    }

    loadSnapshot()
  }, [])

  const formToOutcomes = (form?: string): Array<'W' | 'D' | 'L'> => {
    if (!form) {
      return []
    }
    return form
      .split(',')
      .slice(-5)
      .map((symbol) => (symbol.trim() === 'W' || symbol.trim() === 'D' || symbol.trim() === 'L' ? (symbol.trim() as 'W' | 'D' | 'L') : 'L'))
  }

  useEffect(() => {
    const loadTeam = async (teamId: string) => {
      setTeamLoading(true)
      setTeamError(null)
      try {
        const detail = await fetchTeamDetail(teamId)
        setTeamCache((prev) => {
          const standing = snapshot?.standings.find((entry) => entry.teamId === teamId)
          const stats =
            detail.stats ??
            (standing
              ? {
                  wins: standing.won,
                  draws: standing.drawn,
                  losses: standing.lost,
                  goalsFor: standing.goalsFor,
                  goalsAgainst: standing.goalsAgainst,
                  points: standing.points,
                  goalDifference: standing.goalDifference,
                }
              : undefined)

          const lastFive = detail.lastFive.length
            ? detail.lastFive
            : formToOutcomes(standing?.form)

          return {
            ...prev,
            [teamId]: {
              ...detail,
              stats,
              lastFive,
              position: standing?.position ?? detail.position,
            },
          }
        })
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to load this club hub. Please try again later.'
        const helpful = /401|403|Unauthorized|token/i.test(message)
          ? `${message}. Confirm the VITE_FOOTBALL_DATA_TOKEN value and try again.`
          : message
        setTeamError(helpful)
      } finally {
        setTeamLoading(false)
      }
    }

    if (route.page === 'team' && route.teamId && !teamCache[route.teamId]) {
      void loadTeam(route.teamId)
    }
  }, [route, teamCache, snapshot])

  const onNavigate = (path: string) => {
    const target = path.startsWith('#') ? path.slice(1) : path
    window.location.hash = target
    setRoute(parseHash(`#${target}`))
  }

  const activeTeam = useMemo(() => {
    if (route.page === 'team' && route.teamId) {
      return teamCache[route.teamId]
    }
    return undefined
  }, [route, teamCache])

  return (
    <div className="app-shell space-y-10">
      <header className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Premier League {new Date().getFullYear()}</p>
            <h1 className="page-title text-4xl font-bold text-white md:text-5xl">Premier League Live Centre</h1>
            <p className="max-w-2xl text-slate-300">
              Live standings, fixtures, player contributions and momentum charts — all streaming from
              real-time Premier League data.
            </p>
          </div>
          <NavigationBar current={route.page} onNavigate={onNavigate} />
        </div>
      </header>

      <main className="space-y-12">
        {route.page === 'home' && (
          <HomePage
            onNavigate={onNavigate}
            standings={snapshot?.standings ?? []}
            scorers={snapshot?.scorers ?? []}
            heroMatch={snapshot?.recentMatches?.[0]}
            highlights={snapshot?.recentMatches ?? []}
            upcoming={snapshot?.upcomingFixtures ?? []}
            loading={loading}
            error={error}
          />
        )}
        {route.page === 'teams' && (
          <TeamsPage
            onNavigate={onNavigate}
            teams={snapshot?.teams ?? []}
            loading={loading}
            error={error}
          />
        )}
        {route.page === 'team' && (
          <TeamDetailsPage
            team={activeTeam}
            onNavigate={onNavigate}
            loading={teamLoading}
            error={teamError}
          />
        )}
        {route.page === 'stats' && (
          <StatsPage
            onNavigate={onNavigate}
            standings={snapshot?.standings ?? []}
            scorers={snapshot?.scorers ?? []}
          />
        )}
        {route.page === 'about' && <AboutPage />}
      </main>

      <Footer />
    </div>
  )
}

export default App
