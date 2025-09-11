/** @format */

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import EditPlayerDialog from "./SqaudEditPlayerDialog";

// Player type
interface Player {
  player_id: number;
  player_name: string;
  player_role: string; // Could be a union type like "Batsman" | "Bowler" | "All-rounder"
  is_playing: boolean;
  is_captain: boolean;
  is_wicketkeeper: boolean;
}

// Team type
interface Team {
  team_id: number;
  team_name: string;
  team_color: string;
  playing_xi: Player[];
  bench: Player[];
  total_players: number;
  captain: Player;
  wicketkeeper: Player;
  playing_xi_count: number;
  bench_count: number;
}

// Props type for PlayerRow
interface PlayerRowProps {
  player: Player;
  isLastPlayer: boolean;
  reverse?: boolean;
  isBench?: boolean;
  teamId: number;
  team: Team;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Players({ squads, matchId, onRefresh }: any) {
  // State to track loading states for API calls
  const [loadingPlayers, setLoadingPlayers] = useState<{
    [key: string]: boolean;
  }>({});
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedBenchPlayerId, setSelectedBenchPlayerId] = useState<
    string | null
  >(null);
  // Remove editFormData state, keep only these:
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Extract teams from squads data
  const team1 = squads?.team_2 || null;
  const team2 = squads?.team_3 || null;

  // Function to replace players
  const replacePlayers = async () => {
    if (!selectedPlayer || !selectedBenchPlayerId || !selectedTeam) return;

    const key = `replace-${selectedPlayer.player_id}-${selectedBenchPlayerId}`;
    setLoadingPlayers((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/matches/${matchId}/squad`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            team_id: selectedTeam.team_id,
            players: [
              {
                player_id: selectedPlayer.player_id,
                is_playing: false,
              },
              {
                player_id: parseInt(selectedBenchPlayerId),
                is_playing: true,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to replace players");
      }

      console.log(`Players replaced successfully`);
      setReplaceDialogOpen(false);
      setSelectedPlayer(null);
      setSelectedTeam(null);
      setSelectedBenchPlayerId(null);

      // Auto refresh the data
      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error replacing players:", error);
      alert("Failed to replace players. Please try again.");
    } finally {
      setLoadingPlayers((prev) => ({ ...prev, [key]: false }));
    }
  };

  const ReplaceDialog = () => {
    if (!selectedPlayer || !selectedTeam) return null;

    const benchPlayers = selectedTeam.bench || [];
    const isLoading = Object.keys(loadingPlayers).some(
      (k: string) => k.startsWith("replace-") && loadingPlayers[k]
    );
    const selectedBenchPlayer = benchPlayers.find(
      (p: Player) => p.player_id.toString() === selectedBenchPlayerId
    );

    return (
      <Dialog
        open={replaceDialogOpen}
        onOpenChange={(open) => {
          setReplaceDialogOpen(open);
          if (!open) {
            setSelectedBenchPlayerId(null);
          }
        }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Replace Player</DialogTitle>
            <DialogDescription>
              Select a bench player to replace{" "}
              <strong>{selectedPlayer.player_name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {benchPlayers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No bench players available
              </p>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Bench Player:
                </label>
                <Select
                  value={selectedBenchPlayerId || ""}
                  onValueChange={setSelectedBenchPlayerId}>
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Choose a bench player..." />
                  </SelectTrigger>
                  <SelectContent>
                    {benchPlayers.map((benchPlayer: any) => (
                      <SelectItem
                        key={benchPlayer.player_id}
                        value={benchPlayer.player_id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="font-medium">
                              {benchPlayer.player_name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({benchPlayer.player_role})
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {benchPlayer.is_captain && (
                              <span className="text-xs bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded">
                                C
                              </span>
                            )}
                            {benchPlayer.is_wicketkeeper && (
                              <span className="text-xs bg-green-200 text-green-800 px-1 py-0.5 rounded">
                                WK
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedBenchPlayer && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">
                  Replacement Summary:
                </h4>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Out:</strong> {selectedPlayer.player_name} (
                    {selectedPlayer.player_role})
                  </div>
                  <div>
                    <strong>In:</strong> {selectedBenchPlayer.player_name} (
                    {selectedBenchPlayer.player_role})
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setReplaceDialogOpen(false)}
              disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={replacePlayers}
              disabled={!selectedBenchPlayerId || isLoading}>
              {isLoading ? "Replacing..." : "Replace Player"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const PlayerRow: React.FC<PlayerRowProps> = ({
    player,
    isLastPlayer,
    reverse = false,
    isBench = false,
    teamId,
    team,
  }) => {
    const playerKey = `${teamId}-${player.player_id}`;
    const isLoading = loadingPlayers[playerKey];

    // console.log("Player:", player);
    // console.log("Is Last Player:", isLastPlayer);
    // console.log("Team ID:", teamId);
    // console.log("Team:", team);

    const handleReplace = () => {
      setSelectedPlayer(player);
      setSelectedTeam(team);
      setReplaceDialogOpen(true);
    };

    return (
      <div
        className={`flex items-center py-2 ${
          !isLastPlayer ? "border-b border-gray-200" : ""
        } ${reverse ? "flex-row-reverse" : ""} ${isBench ? "opacity-60" : ""}`}>
        {/* Replace Button - Only for playing players */}
        {!isBench && (
          <>
            <div className={`${reverse ? "ml-2" : "mr-2"}`}>
              <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={handleReplace}
                className={`h-6 px-2 text-xs ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                Replace
              </Button>
            </div>
            {/* Edit Button - For all players */}
            <div className={`${reverse ? "ml-2" : "mr-2"}`}>
              <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => {
                  setEditingPlayer(player);
                  setEditDialogOpen(true);
                }}
                className={`h-6 px-2 text-xs ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                Edit
              </Button>
            </div>
          </>
        )}

        {/* Player name with role and indicators */}
        <div
          className={`flex-1 ${
            isBench ? "bg-gray-50" : "bg-gray-100"
          } border border-gray-300 rounded px-3 py-2 ${
            reverse && !isBench
              ? "mr-2"
              : reverse && isBench
              ? ""
              : !reverse && !isBench
              ? "ml-2"
              : ""
          }`}>
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-medium ${
                isBench ? "text-gray-600" : "text-gray-800"
              }`}>
              {player.player_name}
            </span>
            <div className="flex items-center space-x-1">
              {player.is_captain && (
                <span className="text-xs bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded">
                  C
                </span>
              )}
              {player.is_wicketkeeper && (
                <span className="text-xs bg-green-200 text-green-800 px-1 py-0.5 rounded">
                  WK
                </span>
              )}
              {isBench && (
                <span className="text-xs bg-red-200 text-red-800 px-1 py-0.5 rounded">
                  BENCH
                </span>
              )}
            </div>
          </div>
          <span
            className={`text-xs ${
              isBench ? "text-gray-500" : "text-gray-600"
            }`}>
            {player.player_role}
          </span>
        </div>
      </div>
    );
  };

