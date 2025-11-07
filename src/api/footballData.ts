import type {
  Fixture,
  LeagueStanding,
  Player,
  MatchSummary,
  Result,
  TeamDetail,
  TeamSummary,
  TopScorer,
} from '../types/football'

const resolveBaseUrl = () => {
  const configuredBase = import.meta.env.VITE_FOOTBALL_DATA_BASE
  if (configuredBase && configuredBase.trim()) {
    return configuredBase.replace(/\/$/, '')
  }
  return 'https://api.football-data.org/v4'
}

const API_BASE = resolveBaseUrl()
const API_TOKEN = import.meta.env.VITE_FOOTBALL_DATA_TOKEN

const withAuthHeaders = () => {
  if (!API_TOKEN || !API_TOKEN.trim()) {
    throw new Error('Missing API token. Set VITE_FOOTBALL_DATA_TOKEN in your environment configuration.')
  }

  return {
    'X-Auth-Token': API_TOKEN,
  }
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const matchDateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const toLocaleDate = (isoDate: string) => {
  try {
    return dateFormatter.format(new Date(isoDate))
  } catch (error) {
    return isoDate
  }
}

const toMatchDateTime = (isoDate: string) => {
  try {
    const date = new Date(isoDate)
    const parts = matchDateTimeFormatter.formatToParts(date)
    const pick = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? ''
    const weekday = pick('weekday')
    const day = pick('day')
    const month = pick('month')
    const hour = pick('hour')
    const minute = pick('minute')
    const time = hour && minute ? `${hour}:${minute}` : ''
    const segments = [
      weekday ? weekday.replace(/,$/, '') : '',
      [day, month].filter(Boolean).join(' '),
      time,
    ].filter(Boolean)
    return segments.join(' · ')
  } catch (error) {
    return toLocaleDate(isoDate)
  }
}

const toMatchOutcome = (teamScore: number, opponentScore: number): Result['outcome'] => {
  if (teamScore > opponentScore) return 'W'
  if (teamScore === opponentScore) return 'D'
  return 'L'
}

export const fetchPremierLeagueStandings = async (): Promise<LeagueStanding[]> => {
  const response = await fetch(`${API_BASE}/competitions/PL/standings`, {
    headers: withAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to load league standings')
  }

  const data = await response.json()
  const totalTable = data.standings?.find((table: { type: string }) => table.type === 'TOTAL')

  if (!totalTable) {
    return []
  }

  return totalTable.table.map((entry: any) => ({
    position: entry.position,
    teamId: String(entry.team.id),
    team: entry.team.name,
    crest: entry.team.crest,
    played: entry.playedGames,
    won: entry.won,
    drawn: entry.draw,
    lost: entry.lost,
    goalsFor: entry.goalsFor,
    goalsAgainst: entry.goalsAgainst,
    goalDifference: entry.goalDifference,
    points: entry.points,
    form: entry.form || '',
  }))
}

export const fetchPremierLeagueScorers = async (limit = 20): Promise<TopScorer[]> => {
  const response = await fetch(`${API_BASE}/competitions/PL/scorers?limit=${limit}`, {
    headers: withAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to load scorers')
  }

  const data = await response.json()
  return (data.scorers || []).map((entry: any) => ({
    id: String(entry.player.id ?? `${entry.team.id}-${entry.player.name}`),
    player: entry.player.name,
    team: entry.team.name,
    teamCrest: entry.team.crest,
    goals: entry.goals ?? entry.statistics?.goals ?? 0,
    assists: entry.assists ?? entry.statistics?.assists ?? 0,
  }))
}

export const fetchPremierLeagueTeams = async (): Promise<TeamSummary[]> => {
  const response = await fetch(`${API_BASE}/competitions/PL/teams`, {
    headers: withAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to load teams')
  }

  const data = await response.json()
  return (data.teams || []).map((team: any) => ({
    id: String(team.id),
    name: team.name,
    shortName: team.shortName || team.tla || team.name,
    crest: team.crest,
    venue: team.venue,
    founded: team.founded,
    clubColors: team.clubColors,
    address: team.address,
    website: team.website,
    coach: team.coach?.name || undefined,
  }))
}

const mapSquad = (members: any[]): Player[] =>
  members
    .filter((member) => member.role === 'PLAYER')
    .map((player) => ({
      id: String(player.id ?? `${player.name}-${player.position}`),
      name: player.name,
      position: player.position,
      nationality: player.nationality,
      shirtNumber: player.shirtNumber,
    }))

const mapFixtures = (matches: any[], teamId: string): Fixture[] =>
  matches.map((match) => {
    const homeTeamId = String(match.homeTeam.id)
    const isHome = homeTeamId === teamId
    const opponent = isHome ? match.awayTeam.name : match.homeTeam.name
    return {
      id: String(match.id),
      opponent,
      date: toLocaleDate(match.utcDate),
      venue: isHome ? 'Home' : 'Away',
      competition: match.competition.name,
    }
  })

const mapResults = (matches: any[], teamId: string): Result[] =>
  matches.map((match) => {
    const homeTeamId = String(match.homeTeam.id)
    const isHome = homeTeamId === teamId
    const teamScore = isHome ? match.score.fullTime.home : match.score.fullTime.away
    const opponentScore = isHome ? match.score.fullTime.away : match.score.fullTime.home
    const opponent = isHome ? match.awayTeam.name : match.homeTeam.name

    return {
      id: String(match.id),
      opponent,
      date: toLocaleDate(match.utcDate),
      competition: match.competition.name,
      score: `${teamScore} - ${opponentScore}`,
      outcome: toMatchOutcome(teamScore, opponentScore),
    }
  })

const buildStrengths = (stats?: TeamDetail['stats']): string[] => {
  if (!stats) return []
  const strengthTags = [] as string[]
  const winRate = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0
  if (winRate) {
    strengthTags.push(`${winRate}% win rate`)
  }
  strengthTags.push(`Goal diff ${stats.goalDifference}`)
  strengthTags.push(`${stats.goalsFor} goals scored`)
  return strengthTags
}

export const fetchTeamDetail = async (
  teamId: string,
  standings: LeagueStanding[],
): Promise<TeamDetail> => {
  const [teamRes, scheduledRes, finishedRes] = await Promise.all([
    fetch(`${API_BASE}/teams/${teamId}`, { headers: withAuthHeaders() }),
    fetch(`${API_BASE}/teams/${teamId}/matches?status=SCHEDULED&limit=5`, { headers: withAuthHeaders() }),
    fetch(`${API_BASE}/teams/${teamId}/matches?status=FINISHED&limit=5`, { headers: withAuthHeaders() }),
  ])

  if (!teamRes.ok) {
    throw new Error('Failed to load team details')
  }

  const [teamData, upcomingData, finishedData] = await Promise.all([
    teamRes.json(),
    scheduledRes.ok ? scheduledRes.json() : { matches: [] },
    finishedRes.ok ? finishedRes.json() : { matches: [] },
  ])

  const standingsEntry = standings.find((row) => row.teamId === teamId)
  const form = standingsEntry?.form || teamData.form || ''
  const lastFive = form ? form.split(',') : []
  const description = `${teamData.name} compete in the ${
    teamData.activeCompetitions?.map((comp: any) => comp.name).join(', ') || 'Premier League'
  } and play their home matches at ${teamData.venue}.`

  const stats = standingsEntry
    ? {
        played: standingsEntry.played,
        wins: standingsEntry.won,
        draws: standingsEntry.drawn,
        losses: standingsEntry.lost,
        goalsFor: standingsEntry.goalsFor,
        goalsAgainst: standingsEntry.goalsAgainst,
        goalDifference: standingsEntry.goalDifference,
        points: standingsEntry.points,
      }
    : undefined

  return {
    id: String(teamData.id),
    name: teamData.name,
    shortName: teamData.shortName || teamData.tla || teamData.name,
    crest: teamData.crest,
    venue: teamData.venue,
    founded: teamData.founded,
    clubColors: teamData.clubColors,
    address: teamData.address,
    website: teamData.website,
    coach: teamData.coach?.name,
    form,
    points: standingsEntry?.points,
    goalDifference: standingsEntry?.goalDifference,
    description,
    lastFive,
    strengths: buildStrengths(stats),
    stats,
    upcomingFixtures: mapFixtures(upcomingData.matches || [], teamId),
    recentResults: mapResults(finishedData.matches || [], teamId),
    squad: mapSquad(teamData.squad || []),
  }
}

const mapMatchSummary = (match: any): MatchSummary => {
  const safeScore = (score?: { home?: number | null; away?: number | null }) => ({
    home: score?.home ?? null,
    away: score?.away ?? null,
  })

  const fullTimeScore = safeScore(match.score?.fullTime)
  const regularTimeScore = safeScore(match.score?.regularTime)
  const penaltiesScore = safeScore(match.score?.penalties)

  const resolvedHomeScore =
    fullTimeScore.home ?? regularTimeScore.home ?? penaltiesScore.home ?? null
  const resolvedAwayScore =
    fullTimeScore.away ?? regularTimeScore.away ?? penaltiesScore.away ?? null

  return {
    id: String(match.id),
    homeTeam: match.homeTeam?.name ?? 'TBD',
    awayTeam: match.awayTeam?.name ?? 'TBD',
    homeScore: resolvedHomeScore,
    awayScore: resolvedAwayScore,
    date: toMatchDateTime(match.utcDate),
    competition: match.competition?.name ?? 'Premier League',
    status: match.status ?? 'SCHEDULED',
  }
}

export const enrichTeamsWithStandings = (
  teams: TeamSummary[],
  standings: LeagueStanding[],
): TeamSummary[] =>
  teams.map((team) => {
    const row = standings.find((entry) => entry.teamId === team.id)
    return {
      ...team,
      form: row?.form,
      points: row?.points,
      goalDifference: row?.goalDifference,
    }
  })

export const fetchRecentPremierLeagueMatches = async (
  limit = 5,
): Promise<MatchSummary[]> => {
  const response = await fetch(`${API_BASE}/competitions/PL/matches?status=FINISHED&limit=${limit}`, {
    headers: withAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to load recent Premier League matches')
  }

  const data = await response.json()
  const matches = (data.matches || []) as any[]

  return matches
    .slice()
    .sort(
      (a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime(),
    )
    .slice(0, limit)
    .map(mapMatchSummary)
}

export const fetchUpcomingPremierLeagueMatch = async (): Promise<MatchSummary | null> => {
  const response = await fetch(`${API_BASE}/competitions/PL/matches?status=SCHEDULED&limit=5`, {
    headers: withAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to load upcoming Premier League fixtures')
  }

  const data = await response.json()
  const matches = (data.matches || []) as any[]

  if (!matches.length) {
    return null
  }

  const sorted = matches
    .slice()
    .sort(
      (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
    )

  return sorted.length ? mapMatchSummary(sorted[0]) : null
}
