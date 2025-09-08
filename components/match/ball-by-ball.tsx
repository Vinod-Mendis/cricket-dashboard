/** @format */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ball {
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
  shot_type: string | null;
  fielding_position: string | null;
  commentary: string;
  team_score: number;
  team_wickets: number;
  created_at: string;
  bowler_name: string;
  striker_name: string;
  non_striker_name: string;
  dismissed_player_name: string | null;
  fielder_name: string | null;
}

interface ApiResponse {
  success: boolean;
  data: {
    balls: Ball[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBalls: number;
      hasNext: boolean;
    };
  };
}

interface ballByBallProps {
  inningId: number;
}

export default function BallByBall({ inningId }: ballByBallProps) {
  const [ballData, setBallData] = useState<Ball[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBallData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/${1}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.data.balls) {
          setBallData(data.data.balls);
        } else {
          setError("No ball data found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchBallData();
  }, [inningId]);

  const formatBallDisplay = (ball: Ball) => {
    const displayOver = ball.over_number - 1; // Subtract 1 from over number
    if (!ball.legal_ball) {
      return `${displayOver}.${ball.ball_number}*`;
    }
    return `${displayOver}.${ball.ball_number}`;
  };

  if (loading) {
    return (
      <Card className="w-full flex-1 h-full overflow-y-auto col-span-1">
        <CardHeader>
          <CardTitle>Ball By Ball</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading ball data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full flex-1 h-full overflow-y-auto col-span-1">
        <CardHeader>
          <CardTitle>Ball By Ball</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full flex-1 h-full overflow-y-auto col-span-1">
      <CardHeader>
        <CardTitle>Ball By Ball</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-green-200 w-16 border-l border-r border-gray-400">
                  Over.Ball
                </TableHead>
                <TableHead className="bg-green-200 w-24 border-r border-gray-400">
                  Bowler
                </TableHead>
                <TableHead className="bg-green-200 w-24 border-r border-gray-400">
                  Striker
                </TableHead>
                <TableHead className="bg-green-200 w-16 text-center border-r border-gray-400">
                  Runs
                </TableHead>
                <TableHead className="bg-green-200 w-16 text-center border-r border-gray-400">
                  Extras
                </TableHead>
                <TableHead className="bg-green-200 w-20 border-r border-gray-400">
                  Ball Type
                </TableHead>
                <TableHead className="bg-green-200 w-16 text-center border-r border-gray-400">
                  Wicket
                </TableHead>
                <TableHead className="bg-green-200 w-20 border-r border-gray-400">
                  Wicket Type
                </TableHead>
                <TableHead className="bg-green-200 w-20 border-r border-gray-400">
                  Shot
                </TableHead>
                <TableHead className="bg-green-200 w-20 text-center border-r border-gray-400">
                  Score
                </TableHead>
                <TableHead className="bg-green-200 w-20 text-center border-r border-gray-400">
                  Wickets
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ballData
                .slice()
                .reverse()
                .map((ball) => (
                  <TableRow key={ball.id}>
                    <TableCell className="font-medium border-l border-r border-gray-200">
                      {formatBallDisplay(ball)}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      {ball.bowler_name}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      {ball.striker_name}
                    </TableCell>
                    <TableCell className="text-center border-r border-gray-200">
                      <span
                        className={
                          ball.runs_scored > 0
                            ? ball.runs_scored >= 6
                              ? "font-bold text-purple-600"
                              : ball.runs_scored === 4
                              ? "font-bold text-green-600"
                              : "font-semibold text-blue-600"
                            : ""
                        }>
                        {ball.runs_scored}
                      </span>
                    </TableCell>
                    <TableCell className="text-center border-r border-gray-200">
                      <span
                        className={
                          ball.extras > 0 ? "text-orange-600 font-semibold" : ""
                        }>
                        {ball.extras}
                      </span>
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          ball.ball_type === "LEGAL"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}>
                        {ball.ball_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-center border-r border-gray-200">
                      {ball.is_wicket ? (
                        <span className="text-red-600 font-bold">W</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      {ball.wicket_type ? (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          {ball.wicket_type}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      {ball.shot_type ? (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {ball.shot_type.replace("_", " ")}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-center border-r border-gray-200">
                      {ball.team_score}
                    </TableCell>
                    <TableCell className="font-semibold text-center border-r border-gray-200">
                      {ball.team_wickets}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
