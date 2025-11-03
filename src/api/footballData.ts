import type {
  Fixture,
  LeagueStanding,
  MatchSummary,
  PremierLeagueSnapshot,
  Result,
  SquadPlayer,
  TeamDetail,
  TeamSummary,
  TopScorer,
} from '../data/mockData'

const API_BASE = 'https://api.football-data.org/v4'

const getToken = () => import.meta.env.VITE_FOOTBALL_DATA_TOKEN as string | undefined

const formatDate = (iso: string) => {
  try {
    const date = new Date(iso)
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch (error) {
    return iso
  }
}

const formatFullDate = (iso: string) => {
  try {
    const date = new Date(iso)
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch (error) {
    return iso
  }
}

const request = async <T>(path: string): Promise<T> => {
  const token = getToken()
  const response = await fetch(`${API_BASE}${path}`, {
    headers: token
      ? {
          'X-Auth-Token': token,
        }
      : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    try {
      const data = JSON.parse(text)
      const message = data.message ?? data.error ?? text
      throw new Error(message || `Request failed with status ${response.status}`)
    } catch (error) {
      throw new Error(text || `Request failed with status ${response.status}`)
    }
  }

  return response.json() as Promise<T>
}

const toStanding = (entry: any): LeagueStanding => ({
  teamId: String(entry.team.id),
  team: entry.team.shortName ?? entry.team.name,
  crest: entry.team.crest ?? '',
  position: entry.position,
  played: entry.playedGames,
  won: entry.won,
  drawn: entry.draw,
  lost: entry.lost,
  goalsFor: entry.goalsFor ?? 0,
  goalsAgainst: entry.goalsAgainst ?? 0,
  goalDifference: entry.goalDifference,
  points: entry.points,
  form: entry.form ?? '',
})

const toScorer = (entry: any): TopScorer => ({
  id: `${entry.player.id}-${entry.team.id}`,
  player: entry.player.name,
  team: entry.team.shortName ?? entry.team.name,
  teamCrest: entry.team.crest ?? '',
  goals: entry.goals ?? 0,
  assists: entry.assists ?? 0,
})

const toFixture = (match: any, clubId: number): Fixture => {
  const isHome = match.homeTeam.id === clubId
  const opponent = isHome ? match.awayTeam.shortName ?? match.awayTeam.name : match.homeTeam.shortName ?? match.homeTeam.name
  return {
    id: String(match.id),
    date: formatFullDate(match.utcDate),
    competition: match.competition?.name ?? 'Premier League',
    opponent,
    venue: isHome ? 'Home' : 'Away',
  }
}

const toResult = (match: any, clubId: number): Result => {
  const isHome = match.homeTeam.id === clubId
  const opponent = isHome ? match.awayTeam.shortName ?? match.awayTeam.name : match.homeTeam.shortName ?? match.homeTeam.name
  const homeScore = match.score.fullTime.home ?? 0
  const awayScore = match.score.fullTime.away ?? 0
  const outcome = isHome
    ? homeScore > awayScore
      ? 'W'
      : homeScore === awayScore
      ? 'D'
      : 'L'
    : awayScore > homeScore
    ? 'W'
    : awayScore === homeScore
    ? 'D'
    : 'L'

  return {
    id: String(match.id),
    date: formatFullDate(match.utcDate),
    competition: match.competition?.name ?? 'Premier League',
    opponent,
    score: `${homeScore} - ${awayScore}`,
    outcome,
  }
}

const toMatchSummary = (match: any): MatchSummary => ({
  id: String(match.id),
  homeTeam: match.homeTeam.shortName ?? match.homeTeam.name,
  awayTeam: match.awayTeam.shortName ?? match.awayTeam.name,
  homeScore: match.score.fullTime.home ?? 0,
  awayScore: match.score.fullTime.away ?? 0,
  date: formatDate(match.utcDate),
  competition: match.competition?.name ?? 'Premier League',
})

const mergeTeamSummary = (
  team: any,
  standingLookup: Map<number, LeagueStanding>,
): TeamSummary => {
  const standing = standingLookup.get(team.id)
  return {
    id: String(team.id),
    name: team.shortName ?? team.name,
    crest: team.crest ?? '',
    founded: team.founded,
    venue: team.venue ?? team.address ?? 'Venue to be confirmed',
    clubColors: team.clubColors,
    coach: team.coach?.name ?? team.coach?.nickname,
    form: standing?.form,
    points: standing?.points,
    goalDifference: standing?.goalDifference,
    position: standing?.position,
  }
}

export const fetchPremierLeagueSnapshot = async (): Promise<PremierLeagueSnapshot> => {
  const season = new Date().getFullYear()
  const [standingsRaw, scorersRaw, teamsRaw, finishedMatchesRaw, upcomingMatchesRaw] = await Promise.all([
    request<any>(`/competitions/PL/standings`),
    request<any>(`/competitions/PL/scorers?limit=30`),
    request<any>(`/competitions/PL/teams`),
    request<any>(`/competitions/PL/matches?status=FINISHED&season=${season}`),
    request<any>(`/competitions/PL/matches?status=SCHEDULED&season=${season}`),
  ])

  const standings: LeagueStanding[] =
    standingsRaw.standings?.[0]?.table?.map((entry: any) => toStanding(entry)) ?? []

  const standingLookup = new Map<number, LeagueStanding>(
    standings.map((entry: LeagueStanding) => [Number(entry.teamId), entry]),
  )

  const scorers = scorersRaw.scorers?.map((entry: any) => toScorer(entry)) ?? []

  const teamsFromApi = (teamsRaw.teams ?? [])
    .filter((team: any) => standingLookup.has(team.id))
    .map((team: any) => mergeTeamSummary(team, standingLookup))

  const teamMap = new Map<string, TeamSummary>()
  teamsFromApi.forEach((team: TeamSummary) => {
    teamMap.set(team.id, team)
  })

  standings.forEach((entry) => {
    if (!teamMap.has(entry.teamId)) {
      teamMap.set(entry.teamId, {
        id: entry.teamId,
        name: entry.team,
        crest: entry.crest ?? '',
        venue: 'Venue to be confirmed',
        form: entry.form,
        points: entry.points,
        goalDifference: entry.goalDifference,
        position: entry.position,
      })
    }
  })

  const teams = Array.from(teamMap.values()).sort((a, b) => {
    if (typeof a.position === 'number' && typeof b.position === 'number') {
      return a.position - b.position
    }
    if (typeof a.position === 'number') {
      return -1
    }
    if (typeof b.position === 'number') {
      return 1
    }
    return a.name.localeCompare(b.name)
  })

  const finishedMatches = finishedMatchesRaw.matches ?? []
  finishedMatches.sort((a: any, b: any) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
  const recentMatches = finishedMatches.slice(0, 6).map((match: any) => toMatchSummary(match))

  const upcomingMatches = (upcomingMatchesRaw.matches ?? [])
    .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .slice(0, 6)
    .map((match: any) => ({
      id: String(match.id),
      homeTeam: match.homeTeam.shortName ?? match.homeTeam.name,
      awayTeam: match.awayTeam.shortName ?? match.awayTeam.name,
      homeScore: match.score.fullTime.home ?? 0,
      awayScore: match.score.fullTime.away ?? 0,
      date: formatFullDate(match.utcDate),
      competition: match.competition?.name ?? 'Premier League',
    }))

  return {
    standings,
    scorers,
    teams,
    recentMatches,
    upcomingFixtures: upcomingMatches,
  }
}

export const fetchTeamDetail = async (teamId: string): Promise<TeamDetail> => {
  const numericId = Number(teamId)
  const [teamRaw, matchesUpcomingRaw, matchesFinishedRaw] = await Promise.all([
    request<any>(`/teams/${teamId}`),
    request<any>(`/teams/${teamId}/matches?status=SCHEDULED`),
    request<any>(`/teams/${teamId}/matches?status=FINISHED`),
  ])

  const lastFive = matchesFinishedRaw.matches
    ?.sort((a: any, b: any) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, 5)
    .map((match: any) => toResult(match, numericId).outcome) ?? []

  const statsSource = teamRaw.runningCompetitions?.find(
    (comp: any) => comp.type === 'LEAGUE' && comp.name?.includes('Premier League'),
  )

  const stats = statsSource
    ? {
        wins: statsSource.wins ?? 0,
        draws: statsSource.draws ?? 0,
        losses: statsSource.losses ?? 0,
        goalsFor: statsSource.goalsFor ?? 0,
        goalsAgainst: statsSource.goalsAgainst ?? 0,
        points: statsSource.points ?? 0,
        goalDifference: (statsSource.goalsFor ?? 0) - (statsSource.goalsAgainst ?? 0),
      }
    : undefined

  const leaguePosition =
    typeof statsSource?.position === 'number'
      ? statsSource.position
      : typeof statsSource?.leagueRank === 'number'
      ? statsSource.leagueRank
      : undefined

  const upcomingFixtures = (matchesUpcomingRaw.matches ?? [])
    .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .slice(0, 5)
    .map((match: any) => toFixture(match, numericId))

  const recentResults = (matchesFinishedRaw.matches ?? [])
    .sort((a: any, b: any) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, 5)
    .map((match: any) => toResult(match, numericId))

  const squad: SquadPlayer[] = teamRaw.squad?.map((player: any) => ({
    id: String(player.id),
    name: player.name,
    position: player.position,
    nationality: player.nationality,
    shirtNumber: player.shirtNumber ?? undefined,
  })) ?? []

  const strengths: string[] = []
  if ((stats?.wins ?? 0) > (stats?.losses ?? 0)) {
    strengths.push('Consistent league form with more wins than losses')
  }
  if ((stats?.goalsFor ?? 0) > (stats?.goalsAgainst ?? 0)) {
    strengths.push('Positive goal difference across the campaign')
  }
  if (lastFive.filter((result: 'W' | 'D' | 'L') => result === 'W').length >= 3) {
    strengths.push('Momentum building with three wins in the last five matches')
  }

  const description = teamRaw.clubColors
    ? `${teamRaw.shortName ?? teamRaw.name} turn out in ${teamRaw.clubColors.toLowerCase()} and call ${teamRaw.venue} home.`
    : `${teamRaw.shortName ?? teamRaw.name} compete in the Premier League from ${teamRaw.venue}.`

  return {
    id: String(teamRaw.id),
    name: teamRaw.shortName ?? teamRaw.name,
    crest: teamRaw.crest ?? '',
    venue: teamRaw.venue ?? 'Unknown venue',
    coach: teamRaw.coach?.name,
    founded: teamRaw.founded,
    clubColors: teamRaw.clubColors,
    description,
    strengths,
    lastFive,
    position: leaguePosition,
    stats,
    upcomingFixtures,
    recentResults,
    squad,
  }
}