  interface TeamSectionProps {
    team: Team; // The Team object type we defined before
    reverse?: boolean; // Optional, defaults to false
  }

  const TeamSection: React.FC<TeamSectionProps> = ({
    team,
    reverse = false,
  }) => {
    if (!team) return null;

    const playingXI = team.playing_xi || [];
    const benchPlayers = team.bench || [];

    return (
      <div className="space-y-1">
        <h3
          className="text-lg font-semibold text-gray-800 mb-2"
          style={{ color: team.team_color }}>
          {team.team_name} ({team.playing_xi_count} Playing)
        </h3>

        {/* Playing XI */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Playing XI</h4>
          {playingXI.map((player, index) => (
            <PlayerRow
              key={`playing-${player.player_id}`}
              player={player}
              isLastPlayer={
                index === playingXI.length - 1 && benchPlayers.length === 0
              }
              reverse={reverse}
              isBench={false}
              teamId={team.team_id}
              team={team}
            />
          ))}
        </div>

        {/* Bench Players */}
        {benchPlayers.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Bench ({benchPlayers.length})
            </h4>
            {benchPlayers.map((player, index) => (
              <PlayerRow
                key={`bench-${player.player_id}`}
                player={player}
                isLastPlayer={index === benchPlayers.length - 1}
                reverse={reverse}
                isBench={true}
                teamId={team.team_id}
                team={team}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-xl font-bold text-gray-800">
            Squad Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Team 1 */}
            <TeamSection team={team1} />

            {/* Team 2 */}
            <TeamSection team={team2} reverse />
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-4 text-xs text-gray-600 pt-2">
            <div className="flex items-center space-x-1">
              <span className="bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded">
                C
              </span>
              <span>Captain</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="bg-green-200 text-green-800 px-1 py-0.5 rounded">
                WK
              </span>
              <span>Wicket Keeper</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="bg-red-200 text-red-800 px-1 py-0.5 rounded">
                BENCH
              </span>
              <span>Bench Player</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-6">
            <Button
              className=""
              onClick={() => {
                if (onRefresh) {
                  onRefresh();
                } else {
                  window.location.reload();
                }
              }}
              disabled={Object.values(loadingPlayers).some(
                (loading) => loading
              )}>
              Refresh Squad
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Replace Dialog */}
      <ReplaceDialog />

      {/* Edit Dialog */}
      <EditPlayerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        player={editingPlayer}
        onSuccess={() => {
          setEditingPlayer(null);
          if (onRefresh) {
            onRefresh();
          } else {
            window.location.reload();
          }
        }}
        loading={loadingPlayers[`edit-${editingPlayer?.player_id}`] || false}
        onLoadingChange={(loading) => {
          if (editingPlayer) {
            const key = `edit-${editingPlayer.player_id}`;
            setLoadingPlayers((prev) => ({ ...prev, [key]: loading }));
          }
        }}
      />
    </>
  );
}
