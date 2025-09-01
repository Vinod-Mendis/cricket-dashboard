/** @format */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Clock,
  MapPin,
  Trophy,
  Plus,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Match {
  match_id: string;
  title: string;
  start_time: string;
  match_type: string;
  status: string;
  team_a_id: string;
  team_b_id: string;
  toss_decision: string | null;
  winning_team_id: string | null;
  day_night: boolean;
  team_a_name: string;
  team_a_color: string;
  team_b_name: string;
  team_b_color: string;
  winning_team_name: string | null;
  weather_condition: string;
  temperature: number;
  venue_name?: string;
  venue_city?: string;
}

interface Team {
  team_id: string;
  full_name: string;
  short_name: string;
  colors: {
    primary: string;
    secondary: string;
    extra: string;
  };
  logo: string;
}

// interface Player {
//   player_id: string
//   name: string
//   role: string
//   team_id: string
// }

// interface Official {
//   id: string
//   name: string
//   type: string
// }

// interface Weather {
//   id: string
//   location: string
//   condition: string
//   temperature: number
// }

function MatchCard({
  match,
  onEdit,
  onDelete,
}: {
  match: Match;
  onEdit: (match: Match) => void;
  onDelete: (matchId: string) => void;
}) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "LIVE":
        return "bg-green-500";
      case "SCHEDULED":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-gray-500";
      case "ABANDONED":
        return "bg-red-500";
      case "RAIN_DELAY":
        return "bg-yellow-500";
      case "DRAW":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(match.start_time);

  const handleCardClick = () => {
    router.push(`/match/${match.match_id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {match.match_type}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor(
                match.status
              )} text-white capitalize`}>
              {match.status.toLowerCase()}
            </Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(match);
                }}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(match.match_id);
                }}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4" onClick={handleCardClick}>
        {/* Match Title */}
        <div className="font-semibold text-center text-lg">{match.title}</div>

        {/* Teams */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: match.team_a_color }}>
              {match.team_a_name.substring(0, 3).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{match.team_a_name}</div>
            </div>
          </div>

          <div className="text-lg font-bold text-muted-foreground">VS</div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-semibold">{match.team_b_name}</div>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: match.team_b_color }}>
              {match.team_b_name.substring(0, 3).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {date} at {time}
            </span>
            {match.day_night && (
              <Badge variant="outline" className="text-xs">
                D/N
              </Badge>
            )}
          </div>
          {match.venue_name && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {match.venue_name}, {match.venue_city}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              🌤️ {match.weather_condition}, {match.temperature}°C
            </span>
          </div>
          {match.winning_team_name && (
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-medium">{match.winning_team_name} won</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("T20");
  const [filterStatus, setFilterStatus] = useState("SCHEDULED");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const router = useRouter();

  const [formData, setFormData] = useState({
    match_id: "",
    match_type: "T20",
    title: "",
    venue_name: "",
    venue_city: "",
    start_time: "",
    team_a_id: "",
    team_b_id: "",
    status: "SCHEDULED",
    winning_team_id: "",
    day_night: false,
  });

  const fetchMatches = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/matches"
      );
      const data = await response.json();
      if (data.success) {
        setMatches(data.data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to fetch matches");
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/teams"
      );
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMatches(), fetchTeams()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const searchMatches = async () => {
    if (!searchQuery && filterType === "all" && filterStatus === "all") {
      fetchMatches();
      return;
    }

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("title", searchQuery);
      if (filterType !== "all") params.append("match_type", filterType);
      if (filterStatus !== "all") params.append("status", filterStatus);

      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/matches/search?${params}`
      );
      const data = await response.json();
      if (data.success) {
        setMatches(data.data);
      }
    } catch (error) {
      console.error("Error searching matches:", error);
      toast.error("Failed to search matches");
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchMatches();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filterType, filterStatus]);

  const handleEditMatch = async () => {
    if (!editingMatch) return;

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/matches/${editingMatch.match_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Match updated successfully");
        setIsEditDialogOpen(false);
        setEditingMatch(null);
        resetForm();
        fetchMatches();
      } else {
        toast.error(data.error?.message || "Failed to update match");
      }
    } catch (error) {
      console.error("Error updating match:", error);
      toast.error("Failed to update match");
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm("Are you sure you want to delete this match?")) return;

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/matches/${matchId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Match deleted successfully");
        fetchMatches();
      } else {
        toast.error(data.error?.message || "Failed to delete match");
      }
    } catch (error) {
      console.error("Error deleting match:", error);
      toast.error("Failed to delete match");
    }
  };

  const resetForm = () => {
    setFormData({
      match_id: "",
      match_type: "T20",
      title: "",
      venue_name: "",
      venue_city: "",
      start_time: "",
      team_a_id: "",
      team_b_id: "",
      status: "SCHEDULED",
      winning_team_id: "",
      day_night: false,
    });
  };

  const openEditDialog = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      match_id: match.match_id,
      match_type: match.match_type,
      title: match.title,
      venue_name: match.venue_name || "",
      venue_city: match.venue_city || "",
      start_time: match.start_time.slice(0, 16),
      team_a_id: match.team_a_id,
      team_b_id: match.team_b_id,
      status: match.status,
      winning_team_id: match.winning_team_id || "",
      day_night: match.day_night,
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateMatch = () => {
    router.push("/matches/create");
  };

  const liveMatches = matches.filter((match) => match.status === "LIVE");
  const scheduledMatches = matches.filter(
    (match) => match.status === "SCHEDULED"
  );
  const completedMatches = matches.filter(
    (match) => match.status === "COMPLETED"
  );
  const abondonedMatches = matches.filter(
    (match) => match.status === "ABANDONED"
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading matches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Cricket Matches</h1>
            <p className="text-muted-foreground mt-2">
              Track ongoing, scheduled, and completed cricket matches
            </p>
          </div>
          <Button onClick={handleCreateMatch}>
            <Plus className="h-4 w-4 mr-2" />
            Create Match
          </Button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search matches by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="T20">T20</SelectItem>
              <SelectItem value="ODI">ODI</SelectItem>
              <SelectItem value="TEST">TEST</SelectItem>
              <SelectItem value="T10">T10</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="LIVE">Live</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ABANDONED">Abandoned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="live" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Live ({liveMatches.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Scheduled ({scheduledMatches.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            Completed ({completedMatches.length})
          </TabsTrigger>
          <TabsTrigger value="abondoned" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            Abondoned ({abondonedMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {liveMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveMatches.map((match) => (
                <MatchCard
                  key={match.match_id}
                  match={match}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteMatch}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Live Matches
                  </h3>
                  <p className="text-muted-foreground">
                    There are currently no matches in progress.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {scheduledMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {scheduledMatches.map((match) => (
                <MatchCard
                  key={match.match_id}
                  match={match}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteMatch}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Scheduled Matches
                  </h3>
                  <p className="text-muted-foreground">
                    There are no upcoming matches scheduled.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedMatches.map((match) => (
                <MatchCard
                  key={match.match_id}
                  match={match}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteMatch}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Completed Matches
                  </h3>
                  <p className="text-muted-foreground">
                    No matches have been completed yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="abondoned" className="space-y-4">
          {abondonedMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {abondonedMatches.map((match) => (
                <MatchCard
                  key={match.match_id}
                  match={match}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteMatch}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Completed Matches
                  </h3>
                  <p className="text-muted-foreground">
                    No matches have been completed yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Match</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_title">Match Title</Label>
              <Input
                id="edit_title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="LIVE">Live</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ABANDONED">Abandoned</SelectItem>
                    <SelectItem value="RAIN_DELAY">Rain Delay</SelectItem>
                    <SelectItem value="DRAW">Draw</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_winning_team">Winning Team</Label>
                <Select
                  value={formData.winning_team_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, winning_team_id: value })
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Winner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Winner</SelectItem>
                    {/* Only show the two teams of this match */}
                    {editingMatch && (
                      <>
                        <SelectItem className="uppercase" value={editingMatch.team_a_id}>
                          {editingMatch.team_a_name}
                        </SelectItem>
                        <SelectItem className="uppercase" value={editingMatch.team_b_id}>
                          {editingMatch.team_b_name}
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditMatch}>Update Match</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
