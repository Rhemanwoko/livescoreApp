export type LeagueStanding = {
  position: number
  teamId: string
  team: string
  crest: string
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
  nationality: string
  shirtNumber?: number
}

export type TeamSummary = {
  id: string
  name: string
  shortName: string
  crest: string
  venue?: string
  founded?: number
  clubColors?: string
  address?: string
  website?: string
  coach?: string
  form?: string
  points?: number
  goalDifference?: number
}

export type TeamDetail = TeamSummary & {
  description: string
  lastFive: string[]
  strengths: string[]
  stats?: {
    played: number
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
    goalDifference: number
    points: number
  }
  upcomingFixtures: Fixture[]
  recentResults: Result[]
  squad: Player[]
}

export type TopScorer = {
  id: string
  player: string
  team: string
  teamCrest?: string
  goals: number
  assists: number
}
