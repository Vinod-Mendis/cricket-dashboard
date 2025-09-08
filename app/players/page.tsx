/** @format */

"use client";

import { useState, useEffect } from "react";
// import { useCricket } from "@/components/cricket-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, Search, Trash2, Edit } from "lucide-react";
import { CreatePlayerDialog } from "@/components/modals/create-player-dialog";
import { EditPlayerDialog } from "@/components/modals/edit-player-dialog";

interface Player {
  id: string;
  name: string;
  short_name: string;
  role: string;
  batting_style: string;
  bowling_style: string;
  age: number;
  image: string;
  shirt_number: number;
  team_id: string;
  team_name: string;
  team_color: string;
  last_match_date: string;
  career_span: string;
  created_at: string;
  updated_at: string;
}

interface Team {
  id: string;
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

function getRoleBadgeColor(role: string) {
  switch (role.toLowerCase()) {
    case "batsman":
      return "bg-blue-500";
    case "bowler":
      return "bg-red-500";
    case "all-rounder":
      return "bg-green-500";
    case "wicket-keeper":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}

export default function PlayersPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  // const [newPlayer, setNewPlayer] = useState({
  //   name: "",
  //   short_name: "",
  //   role: "",
  //   batting_style: "",
  //   bowling_style: "",
  //   age: "",
  //   image: "",
  //   shirt_number: "",
  //   team_id: "",
  //   last_match_date: "",
  //   career_span: "",
  // });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);

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

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/players"
      );
      const data = await response.json();
      if (data.success) {
        setPlayers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch players:", error);
    } finally {
      setLoading(false);
    }
  };
  const searchPlayers = async () => {
    try {
      setLoading(true);

      // If no search term and no filters, fetch all players
      if (
        !searchTerm.trim() &&
        selectedRole === "all" &&
        selectedTeam === "all"
      ) {
        fetchPlayers();
        return;
      }

      // If only role filter is selected (no search term, no team filter)
      if (
        !searchTerm.trim() &&
        selectedRole !== "all" &&
        selectedTeam === "all"
      ) {
        const response = await fetch(
          `https://cricket-score-board-v4g9.onrender.com/api/players/role/${selectedRole}`
        );
        const data = await response.json();
        if (data.success) {
          setPlayers(data.data);
        } else {
          console.error("Failed to fetch players by role:", data.message);
          setPlayers([]);
        }
        return;
      }

      // For all other cases (search term or multiple filters), use search API
      const params = new URLSearchParams();

      // Only add search term if it exists
      if (searchTerm.trim()) {
        params.append("q", searchTerm.trim());
      }

      // Add filters if selected
      if (selectedRole !== "all") {
        params.append("role", selectedRole);
      }
      if (selectedTeam !== "all") {
        params.append("team_id", selectedTeam);
      }

      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players/search?${params.toString()}`
      );

      const data = await response.json();

      if (data.success) {
        setPlayers(data.data);
      } else {
        console.error("Search failed:", data.message);
        setPlayers([]);
      }
    } catch (error) {
      console.error("Failed to search players:", error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (playerId: string, playerName: string) => {
    // Show confirmation alert
    const confirmed = window.confirm(
      `Are you sure you want to delete "${playerName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return; // User cancelled
    }

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players/${playerId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        // Show success alert
        // alert(`Player "${playerName}" has been successfully deleted.`);
        fetchPlayers(); // Refresh the list
      } else {
        // Show error alert
        alert(`Failed to delete player: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to delete player:", error);
      // Show error alert
      alert("An error occurred while deleting the player. Please try again.");
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchPlayers();
    }, 300); // 300ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedRole, selectedTeam]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setSelectedTeam("all");
    fetchPlayers();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Cricket Players</h1>
            <p className="text-muted-foreground mt-2">
              Complete roster of all cricket players and their details
            </p>
          </div>
          <CreatePlayerDialog
            onPlayerCreated={fetchPlayers}
            triggerText="Create Player"
            showTeamSelection={true}
            triggerClassName=""
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by player name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Batsman">Batsman</SelectItem>
                <SelectItem value="Bowler">Bowler</SelectItem>
                <SelectItem value="All-rounder">All-rounder</SelectItem>
                <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.team_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                onClick={searchPlayers}
                className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Player Roster ({players.length} players)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cricket-green mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading players...</p>
              </div>
            </div>
          ) : players.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Shirt Number</TableHead>
                    <TableHead>Team ID</TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player) => (
                    <TableRow key={player.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {player.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {player.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getRoleBadgeColor(
                            player.role
                          )} text-white`}>
                          {player.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {player.shirt_number}
                      </TableCell>
                      <TableCell className="font-medium">
                        {player.team_id}
                      </TableCell>
                      <TableCell>
                        {player.team_name ? (
                          <Badge
                            variant="outline"
                            style={{ borderColor: player.team_color }}>
                            {player.team_name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground italic">
                            No team assigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setPlayerToEdit(player);
                              setEditDialogOpen(true);
                            }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() =>
                              deletePlayer(player.id, player.name)
                            }>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Players Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ||
                  selectedRole !== "all" ||
                  selectedTeam !== "all"
                    ? "No players match your search criteria. Try adjusting your filters."
                    : "There are currently no players registered."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditPlayerDialog
        player={playerToEdit}
        isOpen={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setPlayerToEdit(null);
        }}
        onPlayerUpdated={fetchPlayers}
        showTeamSelection={true}
      />
    </div>
  );
}
