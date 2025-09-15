/** @format */
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CreateInningsDialog from "../modals/create-innings";
import { useMatch } from "@/context/match-context";
import { Badge } from "../ui/badge";
import { ArrowRight } from "lucide-react";

interface Teams {
  batting_team: string;
  bowling_team: string;
}

interface Inning {
  id: number;
  number: number;
  status: string;
}

interface Summary {
  current_score: string;
  last_wicket: string;
  last_5_overs: string;
  dls: string;
  run_rate: string;
  drs: string;
  over_rate: string;
  cut_off: string;
  overs_rem: string;
}

interface ScoreSummaryResponse {
  success: boolean;
  data: {
    teams: Teams;
    innings: Inning;
    summary: Summary;
  };
}

export default function ScoreSummary() {
  const { toss, } = useMatch();
  const [scoreSummary, setScoreSummary] = useState<
    ScoreSummaryResponse["data"] | null
  >(null);

  const [loading, setLoading] = useState(false);

  // Fetch score summary
  const fetchScoreSummary = async (inningsId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/${inningsId}/score-summary`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setScoreSummary(result.data);
      }
    } catch (error) {
      console.error("Error fetching score summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   // Fetch score summary when component mounts or innings changes
  //   if (innings && innings.length > 0) {
  //     const currentInnings = innings[innings.length - 1];
  //     if (currentInnings?.innings_id) {
  //       fetchScoreSummary(currentInnings.innings_id);
  //     }
  //   } else {
  //     // Fallback to innings ID 1
  //     fetchScoreSummary(1);
  //   }
  // }, [innings]);

  useEffect(() => {
    // Fetch score summary when component mounts or innings changes

    fetchScoreSummary(1);
  }, []);

  // Create data objects from scoreSummary
  const rightSideData = {
    lastWicket: {
      value: scoreSummary?.summary?.last_wicket || "N/A",
      label: "Last Wicket",
    },
    last5Overs: {
      value: scoreSummary?.summary?.last_5_overs || "N/A",
      label: "Last 5 Overs",
    },
    dls: {
      value: scoreSummary?.summary?.dls || "N/A",
      label: "DLS",
    },
    runRate: {
      value: scoreSummary?.summary?.run_rate || "N/A",
      label: "Run Rate",
    },
  };

  const leftSideData = {
    drs: {
      value: scoreSummary?.summary?.drs || "N/A",
      label: "DRS",
    },
    overRate: {
      value: scoreSummary?.summary?.over_rate || "N/A",
      label: "Over Rate",
    },
    cutOff: {
      value: scoreSummary?.summary?.cut_off || "N/A",
      label: "Cut-Off",
    },
    oversRem: {
      value: scoreSummary?.summary?.overs_rem || "N/A",
      label: "Overs Rem",
    },
  };

  // Parse current score for display
  const parseCurrentScore = (scoreString: string) => {
    if (!scoreString || scoreString === "N/A") {
      return { runs: 0, wickets: 0, overs: "0.0" };
    }

    const match = scoreString.match(/(\d+)\/(\d+)\s*\(([^)]+)\)/);
    if (match) {
      return {
        runs: parseInt(match[1]),
        wickets: parseInt(match[2]),
        overs: match[3],
      };
    }

    return { runs: 0, wickets: 0, overs: "0.0" };
  };

  const currentScore = parseCurrentScore(
    scoreSummary?.summary?.current_score || ""
  );

  // console.log("Score Summary:", scoreSummary);

  return (
    <>
      <Card className="col-span-4">
        <CardHeader className="flex justify-between items-center border-b">
          <CardTitle>Score Summary</CardTitle>

          <div className="flex gap-2 items-center">
            {/* Create Innings Button */}
            <div className="border border-gray-200 p-2 px-5 rounded-md flex gap-4 items-center text-gray-400">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              {`${scoreSummary?.innings.number} - Inning`}
            </div>
            <CreateInningsDialog />
          </div>
        </CardHeader>
        <CardContent className="flex justify-between">
          {/* left side */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <h1 className="text-2xl">
                {scoreSummary?.teams.batting_team || "Batting Team"} :{" "}
                <span>
                  {loading
                    ? "Loading..."
                    : `${currentScore.runs}/${currentScore.wickets} (${currentScore.overs})`}
                </span>
              </h1>
              <h1 className="text-xl">
                {scoreSummary?.teams.bowling_team || "Bowling Team"} :{" "}
                <span>
                  {0}/{0} ({"0.0"})
                </span>
              </h1>
            </div>

            {/* Toss Information */}
            {toss && toss.winner_team_name && (
              <div className="flex gap-2 items-center">
                <p className="font-semibold">TOSS : </p>
                <Badge className="bg-yellow-600">{toss.winner_team_name}</Badge>
                <ArrowRight size={16} className="text-gray-400" />
                <Badge>{toss.decision}</Badge>
              </div>
            )}
          </div>

          {/* right side */}
          <div className="w-full max-w-4xl grid grid-cols-2">
            {/* Col 1 */}
            <div className="flex flex-col justify-between border-r-black/20 border-r-2 pr-12">
              {Object.entries(rightSideData).map(([key, data]) => (
                <div className="flex justify-between" key={key}>
                  <p className="font-semibold">{data.label}</p>
                  <p>{loading ? "Loading..." : data.value}</p>
                </div>
              ))}
            </div>

            {/* Col 2 */}
            <div className="flex flex-col justify-between pl-12">
              {Object.entries(leftSideData).map(([key, data]) => (
                <div className="flex justify-between" key={key}>
                  <p className="font-semibold">{data.label}</p>
                  <p>{loading ? "Loading..." : data.value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
