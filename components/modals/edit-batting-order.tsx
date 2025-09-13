/** @format */

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { User } from "lucide-react";

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

interface EditBattingOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  battingOrder: BattingPlayer[];
  currentlyBatting: BattingPlayer[];
  onOrderUpdated: () => void;
}

export default function EditBattingOrderDialog({
  open,
  onOpenChange,
  battingOrder,
  currentlyBatting,
  onOrderUpdated,
}: EditBattingOrderDialogProps) {
  const [editableOrder, setEditableOrder] = useState<BattingPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [duplicatePositions, setDuplicatePositions] = useState<number[]>([]);

  // Add this after the existing useEffect
  React.useEffect(() => {
    const positionCounts: { [key: number]: number } = {};

    editableOrder.forEach((player) => {
      positionCounts[player.batting_position] =
        (positionCounts[player.batting_position] || 0) + 1;
    });

    const duplicates = Object.keys(positionCounts)
      .filter((position) => positionCounts[Number(position)] > 1)
      .map(Number);

    setDuplicatePositions(duplicates);
  }, [editableOrder]);

  const hasDuplicatePosition = (playerId: number) => {
    const player = editableOrder.find((p) => p.player_id === playerId);
    return player
      ? duplicatePositions.includes(player.batting_position)
      : false;
  };

  // Initialize editable order when dialog opens
  React.useEffect(() => {
    if (open) {
      const notOutNonBattingPlayers = battingOrder.filter(
        (player) => !player.currently_batting && player.status === "NOT_OUT"
      );
      setEditableOrder([...notOutNonBattingPlayers]);
    }
  }, [open, battingOrder]);

  const isPositionOccupied = (targetPosition: number) => {
    return currentlyBatting.some(
      (player) => player.batting_position === targetPosition
    );
  };

  const handlePositionChange = (playerId: number, newPosition: string) => {
    const position = Number.parseInt(newPosition);
    if (isNaN(position) || position < 1) return;

    // Check if position is occupied by currently batting players
    if (isPositionOccupied(position)) {
      alert(`Position ${position} is occupied by a currently batting player`);
      return;
    }

    setEditableOrder((prev) =>
      prev.map((player) =>
        player.player_id === playerId
          ? { ...player, batting_position: position }
          : player
      )
    );
  };

  const handleSave = async () => {
    // const positions = editableOrder
    //   .map((p) => p.batting_position)
    //   .sort((a, b) => a - b);
    // const occupiedPositions = currentlyBatting
    //   .map((p) => p.batting_position)
    //   .sort((a, b) => a - b);

    setLoading(true);
    try {
      const completeBattingOrder = [
        // Include currently batting players with their current positions
        ...currentlyBatting.map((player) => ({
          player_id: player.player_id,
          batting_position: player.batting_position,
        })),
        // Include the reordered NOT OUT non-batting players
        ...editableOrder.map((player) => ({
          player_id: player.player_id,
          batting_position: player.batting_position,
        })),
        // Include OUT players with their current positions (not shown in UI but needed for API)
        ...battingOrder
          .filter(
            (player) => !player.currently_batting && player.status !== "NOT_OUT"
          )
          .map((player) => ({
            player_id: player.player_id,
            batting_position: player.batting_position,
          })),
      ];

      completeBattingOrder.sort(
        (a, b) => a.batting_position - b.batting_position
      );

      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/${1}/batting-order/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complete_batting_order: completeBattingOrder,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        onOrderUpdated();
        onOpenChange(false);
      } else {
        throw new Error(data.error || "Failed to update batting order");
      }
    } catch (error) {
      console.error("Error updating batting order:", error);
      alert(
        `Error: ${
          error instanceof Error
            ? error.message
            : "Failed to update batting order"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-fit">
        <DialogHeader>
          <DialogTitle>Edit Batting Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Currently Batting (Non-editable) */}
          {currentlyBatting.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Currently Batting (Cannot be reordered)
              </h4>
              <div className="space-y-2">
                {currentlyBatting.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="text-sm font-medium text-gray-600 w-6">
                      {player.batting_position}
                    </span>
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {player.player_name}
                        </span>
                        <Badge
                          variant={player.is_striker ? "default" : "secondary"}
                          className="text-xs">
                          {player.is_striker ? "Striker" : "Non-striker"}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        {player.player_role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add this before the NOT OUT Players section */}
          {duplicatePositions.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-red-800 text-sm font-medium">
                Duplicate positions found: {duplicatePositions.join(", ")}
              </div>
              <div className="text-red-600 text-xs mt-1">
                Please assign unique positions to all players before saving.
              </div>
            </div>
          )}

          {/* NOT OUT Players (Enter position) */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              NOT OUT Players (Enter position)
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {editableOrder.map((player) => {
                const isDuplicate = hasDuplicatePosition(player.player_id);
                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      isDuplicate
                        ? "bg-red-50 border-red-300"
                        : "bg-gray-50 border-gray-200"
                    }`}>
                    <Input
                      type="number"
                      min="1"
                      max="11"
                      value={player.batting_position}
                      onChange={(e) =>
                        handlePositionChange(player.player_id, e.target.value)
                      }
                      className={`w-16 h-8 text-center ${
                        isDuplicate ? "border-red-300 focus:border-red-500" : ""
                      }`}
                    />
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {player.player_name}
                        </span>
                        {isDuplicate && (
                          <Badge variant="destructive" className="text-xs">
                            Duplicate Position
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {player.player_role}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}>
            Cancel
          </Button>
          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={loading || duplicatePositions.length > 0}>
              {loading
                ? "Saving..."
                : duplicatePositions.length > 0
                ? "Fix Duplicates to Save"
                : "Save Order"}
            </Button>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
