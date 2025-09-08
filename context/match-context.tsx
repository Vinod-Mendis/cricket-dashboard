/** @format */
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context value type
interface MatchContextType {
  isMatchActive: string;
  setIsMatchActive: (value: string) => void;
  inningID: number;
  setInningID: (value: number) => void;
}

// Create the Match Context
const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Custom hook to use the Match Context
export const useMatch = (): MatchContextType => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
};

// Define props type for MatchProvider
interface MatchProviderProps {
  children: ReactNode;
}

// Match Provider Component
export const MatchProvider: React.FC<MatchProviderProps> = ({ children }) => {
  // Test boolean state
  const [isMatchActive, setIsMatchActive] = useState<string>("123");
  const [inningID, setInningID] = useState<number>(0);
  const [data, setData] = useState({
    innings_id: inningID,
    over_number: 12,
    ball_number: 4,
    legal_ball: true,
    bowler_id: 101,
    striker_id: 202,
    non_striker_id: 203,
    runs_scored: 2,
    extras: 0,
    ball_type: "LEGAL",
    is_wicket: true,
    team_score: 98,
    team_wickets: 4,
    wicket_type: "CAUGHT",
    dismissed_player_id: 202,
    fielder_id: 305,
    next_batsman_id: 210,
    shot_type: "Pull Shot",
    fielding_position: "Deep Square Leg",
    commentary:
      "Batsman goes for a big pull but finds the fielder in the deep. Another wicket down!",
  });

  // Match context value
  const value: MatchContextType = {
    isMatchActive,
    setIsMatchActive,
    inningID,
    setInningID,
    // Toggle function for convenience
  };

  return (
    <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
  );
};

export default MatchContext;
