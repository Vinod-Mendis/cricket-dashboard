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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowRightLeft, X } from "lucide-react";

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

interface SwapPlayersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nextBatsmen: BattingPlayer[];
  onUpdate: () => void;
  inningsId: string | number;
}

export default function SwapPlayersDialog({
  isOpen,
  onClose,
  nextBatsmen,
  onUpdate,
  inningsId,
}: SwapPlayersDialogProps) {
  const [player1Id, setPlayer1Id] = useState<string>("");
  const [player2Id, setPlayer2Id] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hasSetDefaults, setHasSetDefaults] = useState(false);

  // Filter only players who can be swapped (NOT OUT and not currently batting)
  const availablePlayers = nextBatsmen.filter(
    (player) => player.status === "NOT_OUT" && !player.currently_batting
  );

  useEffect(() => {
    if (isOpen) {
      // Only set defaults once when dialog opens
      if (!hasSetDefaults && availablePlayers.length >= 2) {
        setPlayer1Id(availablePlayers[0].player_id.toString());
        setPlayer2Id(availablePlayers[1].player_id.toString());
        setHasSetDefaults(true);
      }
    } else {
      // Reset everything when dialog closes
      setPlayer1Id("");
      setPlayer2Id("");
      setHasSetDefaults(false);
    }
  }, [isOpen, hasSetDefaults]); // Removed availablePlayers dependency

  // Handle player selection changes
  const handlePlayer1Change = (value: string) => {
    setPlayer1Id(value);
    // If player2 is the same as the new player1, clear player2
    if (player2Id === value) {
      const availableForPlayer2 = availablePlayers.filter(
        (p) => p.player_id.toString() !== value
      );
      if (availableForPlayer2.length > 0) {
        setPlayer2Id(availableForPlayer2[0].player_id.toString());
      } else {
        setPlayer2Id("");
      }
    }
  };

  const handlePlayer2Change = (value: string) => {
    setPlayer2Id(value);
    // If player1 is the same as the new player2, clear player1
    if (player1Id === value) {
      const availableForPlayer1 = availablePlayers.filter(
        (p) => p.player_id.toString() !== value
      );
      if (availableForPlayer1.length > 0) {
        setPlayer1Id(availableForPlayer1[0].player_id.toString());
      } else {
        setPlayer1Id("");
      }
    }
  };

  const handleSwap = async () => {
    if (!player1Id || !player2Id || player1Id === player2Id) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        player1_id: parseInt(player1Id),
        player2_id: parseInt(player2Id),
      };

      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/${inningsId}/batting-order/swap`,
        {
          method: "POST",
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
        throw new Error("Failed to swap players");
      }
    } catch (error) {
      console.error("Error swapping players:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedPlayer = (playerId: string) => {
    return availablePlayers.find((p) => p.player_id.toString() === playerId);
  };

  const player1 = getSelectedPlayer(player1Id);
  const player2 = getSelectedPlayer(player2Id);

  const canSwap = player1Id && player2Id && player1Id !== player2Id;

  const getPlayerOptions = (excludeId?: string) => {
    return availablePlayers.filter((p) => p.player_id.toString() !== excludeId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Swap Players
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {availablePlayers.length < 2 ? (
            <div className="text-center py-8 text-gray-500">
              At least 2 players are needed to perform a swap
            </div>
          ) : (
            <>
              {/* Player Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="player1-select">First Player</Label>
                  <Select value={player1Id} onValueChange={handlePlayer1Change}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select first player" />
                    </SelectTrigger>
                    <SelectContent>
                      {getPlayerOptions(player2Id).map((player) => (
                        <SelectItem
                          key={player.player_id}
                          value={player.player_id.toString()}>
                          {player.batting_position}. {player.player_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="player2-select">Second Player</Label>
                  <Select value={player2Id} onValueChange={handlePlayer2Change}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select second player" />
                    </SelectTrigger>
                    <SelectContent>
                      {getPlayerOptions(player1Id).map((player) => (
                        <SelectItem
                          key={player.player_id}
                          value={player.player_id.toString()}>
                          {player.batting_position}. {player.player_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Preview */}
              {player1 && player2 && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Swap Preview
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {player1.player_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Position {player1.batting_position}
                        </div>
                        <div className="text-xs text-gray-500">
                          {player1.player_role}
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <ArrowRightLeft className="h-5 w-5 text-blue-600 mb-1" />
                        <span className="text-xs text-blue-600">Swap</span>
                      </div>

                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {player2.player_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Position {player2.batting_position}
                        </div>
                        <div className="text-xs text-gray-500">
                          {player2.player_role}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-600">
                      After swap: {player1.player_name} → Position{" "}
                      {player2.batting_position}, {player2.player_name} →
                      Position {player1.batting_position}
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSwap}
            disabled={!canSwap || loading || availablePlayers.length < 2}>
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            {loading ? "Swapping..." : "Swap Players"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
