"use client"

import { createContext, useContext, type ReactNode } from "react"

// Types for cricket data
export interface Team {
  id: string
  name: string
  shortName: string
  logo: string
  playerCount: number
  maxPlayers: number
}

export interface Player {
  id: string
  name: string
  age: number
  teamId?: string
  teamName?: string
  role: string
  battingStyle: string
  bowlingStyle: string
}

export interface Match {
  id: string
  teamA: Team
  teamB: Team
  status: "ongoing" | "scheduled" | "completed"
  matchType: string
  startDateTime: string
  location: string
  result?: string
}

export interface Official {
  id: string
  name: string
  role: string
  experience: number
  nationality: string
}

export interface Weather {
  id: string
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  forecast: string
}

interface CricketContextType {
  matches: Match[]
  teams: Team[]
  players: Player[]
  officials: Official[]
  weather: Weather[]
}

const sampleData: CricketContextType = {
  matches: [
    {
      id: "1",
      teamA: {
        id: "1",
        name: "Australia",
        shortName: "AUS",
        logo: "/generic-cricket-logo.png",
        playerCount: 15,
        maxPlayers: 15,
      },
      teamB: {
        id: "2",
        name: "Sri Lanka",
        shortName: "SL",
        logo: "/sri-lanka-cricket-logo.png",
        playerCount: 14,
        maxPlayers: 15,
      },
      status: "ongoing",
      matchType: "1st ODI",
      startDateTime: "2024-01-15T14:30:00",
      location: "Melbourne Cricket Ground",
      result: "AUS 287/6 (50 overs) vs SL 156/8 (35 overs)",
    },
    {
      id: "2",
      teamA: {
        id: "3",
        name: "India",
        shortName: "IND",
        logo: "/india-cricket-logo.png",
        playerCount: 15,
        maxPlayers: 15,
      },
      teamB: {
        id: "4",
        name: "England",
        shortName: "ENG",
        logo: "/england-cricket-logo.png",
        playerCount: 13,
        maxPlayers: 15,
      },
      status: "scheduled",
      matchType: "2nd Test",
      startDateTime: "2024-01-20T10:00:00",
      location: "Lord's Cricket Ground",
    },
    {
      id: "3",
      teamA: {
        id: "5",
        name: "Pakistan",
        shortName: "PAK",
        logo: "/generic-cricket-logo.png",
        playerCount: 14,
        maxPlayers: 15,
      },
      teamB: {
        id: "6",
        name: "New Zealand",
        shortName: "NZ",
        logo: "/generic-cricket-logo.png",
        playerCount: 15,
        maxPlayers: 15,
      },
      status: "completed",
      matchType: "T20I",
      startDateTime: "2024-01-10T19:00:00",
      location: "Eden Park",
      result: "NZ won by 7 wickets",
    },
  ],
  teams: [
    {
      id: "1",
      name: "Australia",
      shortName: "AUS",
      logo: "/generic-cricket-logo.png",
      playerCount: 15,
      maxPlayers: 15,
    },
    {
      id: "2",
      name: "Sri Lanka",
      shortName: "SL",
      logo: "/sri-lanka-cricket-logo.png",
      playerCount: 14,
      maxPlayers: 15,
    },
    {
      id: "3",
      name: "India",
      shortName: "IND",
      logo: "/india-cricket-logo.png",
      playerCount: 15,
      maxPlayers: 15,
    },
    {
      id: "4",
      name: "England",
      shortName: "ENG",
      logo: "/england-cricket-logo.png",
      playerCount: 13,
      maxPlayers: 15,
    },
    {
      id: "5",
      name: "Pakistan",
      shortName: "PAK",
      logo: "/generic-cricket-logo.png",
      playerCount: 14,
      maxPlayers: 15,
    },
    {
      id: "6",
      name: "New Zealand",
      shortName: "NZ",
      logo: "/generic-cricket-logo.png",
      playerCount: 15,
      maxPlayers: 15,
    },
  ],
  players: [
    {
      id: "1",
      name: "Steve Smith",
      age: 34,
      teamId: "1",
      teamName: "Australia",
      role: "Batsman",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm leg break",
    },
    {
      id: "2",
      name: "Virat Kohli",
      age: 35,
      teamId: "3",
      teamName: "India",
      role: "Batsman",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm medium",
    },
    {
      id: "3",
      name: "Joe Root",
      age: 33,
      teamId: "4",
      teamName: "England",
      role: "Batsman",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm off break",
    },
    {
      id: "4",
      name: "Kusal Mendis",
      age: 28,
      teamId: "2",
      teamName: "Sri Lanka",
      role: "Wicket-keeper",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm medium",
    },
    {
      id: "5",
      name: "Mitchell Starc",
      age: 34,
      teamId: "1",
      teamName: "Australia",
      role: "Bowler",
      battingStyle: "Left-handed",
      bowlingStyle: "Left-arm fast",
    },
    {
      id: "6",
      name: "Babar Azam",
      age: 29,
      teamId: "5",
      teamName: "Pakistan",
      role: "Batsman",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm medium",
    },
    {
      id: "7",
      name: "Kane Williamson",
      age: 33,
      teamId: "6",
      teamName: "New Zealand",
      role: "Batsman",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm off break",
    },
    {
      id: "8",
      name: "Jasprit Bumrah",
      age: 30,
      teamId: "3",
      teamName: "India",
      role: "Bowler",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm fast",
    },
    {
      id: "9",
      name: "Ben Stokes",
      age: 32,
      teamId: "4",
      teamName: "England",
      role: "All-rounder",
      battingStyle: "Left-handed",
      bowlingStyle: "Right-arm fast-medium",
    },
    {
      id: "10",
      name: "Wanindu Hasaranga",
      age: 26,
      teamId: "2",
      teamName: "Sri Lanka",
      role: "All-rounder",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm leg break",
    },
    {
      id: "11",
      name: "Marcus Stoinis",
      age: 34,
      role: "All-rounder",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm medium",
    },
    {
      id: "12",
      name: "Rashid Khan",
      age: 25,
      role: "Bowler",
      battingStyle: "Right-handed",
      bowlingStyle: "Right-arm leg break",
    },
  ],
  officials: [
    {
      id: "1",
      name: "Kumar Dharmasena",
      role: "Umpire",
      experience: 15,
      nationality: "Sri Lankan",
    },
    {
      id: "2",
      name: "Marais Erasmus",
      role: "Umpire",
      experience: 12,
      nationality: "South African",
    },
    {
      id: "3",
      name: "Andy Pycroft",
      role: "Match Referee",
      experience: 20,
      nationality: "Zimbabwean",
    },
    {
      id: "4",
      name: "Richard Kettleborough",
      role: "Umpire",
      experience: 18,
      nationality: "English",
    },
    {
      id: "5",
      name: "Joel Wilson",
      role: "Umpire",
      experience: 8,
      nationality: "West Indian",
    },
    {
      id: "6",
      name: "Chris Broad",
      role: "Match Referee",
      experience: 25,
      nationality: "English",
    },
  ],
  weather: [
    {
      id: "1",
      location: "Melbourne Cricket Ground",
      temperature: 28,
      condition: "Sunny",
      humidity: 45,
      windSpeed: 12,
      forecast: "Clear skies expected",
    },
    {
      id: "2",
      location: "Lord's Cricket Ground",
      temperature: 18,
      condition: "Cloudy",
      humidity: 65,
      windSpeed: 8,
      forecast: "Light rain possible",
    },
    {
      id: "3",
      location: "Eden Park",
      temperature: 22,
      condition: "Partly Cloudy",
      humidity: 55,
      windSpeed: 15,
      forecast: "Good conditions for cricket",
    },
    {
      id: "4",
      location: "Wankhede Stadium",
      temperature: 32,
      condition: "Hot",
      humidity: 70,
      windSpeed: 5,
      forecast: "Hot and humid conditions",
    },
  ],
}

const CricketContext = createContext<CricketContextType | undefined>(undefined)

export function CricketProvider({ children }: { children: ReactNode }) {
  return <CricketContext.Provider value={sampleData}>{children}</CricketContext.Provider>
}

export function useCricket() {
  const context = useContext(CricketContext)
  if (context === undefined) {
    throw new Error("useCricket must be used within a CricketProvider")
  }
  return context
}
