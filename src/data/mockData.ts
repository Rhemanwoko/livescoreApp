export type LeagueStanding = {
  position: number
  teamId: string
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string
}

export type MatchSummary = {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  date: string
  competition: string
}

export type Fixture = {
  id: string
  opponent: string
  date: string
  venue: 'Home' | 'Away'
  competition: string
}

export type Result = {
  id: string
  opponent: string
  date: string
  competition: string
  score: string
  outcome: 'W' | 'D' | 'L'
}

export type Player = {
  id: string
  name: string
  position: string
  goals: number
  assists: number
}

export type Team = {
  id: string
  name: string
  shortName: string
  logo: string
  founded: number
  stadium: string
  coach: string
  form: string
  description: string
  strengths: string[]
  lastFive: string[]
  stats: {
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
    cleanSheets: number
  }
  upcomingFixtures: Fixture[]
  recentResults: Result[]
  players: Player[]
}

export type TopScorer = {
  id: string
  player: string
  team: string
  goals: number
  assists: number
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

export const leagueTable: LeagueStanding[] = [
  {
    position: 1,
    teamId: 'man-city',
    team: 'Manchester City',
    played: 9,
    won: 7,
    drawn: 1,
    lost: 1,
    goalsFor: 24,
    goalsAgainst: 8,
    goalDifference: 16,
    points: 22,
    form: 'W W W D W',
  },
  {
    position: 2,
    teamId: 'arsenal',
    team: 'Arsenal',
    played: 9,
    won: 6,
    drawn: 2,
    lost: 1,
    goalsFor: 18,
    goalsAgainst: 9,
    goalDifference: 9,
    points: 20,
    form: 'W D W L W',
  },
  {
    position: 3,
    teamId: 'liverpool',
    team: 'Liverpool',
    played: 9,
    won: 6,
    drawn: 2,
    lost: 1,
    goalsFor: 21,
    goalsAgainst: 11,
    goalDifference: 10,
    points: 20,
    form: 'W W D W D',
  },
  {
    position: 4,
    teamId: 'tottenham',
    team: 'Tottenham Hotspur',
    played: 9,
    won: 5,
    drawn: 3,
    lost: 1,
    goalsFor: 17,
    goalsAgainst: 10,
    goalDifference: 7,
    points: 18,
    form: 'D W W D D',
  },
  {
    position: 5,
    teamId: 'chelsea',
    team: 'Chelsea',
    played: 9,
    won: 5,
    drawn: 1,
    lost: 3,
    goalsFor: 15,
    goalsAgainst: 12,
    goalDifference: 3,
    points: 16,
    form: 'W L W W L',
  },
  {
    position: 6,
    teamId: 'aston-villa',
    team: 'Aston Villa',
    played: 9,
    won: 4,
    drawn: 3,
    lost: 2,
    goalsFor: 14,
    goalsAgainst: 12,
    goalDifference: 2,
    points: 15,
    form: 'D W L D W',
  },
  {
    position: 7,
    teamId: 'newcastle',
    team: 'Newcastle United',
    played: 9,
    won: 4,
    drawn: 2,
    lost: 3,
    goalsFor: 13,
    goalsAgainst: 11,
    goalDifference: 2,
    points: 14,
    form: 'L W D W L',
  },
]

export const topScorers: TopScorer[] = [
  { id: 'player-haaland', player: 'Erling Haaland', team: 'Man City', goals: 9, assists: 3 },
  { id: 'player-salah', player: 'Mohamed Salah', team: 'Liverpool', goals: 8, assists: 5 },
  { id: 'player-watkins', player: 'Ollie Watkins', team: 'Aston Villa', goals: 7, assists: 4 },
  { id: 'player-son', player: 'Heung-Min Son', team: 'Tottenham', goals: 6, assists: 2 },
  { id: 'player-saka', player: 'Bukayo Saka', team: 'Arsenal', goals: 5, assists: 6 },
]

export const teams: Team[] = [
  {
    id: 'man-city',
    name: 'Manchester City',
    shortName: 'Man City',
    logo: 'https://crests.football-data.org/65.svg',
    founded: 1880,
    stadium: 'Etihad Stadium',
    coach: 'Pep Guardiola',
    form: 'WWWDL',
    description:
      'Manchester City continue to set the benchmark in possession-based, high-pressing football with a squad stacked with depth and versatility.',
    strengths: ['Control midfield zones', 'Flexible attacking rotations', 'Elite squad depth'],
    lastFive: ['W', 'W', 'W', 'D', 'L'],
    stats: {
      wins: 7,
      draws: 1,
      losses: 1,
      goalsFor: 24,
      goalsAgainst: 8,
      cleanSheets: 4,
    },
    upcomingFixtures: [
      { id: 'fixture-mci-bre', opponent: 'Brentford', date: 'Sat 02 Nov', venue: 'Home', competition: 'Premier League' },
      { id: 'fixture-mci-ucl', opponent: 'RB Leipzig', date: 'Tue 05 Nov', venue: 'Home', competition: 'Champions League' },
      { id: 'fixture-mci-ars', opponent: 'Arsenal', date: 'Sun 10 Nov', venue: 'Away', competition: 'Premier League' },
    ],
    recentResults: [
      { id: 'result-mci-ars', opponent: 'Arsenal', date: 'Sat 19 Oct', competition: 'Premier League', score: '3-1', outcome: 'W' },
      { id: 'result-mci-che', opponent: 'Chelsea', date: 'Sun 13 Oct', competition: 'Premier League', score: '2-1', outcome: 'W' },
      { id: 'result-mci-ucl', opponent: 'Real Madrid', date: 'Wed 09 Oct', competition: 'Champions League', score: '1-1', outcome: 'D' },
    ],
    players: [
      { id: 'player-haaland', name: 'Erling Haaland', position: 'Forward', goals: 9, assists: 2 },
      { id: 'player-debruyne', name: 'Kevin De Bruyne', position: 'Midfielder', goals: 3, assists: 6 },
      { id: 'player-rodri', name: 'Rodri', position: 'Midfielder', goals: 2, assists: 2 },
      { id: 'player-dias', name: 'Rúben Dias', position: 'Defender', goals: 1, assists: 0 },
    ],
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    shortName: 'Arsenal',
    logo: 'https://crests.football-data.org/57.svg',
    founded: 1886,
    stadium: 'Emirates Stadium',
    coach: 'Mikel Arteta',
    form: 'WWDLW',
    description:
      'Arsenal are thriving under Arteta with slick positional play, dynamic wingers, and a resilient defensive block anchored by Saliba and Rice.',
    strengths: ['Structured build-up', 'Aggressive pressing', 'Creative wide players'],
    lastFive: ['W', 'W', 'D', 'L', 'W'],
    stats: {
      wins: 6,
      draws: 2,
      losses: 1,
      goalsFor: 18,
      goalsAgainst: 9,
      cleanSheets: 3,
    },
    upcomingFixtures: [
      { id: 'fixture-ars-new', opponent: 'Newcastle', date: 'Sat 02 Nov', venue: 'Away', competition: 'Premier League' },
      { id: 'fixture-ars-ucl', opponent: 'Bayern Munich', date: 'Wed 06 Nov', venue: 'Home', competition: 'Champions League' },
      { id: 'fixture-ars-mci', opponent: 'Man City', date: 'Sun 10 Nov', venue: 'Home', competition: 'Premier League' },
    ],
    recentResults: [
      { id: 'result-ars-che', opponent: 'Chelsea', date: 'Sat 19 Oct', competition: 'Premier League', score: '3-1', outcome: 'W' },
      { id: 'result-ars-tot', opponent: 'Tottenham', date: 'Sun 13 Oct', competition: 'Premier League', score: '2-2', outcome: 'D' },
      { id: 'result-ars-ucl', opponent: 'PSV', date: 'Tue 08 Oct', competition: 'Champions League', score: '1-2', outcome: 'L' },
    ],
    players: [
      { id: 'player-saka', name: 'Bukayo Saka', position: 'Forward', goals: 5, assists: 6 },
      { id: 'player-odegaard', name: 'Martin Ødegaard', position: 'Midfielder', goals: 4, assists: 3 },
      { id: 'player-rice', name: 'Declan Rice', position: 'Midfielder', goals: 2, assists: 1 },
      { id: 'player-saliba', name: 'William Saliba', position: 'Defender', goals: 1, assists: 0 },
    ],
  },
  {
    id: 'liverpool',
    name: 'Liverpool',
    shortName: 'Liverpool',
    logo: 'https://crests.football-data.org/64.svg',
    founded: 1892,
    stadium: 'Anfield',
    coach: 'Jürgen Klopp',
    form: 'WWDWD',
    description:
      'Liverpool are leaning on their high-intensity counter-press, creative midfielders, and Salah’s cutting edge to stay in the title mix.',
    strengths: ['Counter-pressing', 'Dynamic full-backs', 'Elite forward line'],
    lastFive: ['W', 'W', 'D', 'W', 'D'],
    stats: {
      wins: 6,
      draws: 2,
      losses: 1,
      goalsFor: 21,
      goalsAgainst: 11,
      cleanSheets: 2,
    },
    upcomingFixtures: [
      { id: 'fixture-liv-bou', opponent: 'Bournemouth', date: 'Sat 02 Nov', venue: 'Home', competition: 'Premier League' },
      { id: 'fixture-liv-eur', opponent: 'Atalanta', date: 'Thu 07 Nov', venue: 'Away', competition: 'Europa League' },
      { id: 'fixture-liv-mci', opponent: 'Man City', date: 'Sun 10 Nov', venue: 'Away', competition: 'Premier League' },
    ],
    recentResults: [
      { id: 'result-liv-spu', opponent: 'Tottenham', date: 'Sun 20 Oct', competition: 'Premier League', score: '2-2', outcome: 'D' },
      { id: 'result-liv-ful', opponent: 'Fulham', date: 'Sat 12 Oct', competition: 'Premier League', score: '3-0', outcome: 'W' },
      { id: 'result-liv-eur', opponent: 'Marseille', date: 'Thu 10 Oct', competition: 'Europa League', score: '2-1', outcome: 'W' },
    ],
    players: [
      { id: 'player-salah', name: 'Mohamed Salah', position: 'Forward', goals: 8, assists: 5 },
      { id: 'player-nunez', name: 'Darwin Núñez', position: 'Forward', goals: 4, assists: 2 },
      { id: 'player-macallister', name: 'Alexis Mac Allister', position: 'Midfielder', goals: 2, assists: 3 },
      { id: 'player-van-dijk', name: 'Virgil van Dijk', position: 'Defender', goals: 1, assists: 0 },
    ],
  },
  {
    id: 'tottenham',
    name: 'Tottenham Hotspur',
    shortName: 'Spurs',
    logo: 'https://crests.football-data.org/73.svg',
    founded: 1882,
    stadium: 'Tottenham Hotspur Stadium',
    coach: 'Ange Postecoglou',
    form: 'DWWDD',
    description:
      'Tottenham play fearless, front-foot football with a focus on rapid transitions and adventurous full-backs supporting Son and Maddison.',
    strengths: ['Fluid attacking rotations', 'Quick transitions', 'High defensive line'],
    lastFive: ['D', 'W', 'W', 'D', 'D'],
    stats: {
      wins: 5,
      draws: 3,
      losses: 1,
      goalsFor: 17,
      goalsAgainst: 10,
      cleanSheets: 2,
    },
    upcomingFixtures: [
      { id: 'fixture-spu-lei', opponent: 'Leicester', date: 'Sun 03 Nov', venue: 'Home', competition: 'Premier League' },
      { id: 'fixture-spu-uel', opponent: 'Sporting CP', date: 'Thu 07 Nov', venue: 'Away', competition: 'Europa League' },
      { id: 'fixture-spu-che', opponent: 'Chelsea', date: 'Sun 17 Nov', venue: 'Away', competition: 'Premier League' },
    ],
    recentResults: [
      { id: 'result-spu-ava', opponent: 'Aston Villa', date: 'Sat 19 Oct', competition: 'Premier League', score: '2-1', outcome: 'W' },
      { id: 'result-spu-liv', opponent: 'Liverpool', date: 'Sun 13 Oct', competition: 'Premier League', score: '2-2', outcome: 'D' },
      { id: 'result-spu-uel', opponent: 'Rennes', date: 'Thu 10 Oct', competition: 'Europa League', score: '1-0', outcome: 'W' },
    ],
    players: [
      { id: 'player-son', name: 'Heung-Min Son', position: 'Forward', goals: 6, assists: 2 },
      { id: 'player-maddison', name: 'James Maddison', position: 'Midfielder', goals: 4, assists: 5 },
      { id: 'player-udogie', name: 'Destiny Udogie', position: 'Defender', goals: 1, assists: 3 },
      { id: 'player-vicario', name: 'Guglielmo Vicario', position: 'Goalkeeper', goals: 0, assists: 0 },
    ],
  },
  {
    id: 'chelsea',
    name: 'Chelsea',
    shortName: 'Chelsea',
    logo: 'https://crests.football-data.org/61.svg',
    founded: 1905,
    stadium: 'Stamford Bridge',
    coach: 'Mauricio Pochettino',
    form: 'WLWWL',
    description:
      'Chelsea are blending emerging academy stars with new signings, leaning on quick wide play and a disciplined double pivot.',
    strengths: ['Direct wing play', 'Energetic midfield', 'Flexible pressing triggers'],
    lastFive: ['W', 'L', 'W', 'W', 'L'],
    stats: {
      wins: 5,
      draws: 1,
      losses: 3,
      goalsFor: 15,
      goalsAgainst: 12,
      cleanSheets: 2,
    },
    upcomingFixtures: [
      { id: 'fixture-che-wol', opponent: 'Wolves', date: 'Sat 02 Nov', venue: 'Home', competition: 'Premier League' },
      { id: 'fixture-che-car', opponent: 'Cardiff City', date: 'Wed 06 Nov', venue: 'Away', competition: 'Carabao Cup' },
      { id: 'fixture-che-spu', opponent: 'Tottenham', date: 'Sun 17 Nov', venue: 'Home', competition: 'Premier League' },
    ],
    recentResults: [
      { id: 'result-che-ars', opponent: 'Arsenal', date: 'Sat 19 Oct', competition: 'Premier League', score: '1-3', outcome: 'L' },
      { id: 'result-che-cry', opponent: 'Crystal Palace', date: 'Sun 13 Oct', competition: 'Premier League', score: '2-0', outcome: 'W' },
      { id: 'result-che-car', opponent: 'Cardiff City', date: 'Wed 09 Oct', competition: 'Carabao Cup', score: '2-1', outcome: 'W' },
    ],
    players: [
      { id: 'player-palmer', name: 'Cole Palmer', position: 'Forward', goals: 4, assists: 4 },
      { id: 'player-sterling', name: 'Raheem Sterling', position: 'Forward', goals: 3, assists: 2 },
      { id: 'player-enzo', name: 'Enzo Fernández', position: 'Midfielder', goals: 2, assists: 3 },
      { id: 'player-colwill', name: 'Levi Colwill', position: 'Defender', goals: 1, assists: 1 },
    ],
  },
]

export const attackingStats = leagueTable.slice(0, 5).map((entry) => ({
  teamId: entry.teamId,
  team: entry.team,
  goalsFor: entry.goalsFor,
  goalsAgainst: entry.goalsAgainst,
  wins: entry.won,
  points: entry.points,
}))

export const momentumTrend: Record<string, number[]> = {
  'Man City': [3, 3, 3, 1, 0],
  Arsenal: [3, 3, 1, 0, 3],
  Liverpool: [3, 3, 1, 3, 1],
  'Tottenham Hotspur': [1, 3, 3, 1, 1],
  Chelsea: [3, 0, 3, 3, 0],
}

export const tableInsights = [
  'Man City hold the best goal difference in the division and top both goals scored and clean sheet charts.',
  'Arsenal and Liverpool remain within two points of the summit, separated only by goal difference.',
  'Tottenham are unbeaten in five with Son and Maddison combining for 13 goal contributions.',
]

