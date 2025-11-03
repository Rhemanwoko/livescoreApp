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
  goalsFor: number
  goalsAgainst: number
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
  position?: number
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
  description?: string
  strengths?: string[]
  lastFive: Array<'W' | 'D' | 'L'>
  position?: number
  stats?: {
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

export type PremierLeagueSnapshot = {
  standings: LeagueStanding[]
  scorers: TopScorer[]
  teams: TeamSummary[]
  recentMatches: MatchSummary[]
  upcomingFixtures: MatchSummary[]
}
