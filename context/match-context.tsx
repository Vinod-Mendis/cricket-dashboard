/** @format */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Types
interface Team {
  team_id: string;
  full_name: string;
  short_name: string;
  colors: {
    primary: string;
    secondary: string;
    extra: string;
  };
  logo: string;
}

interface TossData {
  winner_team_id: string;
  winner_team_name: string;
  winner_short_name: string;
  decision: string;
  summary: string;
}

interface MatchDetails {
  match_id: string;
  match_type: string;
  title: string;
  venue: string;
  status: string;
  start_time: string;
  team_a: Team;
  team_b: Team;
  winning_team: string | null;
  officials: {
    field_umpire: string;
    third_umpire: string;
    reserve_umpire: string;
    referee: string;
  };
  squads?: {
    team_a: Squad;
    team_b: Squad;
  };
  toss?: {
    winner_team_id: string;
    decision: string;
  };
}

interface Squad {
  team_info: {
    team_id: string;
    full_name: string;
    short_name: string;
    primary_color: string;
    secondary_color: string;
    extra_color: string;
    logo: string;
  };
  players: Array<{
    player_id: number;
    player_full_name: string;
    player_short_name: string;
    player_role: string;
    is_playing: boolean;
    is_captain: boolean;
    is_vice_captain: boolean;
    is_wicket_keeper: boolean;
  }>;
}

interface MatchContextType {
  matchId: string;
  matchDetails: MatchDetails | null;
  squads: { [key: string]: Squad } | null;
  innings: any | null;
  loading: boolean;
  error: string | null;
  setMatchDetails: (details: MatchDetails | null) => void;
  setSquads: (squads: { [key: string]: Squad } | null) => void;
  setInnings: (innings: any | null) => void;
  refreshMatchData: () => void;
  toss: TossData | null;
  setToss: (toss: TossData | null) => void;
  inningId: number | null;
}

// Create context
const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Provider component
interface MatchProviderProps {
  children: ReactNode;
  matchId: string;
}

export function MatchProvider({ children, matchId }: MatchProviderProps) {
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [squads, setSquads] = useState<{ [key: string]: Squad } | null>(null);
  const [innings, setInnings] = useState<any | null>(null);
  const [inningId, setInningID] = useState<any | null>(null);
  const [toss, setToss] = useState<TossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In MatchContext.tsx, modify fetchMatchData:
  const fetchMatchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [matchResponse, squadResponse, inningsResponse, tossResponse] =
        await Promise.all([
          fetch(
            `https://cricket-score-board-v4g9.onrender.com/api/matches/${matchId}`
          ),
          fetch(
            `https://cricket-score-board-v4g9.onrender.com/api/matches/${matchId}/squads`
          ),
          fetch(
            `https://cricket-score-board-v4g9.onrender.com/api/innings/match/${matchId}`
          ),
          fetch(
            `https://cricket-score-board-v4g9.onrender.com/api/matches/${matchId}/toss`
          ),
        ]);

      const matchData = await matchResponse.json();
      const squadData = await squadResponse.json();
      const inningsData = await inningsResponse.json();
      const tossData = await tossResponse.json();

      if (matchData.success) {
        setMatchDetails(matchData.data);
      }

      if (squadData.success) {
        setSquads(squadData.data.squads);
      }

      if (inningsData.success) {
        setInnings(inningsData.data);
        setInningID(inningsData.data[0]?.id || null);
      }

      // Add toss data handling
      if (tossData.success && tossData.data.toss) {
        setToss(tossData.data.toss);
      }
    } catch (error) {
      console.error("Error fetching match data:", error);
      setError("Failed to load match data");
    } finally {
      setLoading(false);
    }
  };

  const refreshMatchData = () => {
    fetchMatchData();
  };

  useEffect(() => {
    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

  const contextValue: MatchContextType = {
    matchId,
    matchDetails,
    squads,
    innings,
    inningId,
    toss,
    setToss,
    loading,
    error,
    setMatchDetails,
    setSquads,
    setInnings,
    refreshMatchData,
  };

  return (
    <MatchContext.Provider value={contextValue}>
      {children}
    </MatchContext.Provider>
  );
}

// Custom hook to use match context
export function useMatch() {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
}
