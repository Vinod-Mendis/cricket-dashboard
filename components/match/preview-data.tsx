/** @format */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface FormData {
  over_number: number;
  ball_number: number;
  legal_ball: boolean;
  bowler_name: string;
  striker_name: string;
  non_striker_name: string;
  runs_scored: number;
  extras: number;
  ball_type: string;
  is_wicket: boolean;
  wicket_type: string;
  dismissed_player_id: number;
  fielder_id: number | null;
}

interface LabelItem {
  key: keyof FormData;
  label: string;
}

export default function PreviewData() {
  const formData: FormData = {
    over_number: 0,
    ball_number: 1,
    legal_ball: true,
    bowler_name: "Charles Lambert",
    striker_name: "Player A",
    non_striker_name: "Player B",
    runs_scored: 0,
    extras: 0,
    ball_type: "NORMAL",
    is_wicket: true,
    wicket_type: "LBW",
    dismissed_player_id: 3,
    fielder_id: null,
  };

  const leftColumnLabels: LabelItem[] = [
    { key: "over_number", label: "Over Number" },
    { key: "ball_number", label: "Ball Number" },
    { key: "legal_ball", label: "Legal Ball" },
    { key: "bowler_name", label: "Bowler Name" },
    { key: "striker_name", label: "Striker Name" },
    { key: "non_striker_name", label: "Non Striker Name" },
    { key: "runs_scored", label: "Runs Scored" },
  ];

  const rightColumnLabels: LabelItem[] = [
    { key: "extras", label: "Extras" },
    { key: "ball_type", label: "Ball Type" },
    { key: "is_wicket", label: "Is Wicket" },
    { key: "wicket_type", label: "Wicket Type" },
    { key: "dismissed_player_id", label: "Dismissed Player Id" },
    { key: "fielder_id", label: "Fielder Id" },
  ];

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
