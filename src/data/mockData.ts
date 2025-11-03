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

export type LeagueStanding = {
  teamId: string
  team: string
  crest: string
  position: number
  played: number
  won: number
  drawn: number
  lost: number
  goalDifference: number
  points: number
  form: string
}

export type TopScorer = {
  id: string
  player: string
  team: string
  teamCrest: string
  goals: number
  assists: number
}

export type TeamSummary = {
  id: string
  name: string
  crest: string
  founded?: number
  venue: string
  clubColors?: string
  coach?: string
  form?: string
  points?: number
  goalDifference?: number
}

export type Fixture = {
  id: string
  date: string
  competition: string
  opponent: string
  venue: 'Home' | 'Away'
}

export type Result = {
  id: string
  date: string
  competition: string
  opponent: string
  score: string
  outcome: 'W' | 'D' | 'L'
}

export type SquadPlayer = {
  id: string
  name: string
  position: string
  nationality: string
  shirtNumber?: number
}

export type TeamDetail = {
  id: string
  name: string
  crest: string
  venue: string
  coach?: string
  founded?: number
  clubColors?: string
  description: string
  strengths: string[]
  lastFive: Array<'W' | 'D' | 'L'>
  stats: {
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
    points: number
    goalDifference: number
  }
  upcomingFixtures: Fixture[]
  recentResults: Result[]
  squad: SquadPlayer[]
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
  { team: 'Arsenal', goalsFor: 21, wins: 7 },
  { team: 'Liverpool', goalsFor: 20, wins: 6 },
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

export const mockStandings: LeagueStanding[] = [
  {
    teamId: '65',
    team: 'Manchester City',
    crest: 'https://crests.football-data.org/65.svg',
    position: 1,
    played: 9,
    won: 8,
    drawn: 1,
    lost: 0,
    goalDifference: 16,
    points: 25,
    form: 'W,W,W,D,W',
  },
  {
    teamId: '57',
    team: 'Arsenal',
    crest: 'https://crests.football-data.org/57.svg',
    position: 2,
    played: 9,
    won: 7,
    drawn: 1,
    lost: 1,
    goalDifference: 13,
    points: 22,
    form: 'W,W,W,L,W',
  },
  {
    teamId: '64',
    team: 'Liverpool',
    crest: 'https://crests.football-data.org/64.svg',
    position: 3,
    played: 9,
    won: 6,
    drawn: 2,
    lost: 1,
    goalDifference: 11,
    points: 20,
    form: 'W,D,W,W,D',
  },
  {
    teamId: '73',
    team: 'Tottenham Hotspur',
    crest: 'https://crests.football-data.org/73.svg',
    position: 4,
    played: 9,
    won: 6,
    drawn: 2,
    lost: 1,
    goalDifference: 9,
    points: 20,
    form: 'W,W,L,W,D',
  },
  {
    teamId: '58',
    team: 'Aston Villa',
    crest: 'https://crests.football-data.org/58.svg',
    position: 5,
    played: 9,
    won: 6,
    drawn: 1,
    lost: 2,
    goalDifference: 7,
    points: 19,
    form: 'W,W,L,W,W',
  },
  {
    teamId: '61',
    team: 'Chelsea',
    crest: 'https://crests.football-data.org/61.svg',
    position: 6,
    played: 9,
    won: 5,
    drawn: 1,
    lost: 3,
    goalDifference: 5,
    points: 16,
    form: 'L,W,W,L,W',
  },
  {
    teamId: '67',
    team: 'Newcastle United',
    crest: 'https://crests.football-data.org/67.svg',
    position: 7,
    played: 9,
    won: 4,
    drawn: 2,
    lost: 3,
    goalDifference: 4,
    points: 14,
    form: 'W,D,L,W,L',
  },
  {
    teamId: '62',
    team: 'Everton',
    crest: 'https://crests.football-data.org/62.svg',
    position: 8,
    played: 9,
    won: 4,
    drawn: 1,
    lost: 4,
    goalDifference: 1,
    points: 13,
    form: 'W,L,W,L,W',
  },
  {
    teamId: '397',
    team: 'Brighton & Hove Albion',
    crest: 'https://crests.football-data.org/397.svg',
    position: 9,
    played: 9,
    won: 4,
    drawn: 1,
    lost: 4,
    goalDifference: 0,
    points: 13,
    form: 'L,W,W,L,L',
  },
  {
    teamId: '66',
    team: 'Manchester United',
    crest: 'https://crests.football-data.org/66.svg',
    position: 10,
    played: 9,
    won: 4,
    drawn: 1,
    lost: 4,
    goalDifference: -1,
    points: 13,
    form: 'W,L,W,W,L',
  },
]

export const mockTopScorers: TopScorer[] = [
  {
    id: 'scorer-1',
    player: 'Erling Haaland',
    team: 'Manchester City',
    teamCrest: 'https://crests.football-data.org/65.svg',
    goals: 9,
    assists: 3,
  },
  {
    id: 'scorer-2',
    player: 'Bukayo Saka',
    team: 'Arsenal',
    teamCrest: 'https://crests.football-data.org/57.svg',
    goals: 6,
    assists: 5,
  },
  {
    id: 'scorer-3',
    player: 'Mohamed Salah',
    team: 'Liverpool',
    teamCrest: 'https://crests.football-data.org/64.svg',
    goals: 7,
    assists: 4,
  },
  {
    id: 'scorer-4',
    player: 'Son Heung-min',
    team: 'Tottenham Hotspur',
    teamCrest: 'https://crests.football-data.org/73.svg',
    goals: 6,
    assists: 2,
  },
  {
    id: 'scorer-5',
    player: 'Ollie Watkins',
    team: 'Aston Villa',
    teamCrest: 'https://crests.football-data.org/58.svg',
    goals: 5,
    assists: 4,
  },
  {
    id: 'scorer-6',
    player: 'Raheem Sterling',
    team: 'Chelsea',
    teamCrest: 'https://crests.football-data.org/61.svg',
    goals: 4,
    assists: 3,
  },
  {
    id: 'scorer-7',
    player: 'Alexander Isak',
    team: 'Newcastle United',
    teamCrest: 'https://crests.football-data.org/67.svg',
    goals: 4,
    assists: 2,
  },
  {
    id: 'scorer-8',
    player: 'Pascal Groß',
    team: 'Brighton & Hove Albion',
    teamCrest: 'https://crests.football-data.org/397.svg',
    goals: 3,
    assists: 4,
  },
]

const baseTeamDetails: Record<string, TeamDetail> = {
  '65': {
    id: '65',
    name: 'Manchester City',
    crest: 'https://crests.football-data.org/65.svg',
    venue: 'Etihad Stadium',
    coach: 'Pep Guardiola',
    founded: 1880,
    clubColors: 'Sky Blue / White',
    description:
      'City remain the league’s metronome under Guardiola, mixing patient control with ruthless finishing across every line.',
    strengths: ['Ball retention', 'Rotational pressing', 'Multi-threat forward line'],
    lastFive: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      wins: 8,
      draws: 1,
      losses: 0,
      goalsFor: 24,
      goalsAgainst: 8,
      goalDifference: 16,
      points: 25,
    },
    upcomingFixtures: [
      {
        id: '65-fixture-1',
        date: 'Sat 26 Oct',
        competition: 'Premier League',
        opponent: 'Brighton',
        venue: 'Home',
      },
      {
        id: '65-fixture-2',
        date: 'Wed 30 Oct',
        competition: 'Champions League',
        opponent: 'RB Leipzig',
        venue: 'Home',
      },
      {
        id: '65-fixture-3',
        date: 'Sun 3 Nov',
        competition: 'Premier League',
        opponent: 'Manchester United',
        venue: 'Away',
      },
    ],
    recentResults: [
      {
        id: '65-result-1',
        date: 'Sat 19 Oct',
        competition: 'Premier League',
        opponent: 'Chelsea',
        score: '3-1',
        outcome: 'W',
      },
      {
        id: '65-result-2',
        date: 'Tue 15 Oct',
        competition: 'Champions League',
        opponent: 'PSV',
        score: '2-0',
        outcome: 'W',
      },
      {
        id: '65-result-3',
        date: 'Sun 12 Oct',
        competition: 'Premier League',
        opponent: 'Liverpool',
        score: '2-2',
        outcome: 'D',
      },
    ],
    squad: [
      { id: '65-player-1', name: 'Ederson', position: 'Goalkeeper', nationality: 'Brazil', shirtNumber: 31 },
      { id: '65-player-2', name: 'Rúben Dias', position: 'Defender', nationality: 'Portugal', shirtNumber: 3 },
      { id: '65-player-3', name: 'Rodri', position: 'Midfielder', nationality: 'Spain', shirtNumber: 16 },
      { id: '65-player-4', name: 'Phil Foden', position: 'Midfielder', nationality: 'England', shirtNumber: 47 },
      { id: '65-player-5', name: 'Erling Haaland', position: 'Forward', nationality: 'Norway', shirtNumber: 9 },
    ],
  },
  '57': {
    id: '57',
    name: 'Arsenal',
    crest: 'https://crests.football-data.org/57.svg',
    venue: 'Emirates Stadium',
    coach: 'Mikel Arteta',
    founded: 1886,
    clubColors: 'Red / White',
    description:
      'Youthful Arsenal balance structure and spontaneity, flooding the half-spaces while locking teams into sustained pressure.',
    strengths: ['Wing rotations', 'Quick vertical combinations', 'Organised pressing traps'],
    lastFive: ['W', 'W', 'W', 'L', 'W'],
    stats: {
      wins: 7,
      draws: 1,
      losses: 1,
      goalsFor: 21,
      goalsAgainst: 8,
      goalDifference: 13,
      points: 22,
    },
    upcomingFixtures: [
      {
        id: '57-fixture-1',
        date: 'Sun 27 Oct',
        competition: 'Premier League',
        opponent: 'Newcastle',
        venue: 'Away',
      },
      {
        id: '57-fixture-2',
        date: 'Thu 31 Oct',
        competition: 'Champions League',
        opponent: 'Porto',
        venue: 'Away',
      },
      {
        id: '57-fixture-3',
        date: 'Sat 2 Nov',
        competition: 'Premier League',
        opponent: 'Tottenham',
        venue: 'Home',
      },
    ],
    recentResults: [
      {
        id: '57-result-1',
        date: 'Sat 19 Oct',
        competition: 'Premier League',
        opponent: 'Chelsea',
        score: '3-1',
        outcome: 'W',
      },
      {
        id: '57-result-2',
        date: 'Sun 13 Oct',
        competition: 'Premier League',
        opponent: 'Everton',
        score: '1-0',
        outcome: 'W',
      },
      {
        id: '57-result-3',
        date: 'Tue 8 Oct',
        competition: 'Champions League',
        opponent: 'PSG',
        score: '1-2',
        outcome: 'L',
      },
    ],
    squad: [
      { id: '57-player-1', name: 'Aaron Ramsdale', position: 'Goalkeeper', nationality: 'England', shirtNumber: 1 },
      { id: '57-player-2', name: 'William Saliba', position: 'Defender', nationality: 'France', shirtNumber: 2 },
      { id: '57-player-3', name: 'Declan Rice', position: 'Midfielder', nationality: 'England', shirtNumber: 41 },
      { id: '57-player-4', name: 'Martin Ødegaard', position: 'Midfielder', nationality: 'Norway', shirtNumber: 8 },
      { id: '57-player-5', name: 'Bukayo Saka', position: 'Forward', nationality: 'England', shirtNumber: 7 },
    ],
  },
  '64': {
    id: '64',
    name: 'Liverpool',
    crest: 'https://crests.football-data.org/64.svg',
    venue: 'Anfield',
    coach: 'Jürgen Klopp',
    founded: 1892,
    clubColors: 'Red / White',
    description:
      'Liverpool’s refreshed midfield has brought renewed energy, with wave after wave of pressure and a lethal front three.',
    strengths: ['Counter-pressing bursts', 'Wide overloads', 'Set-piece threat'],
    lastFive: ['W', 'D', 'W', 'W', 'D'],
    stats: {
      wins: 6,
      draws: 2,
      losses: 1,
      goalsFor: 20,
      goalsAgainst: 9,
      goalDifference: 11,
      points: 20,
    },
    upcomingFixtures: [
      {
        id: '64-fixture-1',
        date: 'Sat 26 Oct',
        competition: 'Premier League',
        opponent: 'Everton',
        venue: 'Home',
      },
      {
        id: '64-fixture-2',
        date: 'Thu 31 Oct',
        competition: 'Europa League',
        opponent: 'Atalanta',
        venue: 'Away',
      },
      {
        id: '64-fixture-3',
        date: 'Mon 4 Nov',
        competition: 'Premier League',
        opponent: 'Chelsea',
        venue: 'Away',
      },
    ],
    recentResults: [
      {
        id: '64-result-1',
        date: 'Sun 20 Oct',
        competition: 'Premier League',
        opponent: 'Tottenham',
        score: '2-2',
        outcome: 'D',
      },
      {
        id: '64-result-2',
        date: 'Thu 17 Oct',
        competition: 'Europa League',
        opponent: 'Union SG',
        score: '3-0',
        outcome: 'W',
      },
      {
        id: '64-result-3',
        date: 'Mon 14 Oct',
        competition: 'Premier League',
        opponent: 'Brighton',
        score: '2-1',
        outcome: 'W',
      },
    ],
    squad: [
      { id: '64-player-1', name: 'Alisson', position: 'Goalkeeper', nationality: 'Brazil', shirtNumber: 1 },
      { id: '64-player-2', name: 'Virgil van Dijk', position: 'Defender', nationality: 'Netherlands', shirtNumber: 4 },
      { id: '64-player-3', name: 'Dominik Szoboszlai', position: 'Midfielder', nationality: 'Hungary', shirtNumber: 8 },
      { id: '64-player-4', name: 'Alexis Mac Allister', position: 'Midfielder', nationality: 'Argentina', shirtNumber: 10 },
      { id: '64-player-5', name: 'Mohamed Salah', position: 'Forward', nationality: 'Egypt', shirtNumber: 11 },
    ],
  },
  '73': {
    id: '73',
    name: 'Tottenham Hotspur',
    crest: 'https://crests.football-data.org/73.svg',
    venue: 'Tottenham Hotspur Stadium',
    coach: 'Ange Postecoglou',
    founded: 1882,
    clubColors: 'White / Navy',
    description:
      'Ange-ball is in full flow with aggressive build-up play, daring full-backs and relentless pressure on the defensive line.',
    strengths: ['Fluid build-up rotations', 'Quick restarts', 'Front four interchange'],
    lastFive: ['W', 'W', 'L', 'W', 'D'],
    stats: {
      wins: 6,
      draws: 2,
      losses: 1,
      goalsFor: 18,
      goalsAgainst: 9,
      goalDifference: 9,
      points: 20,
    },
    upcomingFixtures: [
      {
        id: '73-fixture-1',
        date: 'Sun 27 Oct',
        competition: 'Premier League',
        opponent: 'Fulham',
        venue: 'Home',
      },
      {
        id: '73-fixture-2',
        date: 'Sat 2 Nov',
        competition: 'Premier League',
        opponent: 'Arsenal',
        venue: 'Away',
      },
      {
        id: '73-fixture-3',
        date: 'Wed 6 Nov',
        competition: 'Carabao Cup',
        opponent: 'Brentford',
        venue: 'Away',
      },
    ],
    recentResults: [
      {
        id: '73-result-1',
        date: 'Sun 20 Oct',
        competition: 'Premier League',
        opponent: 'Liverpool',
        score: '2-2',
        outcome: 'D',
      },
      {
        id: '73-result-2',
        date: 'Sat 12 Oct',
        competition: 'Premier League',
        opponent: 'Crystal Palace',
        score: '3-1',
        outcome: 'W',
      },
      {
        id: '73-result-3',
        date: 'Sun 6 Oct',
        competition: 'Premier League',
        opponent: 'Chelsea',
        score: '0-2',
        outcome: 'L',
      },
    ],
    squad: [
      { id: '73-player-1', name: 'Guglielmo Vicario', position: 'Goalkeeper', nationality: 'Italy', shirtNumber: 13 },
      { id: '73-player-2', name: 'Cristian Romero', position: 'Defender', nationality: 'Argentina', shirtNumber: 17 },
      { id: '73-player-3', name: 'Micky van de Ven', position: 'Defender', nationality: 'Netherlands', shirtNumber: 37 },
      { id: '73-player-4', name: 'James Maddison', position: 'Midfielder', nationality: 'England', shirtNumber: 10 },
      { id: '73-player-5', name: 'Son Heung-min', position: 'Forward', nationality: 'Korea Republic', shirtNumber: 7 },
    ],
  },
  '58': {
    id: '58',
    name: 'Aston Villa',
    crest: 'https://crests.football-data.org/58.svg',
    venue: 'Villa Park',
    coach: 'Unai Emery',
    founded: 1874,
    clubColors: 'Claret / Blue',
    description:
      'Villa’s positional play under Emery creates overloads on both flanks while maintaining a watertight defensive structure.',
    strengths: ['Positional discipline', 'Direct transitional threat', 'Set-piece routines'],
    lastFive: ['W', 'L', 'W', 'W', 'W'],
    stats: {
      wins: 6,
      draws: 1,
      losses: 2,
      goalsFor: 17,
      goalsAgainst: 10,
      goalDifference: 7,
      points: 19,
    },
    upcomingFixtures: [
      {
        id: '58-fixture-1',
        date: 'Sat 26 Oct',
        competition: 'Premier League',
        opponent: 'West Ham',
        venue: 'Away',
      },
      {
        id: '58-fixture-2',
        date: 'Thu 31 Oct',
        competition: 'Europa Conference League',
        opponent: 'Fiorentina',
        venue: 'Home',
      },
      {
        id: '58-fixture-3',
        date: 'Sun 3 Nov',
        competition: 'Premier League',
        opponent: 'Nottingham Forest',
        venue: 'Home',
      },
    ],
    recentResults: [
      {
        id: '58-result-1',
        date: 'Tue 22 Oct',
        competition: 'Premier League',
        opponent: 'Newcastle',
        score: '1-0',
        outcome: 'W',
      },
      {
        id: '58-result-2',
        date: 'Sat 18 Oct',
        competition: 'Premier League',
        opponent: 'Wolves',
        score: '2-1',
        outcome: 'W',
      },
      {
        id: '58-result-3',
        date: 'Thu 10 Oct',
        competition: 'Europa Conference League',
        opponent: 'Club Brugge',
        score: '0-2',
        outcome: 'L',
      },
    ],
    squad: [
      { id: '58-player-1', name: 'Emiliano Martínez', position: 'Goalkeeper', nationality: 'Argentina', shirtNumber: 1 },
      { id: '58-player-2', name: 'Ezri Konsa', position: 'Defender', nationality: 'England', shirtNumber: 4 },
      { id: '58-player-3', name: 'Pau Torres', position: 'Defender', nationality: 'Spain', shirtNumber: 14 },
      { id: '58-player-4', name: 'Douglas Luiz', position: 'Midfielder', nationality: 'Brazil', shirtNumber: 6 },
      { id: '58-player-5', name: 'Ollie Watkins', position: 'Forward', nationality: 'England', shirtNumber: 11 },
    ],
  },
  '61': {
    id: '61',
    name: 'Chelsea',
    crest: 'https://crests.football-data.org/61.svg',
    venue: 'Stamford Bridge',
    coach: 'Enzo Maresca',
    founded: 1905,
    clubColors: 'Blue / White',
    description:
      'Chelsea’s new-look attack is starting to click with Sterling and Palmer stretching defences with pace and precision.',
    strengths: ['Wing isolation play', 'Quick counters', 'Youthful energy'],
    lastFive: ['L', 'W', 'W', 'L', 'W'],
    stats: {
      wins: 5,
      draws: 1,
      losses: 3,
      goalsFor: 15,
      goalsAgainst: 10,
      goalDifference: 5,
      points: 16,
    },
    upcomingFixtures: [
      {
        id: '61-fixture-1',
        date: 'Sun 27 Oct',
        competition: 'Premier League',
        opponent: 'Brentford',
        venue: 'Home',
      },
      {
        id: '61-fixture-2',
        date: 'Wed 30 Oct',
        competition: 'Carabao Cup',
        opponent: 'Newcastle',
        venue: 'Home',
      },
      {
        id: '61-fixture-3',
        date: 'Sun 3 Nov',
        competition: 'Premier League',
        opponent: 'Liverpool',
        venue: 'Home',
      },
    ],
    recentResults: [
      {
        id: '61-result-1',
        date: 'Sat 19 Oct',
        competition: 'Premier League',
        opponent: 'Arsenal',
        score: '1-3',
        outcome: 'L',
      },
      {
        id: '61-result-2',
        date: 'Sun 13 Oct',
        competition: 'Premier League',
        opponent: 'Bournemouth',
        score: '2-0',
        outcome: 'W',
      },
      {
        id: '61-result-3',
        date: 'Sat 5 Oct',
        competition: 'Premier League',
        opponent: 'Tottenham',
        score: '2-0',
        outcome: 'W',
      },
    ],
    squad: [
      { id: '61-player-1', name: 'Robert Sánchez', position: 'Goalkeeper', nationality: 'Spain', shirtNumber: 1 },
      { id: '61-player-2', name: 'Reece James', position: 'Defender', nationality: 'England', shirtNumber: 24 },
      { id: '61-player-3', name: 'Enzo Fernández', position: 'Midfielder', nationality: 'Argentina', shirtNumber: 8 },
      { id: '61-player-4', name: 'Cole Palmer', position: 'Midfielder', nationality: 'England', shirtNumber: 20 },
      { id: '61-player-5', name: 'Raheem Sterling', position: 'Forward', nationality: 'England', shirtNumber: 7 },
    ],
  },
  '67': {
    id: '67',
    name: 'Newcastle United',
    crest: 'https://crests.football-data.org/67.svg',
    venue: 'St James\' Park',
    coach: 'Eddie Howe',
    founded: 1892,
    clubColors: 'Black / White',
    description:
      'Newcastle combine relentless pressing with a fast-breaking front line that punishes teams in transition.',
    strengths: ['High press intensity', 'Direct transitions', 'Set-piece threat'],
    lastFive: ['W', 'D', 'L', 'W', 'L'],
    stats: {
      wins: 4,
      draws: 2,
      losses: 3,
      goalsFor: 14,
      goalsAgainst: 10,
      goalDifference: 4,
      points: 14,
    },
    upcomingFixtures: [
      {
        id: '67-fixture-1',
        date: 'Sun 27 Oct',
        competition: 'Premier League',
        opponent: 'Arsenal',
        venue: 'Home',
      },
      {
        id: '67-fixture-2',
        date: 'Wed 30 Oct',
        competition: 'Carabao Cup',
        opponent: 'Chelsea',
        venue: 'Away',
      },
      {
        id: '67-fixture-3',
        date: 'Sat 2 Nov',
        competition: 'Premier League',
        opponent: 'Crystal Palace',
        venue: 'Away',
      },
    ],
    recentResults: [
      {
        id: '67-result-1',
        date: 'Tue 22 Oct',
        competition: 'Premier League',
        opponent: 'Aston Villa',
        score: '0-1',
        outcome: 'L',
      },
      {
        id: '67-result-2',
        date: 'Sat 19 Oct',
        competition: 'Premier League',
        opponent: 'Sheffield United',
        score: '3-0',
        outcome: 'W',
      },
      {
        id: '67-result-3',
        date: 'Sat 12 Oct',
        competition: 'Premier League',
        opponent: 'Wolves',
        score: '1-1',
        outcome: 'D',
      },
    ],
    squad: [
      { id: '67-player-1', name: 'Nick Pope', position: 'Goalkeeper', nationality: 'England', shirtNumber: 22 },
      { id: '67-player-2', name: 'Kieran Trippier', position: 'Defender', nationality: 'England', shirtNumber: 2 },
      { id: '67-player-3', name: 'Bruno Guimarães', position: 'Midfielder', nationality: 'Brazil', shirtNumber: 39 },
      { id: '67-player-4', name: 'Joelinton', position: 'Midfielder', nationality: 'Brazil', shirtNumber: 7 },
      { id: '67-player-5', name: 'Alexander Isak', position: 'Forward', nationality: 'Sweden', shirtNumber: 14 },
    ],
  },
  '397': {
    id: '397',
    name: 'Brighton & Hove Albion',
    crest: 'https://crests.football-data.org/397.svg',
    venue: 'Amex Stadium',
    coach: 'Fabian Hürzeler',
    founded: 1901,
    clubColors: 'Blue / White',
    description:
      'Brighton remain the league’s possession innovators, baiting pressure before slicing teams open through midfield.',
    strengths: ['Brave build-up', 'Midfield overloads', 'Rotating front line'],
    lastFive: ['L', 'W', 'W', 'L', 'L'],
    stats: {
      wins: 4,
      draws: 1,
      losses: 4,
      goalsFor: 13,
      goalsAgainst: 13,
      goalDifference: 0,
      points: 13,
    },
    upcomingFixtures: [
      {
        id: '397-fixture-1',
        date: 'Sat 26 Oct',
        competition: 'Premier League',
        opponent: 'Manchester City',
        venue: 'Away',
      },
      {
        id: '397-fixture-2',
        date: 'Thu 31 Oct',
        competition: 'Europa League',
        opponent: 'Ajax',
        venue: 'Home',
      },
      {
        id: '397-fixture-3',
        date: 'Sun 3 Nov',
        competition: 'Premier League',
        opponent: 'Everton',
        venue: 'Home',
      },
    ],
    recentResults: [
      {
        id: '397-result-1',
        date: 'Sun 20 Oct',
        competition: 'Premier League',
        opponent: 'Fulham',
        score: '1-2',
        outcome: 'L',
      },
      {
        id: '397-result-2',
        date: 'Thu 16 Oct',
        competition: 'Europa League',
        opponent: 'Marseille',
        score: '2-1',
        outcome: 'W',
      },
      {
        id: '397-result-3',
        date: 'Mon 14 Oct',
        competition: 'Premier League',
        opponent: 'Liverpool',
        score: '1-2',
        outcome: 'L',
      },
    ],
    squad: [
      { id: '397-player-1', name: 'Bart Verbruggen', position: 'Goalkeeper', nationality: 'Netherlands', shirtNumber: 1 },
      { id: '397-player-2', name: 'Lewis Dunk', position: 'Defender', nationality: 'England', shirtNumber: 5 },
      { id: '397-player-3', name: 'Pascal Groß', position: 'Midfielder', nationality: 'Germany', shirtNumber: 13 },
      { id: '397-player-4', name: 'Kaoru Mitoma', position: 'Midfielder', nationality: 'Japan', shirtNumber: 22 },
      { id: '397-player-5', name: 'João Pedro', position: 'Forward', nationality: 'Brazil', shirtNumber: 9 },
    ],
  },
}

export const mockTeamDetails: Record<string, TeamDetail> = baseTeamDetails

export const mockTeams: TeamSummary[] = Object.values(baseTeamDetails).map((team) => ({
  id: team.id,
  name: team.name,
  crest: team.crest,
  founded: team.founded,
  venue: team.venue,
  clubColors: team.clubColors,
  coach: team.coach,
  form: team.lastFive.join(','),
  points: team.stats.points,
  goalDifference: team.stats.goalDifference,
}))
