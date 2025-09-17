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

// Live Status Types
interface CurrentBatsman {
  id: number;
  innings_id: number;
  player_id: number;
  batting_position: number;
  batting_order: number;
  status: string;
  currently_batting: boolean;
  is_striker: boolean;
  runs_scored: number;
  balls_faced: number;
  fours: number;
  sixes: number;
  strike_rate: string;
  dismissed_by_bowler_id: number | null;
  fielder_id: number | null;
  dismissal_ball: number | null;
  dismissal_over: number | null;
  partnership_runs: number;
  partnership_balls: number;
  time_in: string;
  time_out: string | null;
  created_at: string;
  updated_at: string;
  player_name: string;
}

interface CurrentBowler {
  id: number;
  innings_id: number;
  bowler_id: number;
  overs_bowled: string;
  balls_bowled: number;
  runs_conceded: number;
  wickets_taken: number;
  wides: number;
  no_balls: number;
  economy_rate: string;
  bowling_average: string;
  bowling_strike_rate: string;
  spell_number: number;
  created_at: string;
  updated_at: string;
  illegal_balls: number;
  bowler_name: string;
}

interface CurrentPartnership {
  id: number;
  innings_id: number;
  batsman1_id: number;
  batsman2_id: number;
  wicket_number: number;
  partnership_runs: number;
  partnership_balls: number;
  fours: number;
  sixes: number;
  start_ball_id: number;
  end_ball_id: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  batsman1_name: string;
  batsman2_name: string;
  run_rate: string;
}

interface LastBall {
  id: number;
  innings_id: number;
  over_number: number;
  ball_number: number;
  legal_ball: boolean;
  bowler_id: number;
  striker_id: number;
  non_striker_id: number;
  runs_scored: number;
  extras: number;
  total_runs: number;
  ball_type: string;
  is_wicket: boolean;
  wicket_type: string | null;
  dismissed_player_id: number | null;
  fielder_id: number | null;
  shot_type: string;
  fielding_position: string;
  commentary: string;
  team_score: number;
  team_wickets: number;
  created_at: string;
  bowler_name: string;
}

interface RecentWicket {
  wicket_number: number;
  score: number;
  over: string;
  dismissal: string;
  display: string;
}

interface LiveStatus {
  innings_summary: {
    score: string;
    overs: string;
    run_rate: string;
  };
  current_partnership: CurrentPartnership;
  current_batsmen: CurrentBatsman[];
  current_bowler: CurrentBowler;
  last_ball: LastBall;
  match_status: string;
  recent_wickets: RecentWicket[];
}

interface BallEvent {
  innings_id: number;
  over_number: number;
  ball_number: number;
  legal_ball: boolean;
  bowler_id: number | null;
  bowler_name: string | null;
  striker_id: number | null;
  striker_name: string | null;
  non_striker_name: string | null;
  non_striker_id: number | null;
  runs_scored: number;
  extras: number;
  ball_type:
    | "LEGAL"
    | "WIDE"
    | "NO_BALL"
    | "BYE"
    | "LEG_BYE"
    | "NO_BALL_BYE"
    | "NO_BALL_LEG_BYE"
    | "NO_BALL_RUN";
  is_wicket: boolean;
  wicket_type: string | null;
  dismissed_player_id: number | null;
  fielder_id: number | null;
  shot_type: string | null;
  fielding_position: string | null;
  commentary: string | null;
  team_score: number;
  team_wickets: number;
}

interface BattingPlayer {
  id: number;
  innings_id: number;
  player_id: number;
  batting_position: number;
  batting_order: number;
  status: "NOT_OUT" | "CAUGHT" | "BOWLED" | "LBW" | "RUN_OUT" | "STUMPED";
  currently_batting: boolean;
  is_striker: boolean;
  runs_scored: number;
  balls_faced: number;
  fours: number;
  sixes: number;
  strike_rate: string;
  dismissed_by_bowler_id?: number;
  fielder_id?: number;
  dismissal_ball?: number;
  dismissal_over?: number;
  partnership_runs: number;
  partnership_balls: number;
  time_in?: string;
  time_out?: string;
  created_at: string;
  updated_at: string;
  player_name: string;
  team_id?: number;
  player_role: string;
}

interface BattingOrderData {
  innings_id: string;
  batting_order: BattingPlayer[];
  total_batsmen: number;
  currently_batting: BattingPlayer[];
  next_batsmen: BattingPlayer[];
}

