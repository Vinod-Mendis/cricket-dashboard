/** @format */

"use client";

import { useState, useEffect } from "react";
import { useCricket } from "@/components/cricket-context";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { User, Search, Trash2, Edit, Plus } from "lucide-react";

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
  const { teams } = useCricket();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    short_name: "",
    role: "",
    batting_style: "",
    bowling_style: "",
    age: "",
    image: "",
    shirt_number: "",
    team_id: "",
    last_match_date: "",
    career_span: "",
  });

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
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedRole !== "all") params.append("role", selectedRole);
      if (selectedTeam !== "all") params.append("team_id", selectedTeam);

      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players/search?${params.toString()}`
      );
      const data = await response.json();
      if (data.success) {
        setPlayers(data.data);
      }
    } catch (error) {
      console.error("Failed to search players:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (playerId: string) => {
    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players/${playerId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchPlayers(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to delete player:", error);
    }
  };

  const createPlayer = async () => {
    try {
      setIsCreating(true);
      const playerData = {
        ...newPlayer,
        age: Number.parseInt(newPlayer.age) || 0,
        shirt_number: Number.parseInt(newPlayer.shirt_number) || 0,
      };

      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/player",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playerData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setIsCreateDialogOpen(false);
        setNewPlayer({
          name: "",
          short_name: "",
          role: "",
          batting_style: "",
          bowling_style: "",
          age: "",
          image: "",
          shirt_number: "",
          team_id: "",
          last_match_date: "",
          career_span: "",
        });
        fetchPlayers(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to create player:", error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

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
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Player
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Player</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newPlayer.name}
                      onChange={(e) =>
                        setNewPlayer({ ...newPlayer, name: e.target.value })
                      }
                      placeholder="e.g., Rohit Sharma"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short_name">Short Name</Label>
                    <Input
                      id="short_name"
                      value={newPlayer.short_name}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          short_name: e.target.value,
                        })
                      }
                      placeholder="e.g., R. Sharma"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={newPlayer.role}
                      onValueChange={(value) =>
                        setNewPlayer({ ...newPlayer, role: value })
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Batsman">Batsman</SelectItem>
                        <SelectItem value="Bowler">Bowler</SelectItem>
                        <SelectItem value="All-rounder">All-rounder</SelectItem>
                        <SelectItem value="Wicket-keeper">
                          Wicket-keeper
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Select
                      value={newPlayer.team_id}
                      onValueChange={(value) =>
                        setNewPlayer({ ...newPlayer, team_id: value })
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No team</SelectItem>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batting_style">Batting Style</Label>
                    <Select
                      value={newPlayer.batting_style}
                      onValueChange={(value) =>
                        setNewPlayer({ ...newPlayer, batting_style: value })
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batting style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Right-handed">
                          Right-handed
                        </SelectItem>
                        <SelectItem value="Left-handed">Left-handed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bowling_style">Bowling Style</Label>
                    <Select
                      value={newPlayer.bowling_style}
                      onValueChange={(value) =>
                        setNewPlayer({ ...newPlayer, bowling_style: value })
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bowling style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Right-arm Fast">
                          Right-arm Fast
                        </SelectItem>
                        <SelectItem value="Left-arm Fast">
                          Left-arm Fast
                        </SelectItem>
                        <SelectItem value="Right-arm Off-break">
                          Right-arm Off-break
                        </SelectItem>
                        <SelectItem value="Left-arm Orthodox">
                          Left-arm Orthodox
                        </SelectItem>
                        <SelectItem value="Right-arm Leg-break">
                          Right-arm Leg-break
                        </SelectItem>
                        <SelectItem value="Left-arm Chinaman">
                          Left-arm Chinaman
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={newPlayer.age}
                      onChange={(e) =>
                        setNewPlayer({ ...newPlayer, age: e.target.value })
                      }
                      placeholder="e.g., 35"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shirt_number">Shirt Number</Label>
                    <Input
                      id="shirt_number"
                      type="number"
                      value={newPlayer.shirt_number}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          shirt_number: e.target.value,
                        })
                      }
                      placeholder="e.g., 45"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newPlayer.image}
                    onChange={(e) =>
                      setNewPlayer({ ...newPlayer, image: e.target.value })
                    }
                    placeholder="http://example.com/player.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="last_match_date">Last Match Date</Label>
                    <Input
                      id="last_match_date"
                      type="date"
                      value={newPlayer.last_match_date}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          last_match_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="career_span">Career Span</Label>
                    <Input
                      id="career_span"
                      value={newPlayer.career_span}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          career_span: e.target.value,
                        })
                      }
                      placeholder="e.g., 2007-Present"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={createPlayer}
                    disabled={isCreating || !newPlayer.name || !newPlayer.role}>
                    {isCreating ? "Creating..." : "Create Player"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
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
                            className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => deletePlayer(player.id)}>
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
    </div>
  );
}
