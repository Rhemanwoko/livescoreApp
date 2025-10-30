export type MatchSummary = {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  date: string
  competition: string
}

export type AttackingSnapshot = {
  team: string
  goalsFor: number
  wins: number
}

export const heroMatch: MatchSummary = {
  id: 'match-2024-10-19-ars-che',
  homeTeam: 'Arsenal',
  awayTeam: 'Chelsea',
  homeScore: 3,
  awayScore: 1,
  date: 'Sat 19 Oct 2024',
  competition: 'Premier League — Matchday 9',
}

export const recentHighlights: MatchSummary[] = [
  {
    id: 'match-2024-10-20-liv-spu',
    homeTeam: 'Liverpool',
    awayTeam: 'Tottenham',
    homeScore: 2,
    awayScore: 2,
    date: 'Sun 20 Oct',
    competition: 'Premier League — Matchday 9',
  },
  {
    id: 'match-2024-10-21-mci-mun',
    homeTeam: 'Man City',
    awayTeam: 'Man United',
    homeScore: 4,
    awayScore: 1,
    date: 'Mon 21 Oct',
    competition: 'Premier League — Matchday 9',
  },
  {
    id: 'match-2024-10-22-new-ast',
    homeTeam: 'Newcastle',
    awayTeam: 'Aston Villa',
    homeScore: 1,
    awayScore: 0,
    date: 'Tue 22 Oct',
    competition: 'Premier League — Matchday 9',
  },
]

export const attackingStats: AttackingSnapshot[] = [
  { team: 'Manchester City', goalsFor: 24, wins: 8 },
  { team: 'Arsenal', goalsFor: 20, wins: 7 },
  { team: 'Liverpool', goalsFor: 19, wins: 6 },
  { team: 'Tottenham Hotspur', goalsFor: 18, wins: 6 },
  { team: 'Aston Villa', goalsFor: 17, wins: 6 },
  { team: 'Chelsea', goalsFor: 15, wins: 5 },
  { team: 'Newcastle United', goalsFor: 14, wins: 4 },
  { team: 'Brighton & Hove Albion', goalsFor: 13, wins: 4 },
  { team: 'Manchester United', goalsFor: 11, wins: 4 },
  { team: 'West Ham United', goalsFor: 10, wins: 3 },
]

export const momentumTrend: Record<string, number[]> = {
  'Manchester City': [3, 3, 1, 3, 3],
  Arsenal: [3, 3, 3, 1, 3],
  Liverpool: [3, 1, 3, 1, 3],
  Tottenham: [3, 3, 0, 3, 1],
  'Aston Villa': [1, 3, 3, 1, 3],
  Chelsea: [0, 3, 3, 1, 3],
}

export const tableInsights: string[] = [
  'Manchester City remain the only side averaging over 2.5 goals per game.',
  'Arsenal have conceded just six goals across their opening nine fixtures.',
  'Tottenham lead the league for pressing efficiency, forcing 12 high turnovers per match.',
  'Liverpool have taken the most shots from inside the box, averaging 11 per game.',
  'Newcastle’s 4-3-3 has produced the highest xG swing over the past five matches.',
]