interface MatchContextType {
  matchId: string;
  matchDetails: MatchDetails | null;
  squads: { [key: string]: Squad } | null;
  innings: any | null;
  liveStatus: LiveStatus | null;
  loading: boolean;
  error: string | null;
  setMatchDetails: (details: MatchDetails | null) => void;
  setSquads: (squads: { [key: string]: Squad } | null) => void;
  setInnings: (innings: any | null) => void;
  setLiveStatus: (liveStatus: LiveStatus | null) => void;
  refreshMatchData: () => void;
  refreshLiveStatus: () => void;
  toss: TossData | null;
  setToss: (toss: TossData | null) => void;
  inningId: number | null;
  ballEvent: BallEvent | null;
  setBallEvent: (ballEvent: BallEvent | null) => void;
  battingOrder: BattingOrderData | null;
  setBattingOrder: (battingOrder: BattingOrderData | null) => void;
  refreshBattingOrder: () => void;
  handleBattingOrderCleanup: () => Promise<void>;
  cleanupLoading: boolean;
  canEdit: boolean;
  setCanEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context
const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Provider component
interface MatchProviderProps {
  children: ReactNode;
  matchId: string;
  baseURL?: string; // Make baseURL configurable
}

export function MatchProvider({
  children,
  matchId,
  baseURL = "https://cricket-score-board-v4g9.onrender.com",
}: MatchProviderProps) {
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [squads, setSquads] = useState<{ [key: string]: Squad } | null>(null);
  const [innings, setInnings] = useState<any | null>(null);
  const [inningId, setInningID] = useState<any | null>(null);
  const [toss, setToss] = useState<TossData | null>(null);
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ballEvent, setBallEvent] = useState<BallEvent | null>(null);
  const [battingOrder, setBattingOrder] = useState<BattingOrderData | null>(
    null
  );
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  // Fetch live status separately
  const fetchLiveStatus = async () => {
    try {
      if (!inningId) return;

      const liveResponse = await fetch(
        `${baseURL}/api/ballByBall/innings/${1}/live-status`
      );

      const liveData = await liveResponse.json();

      if (liveData.success) {
        setLiveStatus(liveData.data);
      }
    } catch (error) {
      console.error("Error fetching live status:", error);
      // Don't set error state for live status as it's supplementary data
    }
  };

  // Main match data fetch
  const fetchMatchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [matchResponse, squadResponse, inningsResponse, tossResponse] =
        await Promise.all([
          fetch(`${baseURL}/api/matches/${matchId}`),
          fetch(`${baseURL}/api/matches/${matchId}/squads`),
          fetch(`${baseURL}/api/innings/match/${matchId}`),
          fetch(`${baseURL}/api/matches/${matchId}/toss`),
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
        const currentInningId = inningsData.data[0]?.id || null;
        setInningID(currentInningId);
      }

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

  // fetch batting order
  const fetchBattingOrder = async () => {
    try {
      if (!inningId) return;

      const response = await fetch(
        `${baseURL}/api/ballByBall/innings/${1}/batting-order`
      );

      const data = await response.json();

      if (data.success) {
        setBattingOrder(data.data);
      }
    } catch (error) {
      console.error("Error fetching batting order:", error);
    }
  };

  //  cleanup batting order
  const handleBattingOrderCleanup = async () => {
    if (!battingOrder?.innings_id) {
      console.error("No innings ID available for cleanup");
      return;
    }

    setCleanupLoading(true);

    try {
      const response = await fetch(
        `${baseURL}/api/ballByBall/innings/${battingOrder.innings_id}/batting-order/cleanup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        await fetchBattingOrder(); // Refresh batting order
        console.log("Cleanup completed successfully");
      } else {
        throw new Error("Failed to cleanup batting positions");
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    } finally {
      setCleanupLoading(false);
    }
  };

  const refreshBattingOrder = () => {
    fetchBattingOrder();
  };

  // Refresh functions
  const refreshMatchData = () => {
    fetchMatchData();
  };

  const refreshLiveStatus = () => {
    fetchLiveStatus();
  };

  // Initial data fetch
  useEffect(() => {
    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

  // Fetch live status & batting order when inningId becomes available
  useEffect(() => {
    if (inningId) {
      fetchLiveStatus();
      fetchBattingOrder();
    }
  }, [inningId]);

  const contextValue: MatchContextType = {
    matchId,
    matchDetails,
    squads,
    innings,
    inningId,
    toss,
    liveStatus,
    setToss,
    setLiveStatus,
    loading,
    error,
    setMatchDetails,
    setSquads,
    setInnings,
    refreshMatchData,
    refreshLiveStatus,
    ballEvent,
    setBallEvent,
    battingOrder,
    setBattingOrder,
    refreshBattingOrder,
    handleBattingOrderCleanup,
    cleanupLoading,
    canEdit,
    setCanEdit
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
