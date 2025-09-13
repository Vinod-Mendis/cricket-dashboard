/** @format */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { User, Save, X } from "lucide-react";

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

interface EditSinglePositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  battingOrder: BattingPlayer[];
  onUpdate: () => void;
  inningsId: string | number;
}

export default function EditSinglePositionDialog({
  isOpen,
  onClose,
  battingOrder,
  onUpdate,
  inningsId,
}: EditSinglePositionDialogProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [newPosition, setNewPosition] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Filter only NOT OUT players who are not currently batting
  const availablePlayers = battingOrder.filter(
    (player) => player.status === "NOT_OUT" && !player.currently_batting
  );

  const sortedPlayers = [...battingOrder]
    .filter((player) => player.status === "NOT_OUT")
    .sort((a, b) => a.batting_position - b.batting_position);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPlayerId("");
      setNewPosition("");
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!selectedPlayerId || !newPosition) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        batting_order: [
          {
            player_id: parseInt(selectedPlayerId),
            new_batting_position: parseInt(newPosition),
          },
        ],
      };

      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/${inningsId}/batting-order/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        onUpdate();
        onClose();
      } else {
        throw new Error("Failed to update batting position");
      }
    } catch (error) {
      console.error("Error updating batting position:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlayer = battingOrder.find(
    (p) => p.player_id.toString() === selectedPlayerId
  );

  const isValidPosition =
    newPosition && parseInt(newPosition) >= 1 && parseInt(newPosition) <= 11;

  const canSave = selectedPlayerId && newPosition && isValidPosition;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Single Position
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 max-h-96 overflow-hidden">
          {/* Left Column - Current Players */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 border-b pb-2">
              Current Batting Order
            </h3>
            <div className="space-y-2 overflow-y-auto max-h-80">
              {sortedPlayers.map((player) => (
                <div
                  key={player.player_id}
                  className={`flex items-center gap-3 p-2 rounded border ${
                    player.currently_batting
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50"
                  }`}>
                  <span className="text-sm font-medium text-gray-600 w-6">
                    {player.batting_position}.
                  </span>
                  <User className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {player.player_name}
                      </span>
                      {player.currently_batting && (
                        <Badge variant="secondary" className="text-xs">
                          Batting
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {player.player_role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Edit Controls */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">
              Move Player
            </h3>

            <div className="space-y-4">
              {/* Player Selection */}
              <div className="space-y-2">
                <Label htmlFor="player-select">Select Player</Label>
                <Select
                  value={selectedPlayerId}
                  onValueChange={setSelectedPlayerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a player to move..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlayers.map((player) => (
                      <SelectItem
                        key={player.player_id}
                        value={player.player_id.toString()}>
                        {player.batting_position}. {player.player_name} (
                        {player.player_role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position Input */}
              <div className="space-y-2">
                <Label htmlFor="position-input">New Position</Label>
                <Input
                  id="position-input"
                  type="number"
                  min="1"
                  max="11"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  placeholder="Enter position (1-11)"
                />
              </div>

              {/* Selected Player Preview */}
              {selectedPlayer && (
                <Card className="p-3 bg-blue-50 border-blue-200">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      Moving: {selectedPlayer.player_name}
                    </div>
                    <div className="text-gray-600">
                      From position {selectedPlayer.batting_position}
                      {newPosition &&
                        isValidPosition &&
                        ` to position ${newPosition}`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedPlayer.player_role}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave || loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Moving..." : "Move Player"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
