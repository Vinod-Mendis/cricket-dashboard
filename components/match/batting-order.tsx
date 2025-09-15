/** @format */

"use client";

/** @format */

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

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Edit,
  User,
  Users,
  Target,
  ArrowRightLeft,
  Replace,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useMatch } from "@/context/match-context";
import EditBattingOrderDialog from "../modals/edit-batting-order";
import EditSinglePositionDialog from "../modals/edit-single-batting-position";
import SwapPlayersDialog from "../modals/swap-player-batting-order";

export default function BattingOrder() {
  const {
    loading,
    battingOrder,
    refreshBattingOrder,
    handleBattingOrderCleanup,
    cleanupLoading,
  } = useMatch();

  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [singleEditDialogOpen, setSingleEditDialogOpen] = useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);

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
    refreshBattingOrder();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Batting Order</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              Move Player
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Edit className="h-4 w-4 mr-1" />
              Edit All
            </Button>
          </div>
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              Move Player
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Edit className="h-4 w-4 mr-1" />
              Edit All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battingOrder) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Batting Order</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              Move Player
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Edit className="h-4 w-4 mr-1" />
              Edit All
            </Button>
          </div>
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBattingOrderCleanup}
              disabled={!battingOrder || cleanupLoading}>
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              {cleanupLoading ? "Cleaning..." : "Cleanup"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSwapDialogOpen(true)}
              disabled={!battingOrder}>
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              Swap Players
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSingleEditDialogOpen(true)}
              disabled={!battingOrder}>
              <Replace className="h-4 w-4 mr-1" />
              Move Player
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
              disabled={!battingOrder}>
              <Edit className="h-4 w-4 mr-1" />
              Edit All
            </Button>
          </div>
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
                {battingOrder.currently_batting.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {battingOrder.currently_batting.length > 0 ? (
                battingOrder.currently_batting.map((player) =>
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
                {battingOrder.next_batsmen.length}
              </Badge>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {battingOrder.next_batsmen.length > 0 ? (
                battingOrder.next_batsmen.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100">
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
                          {index === 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Next Batsman
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {player.player_role}
                        </span>
                      </div>
                    </div>

                    {player.status !== "NOT_OUT" && (
                      <Badge variant="destructive" className="text-xs">
                        {player.status}
                      </Badge>
                    )}
                  </div>
                ))
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
                {battingOrder.total_batsmen}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swap Players Dialog */}
      {battingOrder && (
        <SwapPlayersDialog
          isOpen={swapDialogOpen}
          onClose={() => setSwapDialogOpen(false)}
          nextBatsmen={battingOrder.next_batsmen}
          onUpdate={handleOrderUpdated}
          inningsId={battingOrder.innings_id}
        />
      )}

      {/* Edit All Dialog */}
      {battingOrder && (
        <EditBattingOrderDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          battingOrder={battingOrder.batting_order}
          currentlyBatting={battingOrder.currently_batting}
          onOrderUpdated={handleOrderUpdated}
        />
      )}

      {/* Edit Single Position Dialog */}
      {battingOrder && (
        <EditSinglePositionDialog
          isOpen={singleEditDialogOpen}
          onClose={() => setSingleEditDialogOpen(false)}
          battingOrder={battingOrder.batting_order}
          onUpdate={handleOrderUpdated}
          inningsId={battingOrder.innings_id}
        />
      )}
    </>
  );
}
