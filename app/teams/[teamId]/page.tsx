/** @format */

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Edit,
  Search,
  UserMinus,
} from "lucide-react";
import Image from "next/image";
import { CreatePlayerDialog } from "@/components/modals/create-player-dialog";
import { EditPlayerDialog } from "@/components/modals/edit-player-dialog";

interface Player {
  id: number;
  name: string;
  short_name: string;
  role: string;
  batting_style: string;
  bowling_style: string;
  age: number;
  image: string;
  shirt_number: number;
  team_id: number;
  team_name: string;
  team_color: string;
  last_match_date: string;
  career_span: string;
  created_at: string;
  updated_at: string;
}

interface Team {
  id: number;
  team_name: string;
  short_name: string;
  primary_color: string;
  secondary_color?: string;
  extra_color?: string;
  flag?: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

function AddExistingPlayersDialog({
  teamId,
  teamName,
  onPlayersAdded,
}: {
  teamId: number;
  teamName: string;
  onPlayersAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      fetchAvailablePlayers();
    }
  }, [open, teamId]);

  const fetchAvailablePlayers = async () => {
    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players?exclude_team=${teamId}`
      );
      if (response.ok) {
        const data = await response.json();
        setAvailablePlayers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching available players:", error);
      setAvailablePlayers([]);
    }
  };

  const filteredPlayers = availablePlayers
    .filter((player) => player.team_id !== teamId) // exclude current team players
    .filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handlePlayerToggle = (playerId: string | number) => {
    const idNum = typeof playerId === "number" ? playerId : Number(playerId);
    setSelectedPlayers((prev) =>
      prev.includes(idNum)
        ? prev.filter((id) => id !== idNum)
        : [...prev, idNum]
    );
  };

  const handleAddPlayers = async () => {
    if (selectedPlayers.length === 0) return;
    setLoading(true);

    try {
      const promises = selectedPlayers.map((playerId) => {
        const player = availablePlayers.find((p) => p.id === playerId);
        if (!player) return Promise.resolve();

        return fetch(
          `https://cricket-score-board-v4g9.onrender.com/api/players/${playerId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...player, // include all current player data
              team_id: teamId, // update team_id
            }),
          }
        );
      });

      await Promise.all(promises);
      setOpen(false);
      setSelectedPlayers([]);
      onPlayersAdded();
    } catch (error) {
      console.error("Error adding players to team:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <UserPlus className="h-4 w-4" />
          Add Existing Players
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90vw] max-w-[1200px] max-h-[80vh] overflow-hidden rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Existing Players to {teamName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[calc(80vh-120px)]">
          {/* Search bar */}
          <div className="flex items-center gap-2 p-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Player table */}
          <div className="flex-1 overflow-y-auto px-4">
            {filteredPlayers.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Current Team</TableHead>
                      <TableHead>Age</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPlayers.includes(player.id)}
                            onCheckedChange={() =>
                              handlePlayerToggle(player.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {player.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{player.role}</Badge>
                        </TableCell>
                        <TableCell>{player.team_id || "Unassigned"}</TableCell>
                        <TableCell>{player.age}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? "No players found matching your search."
                  : "No available players to add."}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedPlayers.length} player
              {selectedPlayers.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddPlayers}
                disabled={loading || selectedPlayers.length === 0}>
                {loading
                  ? "Adding..."
                  : `Add ${selectedPlayers.length} Player${
                      selectedPlayers.length !== 1 ? "s" : ""
                    }`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);

  const teamId = Number(params.teamId);
  console.log("TEAM ID tuypt : ", typeof teamId);

  const team = teams.find((t) => t.id === teamId);
  console.log("TEAM : ", teams);

  console.log(teamPlayers);

  useEffect(() => {
    if (teamId) {
      fetchTeams();
      fetchTeamPlayers();
    }
  }, [teamId]);

  const fetchTeamPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players/team/${teamId}`
      );
      if (response.ok) {
        const data = await response.json();
        setTeamPlayers(data.data || []);
      } else {
        setTeamPlayers([]);
      }
    } catch (error) {
      console.error("Error fetching team players:", error);
      setTeamPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/teams"
      );
      if (response.ok) {
        const data = await response.json();
        setTeams(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlayerFromTeam = async (playerId: number) => {
    try {
      // Get the player from state
      const player = teamPlayers.find((p) => p.id === playerId);
      if (!player) return;

      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players/${playerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: player.name,
            short_name: player.short_name,
            role: player.role,
            batting_style: player.batting_style,
            bowling_style: player.bowling_style,
            age: player.age,
            image: player.image,
            shirt_number: player.shirt_number,
            team_id: null, // 👈 detach from team
            team_name: "", // optional
            last_match_date: player.last_match_date,
            career_span: player.career_span,
          }),
        }
      );

      if (response.ok) {
        fetchTeamPlayers(); // Refresh list
      } else {
        const err = await response.json();
        console.error("Failed to remove player:", err);
      }
    } catch (error) {
      console.error("Error removing player from team:", error);
    }
  };

  const filteredPlayers = Array.isArray(teamPlayers)
    ? teamPlayers.filter(
        (player) =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (!team) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Team Not Found</h1>
          <Button onClick={() => router.push("/teams")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/teams")}
          className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Teams
        </Button>

        <div className="flex items-center gap-4 mb-4">
          <Image
            src={team.logo || "/placeholder.svg"}
            alt={`${team.team_name} logo`}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-balance">
              {team.team_name}
            </h1>
            <p className="text-muted-foreground">{team.short_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Squad Size:</span>
            <Badge variant="secondary">{teamPlayers.length}</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Players</CardTitle>
              <div className="flex gap-2">
                <CreatePlayerDialog
                  teamId={teamId}
                  teamName={team.team_name}
                  onPlayerCreated={fetchTeamPlayers}
                  triggerText="Create New Player"
                  showTeamSelection={false}
                  triggerClassName=""
                />
                <AddExistingPlayersDialog
                  teamId={teamId}
                  teamName={team.team_name}
                  onPlayersAdded={fetchTeamPlayers}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players by name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading players...</div>
              ) : filteredPlayers.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Team ID</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Shirt #</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlayers.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-mono text-sm">
                            {player.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {player.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{player.role}</Badge>
                          </TableCell>
                          <TableCell>{player.team_id}</TableCell>
                          <TableCell>{player.age}</TableCell>
                          <TableCell>{player.shirt_number || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setPlayerToEdit(player);
                                  setEditDialogOpen(true);
                                }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleRemovePlayerFromTeam(player.id)
                                }
                                title="Remove from team">
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? "No players found matching your search."
                    : "No players in this team yet."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <EditPlayerDialog
        player={playerToEdit}
        isOpen={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setPlayerToEdit(null);
        }}
        onPlayerUpdated={fetchTeamPlayers}
        showTeamSelection={true}
      />
    </div>
  );
}
