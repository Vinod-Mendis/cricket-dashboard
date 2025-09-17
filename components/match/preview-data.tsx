/** @format */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMatch } from "@/context/match-context";

interface FormData {
  innings_id: number;
  over_number: number;
  ball_number: number;
  legal_ball: boolean;
  bowler_id: number | null;
  bowler_name: string;
  striker_id: number | null;
  striker_name: string;
  non_striker_id: number | null;
  non_striker_name: string;
  runs_scored: number;
  extras: number;
  ball_type: string;
  is_wicket: boolean;
  wicket_type: string;
  dismissed_player_id: number | null;
  fielder_id: number | null;
  shot_type: string | null;
  fielding_position: string | null;
  team_score: number;
  team_wickets: number;
}

interface LabelItem {
  key: keyof FormData;
  label: string;
}

export default function PreviewData() {
  const { ballEvent, liveStatus } = useMatch();

  // Helper function to get player name by ID
  const getPlayerNameById = (playerId: number | null): string => {
    if (!playerId || !liveStatus?.current_batsmen) return "N/A";

    const player = liveStatus.current_batsmen.find(
      (batsman) => batsman.player_id === playerId
    );
    return player ? player.player_name : "N/A";
  };

  // Create formData from ballEvent
  const formData: FormData = {
    innings_id: ballEvent?.innings_id || 0,
    over_number: ballEvent?.over_number || 0,
    ball_number: ballEvent?.ball_number || 0,
    legal_ball: ballEvent?.legal_ball || false,
    bowler_id: ballEvent?.bowler_id || null,
    bowler_name: ballEvent?.bowler_name || "N/A",
    striker_id: ballEvent?.striker_id || null,
    striker_name: getPlayerNameById(ballEvent?.striker_id || null),
    non_striker_id: ballEvent?.non_striker_id || null,
    non_striker_name: getPlayerNameById(ballEvent?.non_striker_id || null),
    runs_scored: ballEvent?.runs_scored || 0,
    extras: ballEvent?.extras || 0,
    ball_type: ballEvent?.ball_type || "LEGAL",
    is_wicket: ballEvent?.is_wicket || false,
    wicket_type: ballEvent?.wicket_type || "N/A",
    dismissed_player_id: ballEvent?.dismissed_player_id || null,
    fielder_id: ballEvent?.fielder_id || null,
    shot_type: ballEvent?.shot_type || null,
    fielding_position: ballEvent?.fielding_position || null,
    team_score: ballEvent?.team_score || 0,
    team_wickets: ballEvent?.team_wickets || 0,
  };

  const leftColumnLabels: LabelItem[] = [
    { key: "innings_id", label: "Innings ID" },
    { key: "over_number", label: "Over Number" },
    { key: "ball_number", label: "Ball Number" },
    { key: "legal_ball", label: "Legal Ball" },
    // { key: "bowler_id", label: "Bowler ID" },
    { key: "bowler_name", label: "Bowler Name" },
    // { key: "striker_id", label: "Striker ID" },
    { key: "striker_name", label: "Striker Name" },
    // { key: "non_striker_id", label: "Non Striker ID" },
    { key: "non_striker_name", label: "Non Striker Name" },
    { key: "runs_scored", label: "Runs Scored" },
  ];

  const rightColumnLabels: LabelItem[] = [
    { key: "extras", label: "Extras" },
    { key: "ball_type", label: "Ball Type" },
    { key: "is_wicket", label: "Is Wicket" },
    { key: "wicket_type", label: "Wicket Type" },
    { key: "dismissed_player_id", label: "Dismissed Player ID" },
    { key: "fielder_id", label: "Fielder ID" },
    // { key: "shot_type", label: "Shot Type" },
    // { key: "fielding_position", label: "Fielding Position" },
    { key: "team_score", label: "Team Score" },
    { key: "team_wickets", label: "Team Wickets" },
  ];

  // Show loading state if ballEvent is not available
  if (!ballEvent) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Preview Form-Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            No ball event data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Preview Form-Data</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-5 text-sm">
            {/* Left column */}
            <div className="flex flex-col gap-1 border-r-2 border-r-black/20 pr-5">
              {leftColumnLabels.map((item) => (
                <div key={item.key} className="flex justify-between">
                  <p>{item.label} : </p>
                  <p className="font-medium">{String(formData[item.key])}</p>
                </div>
              ))}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-1">
              {rightColumnLabels.map((item) => (
                <div key={item.key} className="flex justify-between">
                  <p>{item.label} : </p>
                  <p className="font-medium">{String(formData[item.key])}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
