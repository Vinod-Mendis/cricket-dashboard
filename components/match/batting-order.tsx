/** @format */

"use client";

/** @format */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Edit, User, Users, Target } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useMatch } from "@/context/match-context";
import EditBattingOrderDialog from "../modals/edit-batting-order";

// Type definitions
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

interface BattingOrderResponse {
  success: boolean;
  data: {
    innings_id: string;
    batting_order: BattingPlayer[];
    total_batsmen: number;
    currently_batting: BattingPlayer[];
    next_batsmen: BattingPlayer[];
  };
}

export default function BattingOrder() {
  const { inningId } = useMatch();
  const [battingData, setBattingData] = useState<
    BattingOrderResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchBattingOrder = async () => {
    if (!inningId) {
      setError("No innings ID available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/${1}/batting-order`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BattingOrderResponse = await response.json();

      if (data.success) {
        setBattingData(data.data);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch batting order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattingOrder();
  }, [inningId]);

  const renderPlayerCard = (
    player: BattingPlayer,
    isCurrentlyBatting = false
  ) => (
    <div
      key={player.id}
      className={`flex items-center justify-between p-3 rounded-lg border ${
        isCurrentlyBatting
          ? "bg-blue-50 border-blue-200 shadow-sm"
          : "bg-gray-50 hover:bg-gray-100"
      }`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            {player.batting_position}
          </span>
          <User className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {player.player_name}
            </span>
            {isCurrentlyBatting && (
              <Badge
                variant={player.is_striker ? "default" : "secondary"}
                className="text-xs">
                {player.is_striker ? "Striker" : "Non-striker"}
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-500">{player.player_role}</span>
        </div>
      </div>

      {isCurrentlyBatting && (
        <div className="text-right">
          <div className="text-sm font-medium">
            {player.runs_scored} ({player.balls_faced})
          </div>
          <div className="text-xs text-gray-500">SR: {player.strike_rate}</div>
        </div>
      )}

      {player.status !== "NOT_OUT" && (
        <Badge variant="destructive" className="text-xs">
          {player.status}
        </Badge>
      )}
    </div>
  );

  const handleOrderUpdated = () => {
    fetchBattingOrder();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Batting Order</CardTitle>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading batting order...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Batting Order</CardTitle>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battingData) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Batting Order</CardTitle>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">No batting data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Batting Order</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDialogOpen(true)}
            disabled={!battingData}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Currently Batting Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Currently Batting
              </h3>
              <Badge variant="outline" className="ml-auto">
                {battingData.currently_batting.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {battingData.currently_batting.length > 0 ? (
                battingData.currently_batting.map((player) =>
                  renderPlayerCard(player, true)
                )
              ) : (
                <div className="text-sm text-gray-500 py-4 text-center">
                  No batsmen currently at the crease
                </div>
              )}
            </div>
          </div>

          {/* Next Batsmen Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Next Batsmen
              </h3>
              <Badge variant="outline" className="ml-auto">
                {battingData.next_batsmen.length}
              </Badge>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {battingData.next_batsmen.length > 0 ? (
                battingData.next_batsmen.map((player) =>
                  renderPlayerCard(player, false)
                )
              ) : (
                <div className="text-sm text-gray-500 py-4 text-center">
                  No more batsmen to come
                </div>
              )}
            </div>
          </div>

          {/* Total Batsmen */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Total Batsmen
              </span>
              <Badge variant="secondary" className="font-semibold">
                {battingData.total_batsmen}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {battingData && (
        <EditBattingOrderDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          battingOrder={battingData.batting_order}
          currentlyBatting={battingData.currently_batting}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </>
  );
}
