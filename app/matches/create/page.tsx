/** @format */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Team {
  id: number;
  team_name: string;
  short_name: string;
  primary_color: string;
  secondary_color: string;
  extra_color: string;
  flag: string;
  logo: string;
  created_at: string;
  updated_at: string;
}
interface Player {
  id: number; // Changed from player_id
  name: string;
  role: string;
  team_id: string;
  team_name: string; // Added new fields from API
  team_color: string; // Added new fields from API
}

interface Official {
  id: string;
  name: string;
  type: string;
}

interface Weather {
  id: string;
  location: string;
  condition: string;
  temperature: number;
}

export default function CreateMatchPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  // const [players, setPlayers] = useState<Player[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [weather, setWeather] = useState<Weather[]>([]);
  const [teamAPlayers, setTeamAPlayers] = useState<Player[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamASearch, setTeamASearch] = useState("");
  const [teamBSearch, setTeamBSearch] = useState("");

  const [formData, setFormData] = useState({
    match_id: "",
    match_type: "T20",
    title: "",
    venue_name: "",
    venue_city: "",
    start_time: "",
    team_a_id: "",
    team_a_captain_id: "",
    team_a_wicketkeeper_id: "",
    team_b_id: "",
    team_b_captain_id: "",
    team_b_wicketkeeper_id: "",
    field_umpire_id: "",
    third_umpire_id: "",
    reserve_umpire_id: "",
    referee_id: "",
    status: "SCHEDULED",
    toss_winner_team_id: "",
    toss_decision: "BAT",
    current_innings: 1,
    total_innings: 2,
    target: 0,
    winning_team_id: "",
    weather_id: "",
    day_night: false,
    team_a_players: [] as { player_id: number; is_playing: boolean }[],
    team_b_players: [] as { player_id: number; is_playing: boolean }[],
  });

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

  // const fetchPlayers = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://cricket-score-board-v4g9.onrender.com/api/players"
  //     );
  //     const data = await response.json();
  //     if (data.success) {
  //       setPlayers(data.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching players:", error);
  //   }
  // };

  const fetchOfficials = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/matchOfficials"
      );
      const data = await response.json();
      if (data.success) {
        setOfficials(data.data);
      }
    } catch (error) {
      console.error("Error fetching officials:", error);
    }
  };

  // const fetchWeather = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://cricket-score-board-v4g9.onrender.com/api/weather"
  //     );
  //     const data = await response.json();
  //     if (data.success) {
  //       setWeather(data.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching weather:", error);
  //   }
  // };

  // Add these functions after your existing fetch functions
  const fetchPlayersByTeam = async (teamId: string): Promise<Player[]> => {
    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players/team/${teamId}`
      );
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching players for team ${teamId}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTeams(),
        // fetchPlayers(),
        fetchOfficials(),
        // fetchWeather(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Update the useEffect for Team A players
  useEffect(() => {
    const fetchTeamAPlayers = async () => {
      if (formData.team_a_id) {
        const players = await fetchPlayersByTeam(formData.team_a_id);
        setTeamAPlayers(players);
        // Only initialize if team_a_players is empty or team changed
        setFormData((prev) => ({
          ...prev,
          team_a_players: players.map((player) => ({
            player_id: player.id, // Changed from player.player_id to player.id
            is_playing: false, // Always start with false
          })),
          // Reset captain and wicketkeeper when team changes
          team_a_captain_id: "",
          team_a_wicketkeeper_id: "",
        }));
      } else {
        setTeamAPlayers([]);
        setFormData((prev) => ({
          ...prev,
          team_a_players: [],
          team_a_captain_id: "",
          team_a_wicketkeeper_id: "",
        }));
      }
    };

    fetchTeamAPlayers();
  }, [formData.team_a_id]);

  // Update the useEffect for Team B players
  useEffect(() => {
    const fetchTeamBPlayers = async () => {
      if (formData.team_b_id) {
        const players = await fetchPlayersByTeam(formData.team_b_id);
        setTeamBPlayers(players);
        // Only initialize if team_b_players is empty or team changed
        setFormData((prev) => ({
          ...prev,
          team_b_players: players.map((player) => ({
            player_id: player.id, // Changed from player.player_id to player.id
            is_playing: false, // Always start with false
          })),
          // Reset captain and wicketkeeper when team changes
          team_b_captain_id: "",
          team_b_wicketkeeper_id: "",
        }));
      } else {
        setTeamBPlayers([]);
        setFormData((prev) => ({
          ...prev,
          team_b_players: [],
          team_b_captain_id: "",
          team_b_wicketkeeper_id: "",
        }));
      }
    };

    fetchTeamBPlayers();
  }, [formData.team_b_id]);

  const handleCreateMatch = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/matches",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Match created successfully");
        router.push("/matches");
      } else {
        toast.error(data.error?.message || "Failed to create match");
      }
    } catch (error) {
      console.error("Error creating match:", error);
      toast.error("Failed to create match");
    }
  };

  const handlePlayerSelection = (
    teamType: "A" | "B",
    playerId: number,
    isPlaying: boolean
  ) => {
    if (teamType === "A") {
      setFormData((prev) => ({
        ...prev,
        team_a_players: prev.team_a_players.map((player) =>
          player.player_id === playerId
            ? { ...player, is_playing: isPlaying }
            : player
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        team_b_players: prev.team_b_players.map((player) =>
          player.player_id === playerId
            ? { ...player, is_playing: isPlaying }
            : player
        ),
      }));
    }
  };

  const filteredTeamAPlayers = teamAPlayers.filter((player) =>
    player.name.toLowerCase().includes(teamASearch.toLowerCase())
  );

  const filteredTeamBPlayers = teamBPlayers.filter((player) =>
    player.name.toLowerCase().includes(teamBSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 px-10 mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Create New Match
            </h1>
            <p className="text-muted-foreground mt-2">
              Set up a new cricket match with teams and players
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" size={"lg"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleCreateMatch} size="lg">
            Create Match
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - General Data */}
        <div className="space-y-6 col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Match Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="match_id">Match ID</Label>
                  <Input
                    id="match_id"
                    value={formData.match_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        match_id: e.target.value.replace(/\s/g, ""), // Remove spaces
                      })
                    }
                    placeholder="T20-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="match_type">Match Type</Label>
                  <Select
                    value={formData.match_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, match_type: value })
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T20">T20</SelectItem>
                      <SelectItem value="ODI">ODI</SelectItem>
                      <SelectItem value="TEST">TEST</SelectItem>
                      <SelectItem value="T10">T10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Match Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="India vs Australia - 1st T20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue_name">Venue Name</Label>
                  <Input
                    id="venue_name"
                    value={formData.venue_name}
                    onChange={(e) =>
                      setFormData({ ...formData, venue_name: e.target.value })
                    }
                    placeholder="Sydney Cricket Ground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue_city">Venue City</Label>
                  <Input
                    id="venue_city"
                    value={formData.venue_city}
                    onChange={(e) =>
                      setFormData({ ...formData, venue_city: e.target.value })
                    }
                    placeholder="Sydney"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
              </div>

              <div className="flex  items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="day_night"
                    checked={formData.day_night}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, day_night: checked })
                    }
                  />
                  <Label htmlFor="day_night">Day/Night Match</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Match Status</Label>
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
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Venue & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weather_id">Weather Conditions</Label>
                <Select
                  value={formData.weather_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, weather_id: value })
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Weather" />
                  </SelectTrigger>
                  <SelectContent>
                    {weather.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.location} - {w.condition} ({w.temperature}°C)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card> */}

          {/* Match Officials */}
          <Card>
            <CardHeader>
              <CardTitle>Match Officials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field_umpire_id">Field Umpire</Label>
                  <Select
                    value={formData.field_umpire_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, field_umpire_id: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Umpire" />
                    </SelectTrigger>
                    <SelectContent>
                      {officials
                        .filter((o) => o.type === "UMPIRE")
                        .map((official) => (
                          <SelectItem key={official.id} value={official.id}>
                            {official.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="third_umpire_id">Third Umpire</Label>
                  <Select
                    value={formData.third_umpire_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, third_umpire_id: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Umpire" />
                    </SelectTrigger>
                    <SelectContent>
                      {officials
                        .filter((o) => o.type === "UMPIRE")
                        .map((official) => (
                          <SelectItem key={official.id} value={official.id}>
                            {official.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reserve_umpire_id">Reserve Umpire</Label>
                  <Select
                    value={formData.reserve_umpire_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, reserve_umpire_id: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Umpire" />
                    </SelectTrigger>
                    <SelectContent>
                      {officials
                        .filter((o) => o.type === "UMPIRE")
                        .map((official) => (
                          <SelectItem key={official.id} value={official.id}>
                            {official.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referee_id">Referee</Label>
                  <Select
                    value={formData.referee_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, referee_id: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Referee" />
                    </SelectTrigger>
                    <SelectContent>
                      {officials
                        .filter((o) => o.type === "REFEREE")
                        .map((official) => (
                          <SelectItem key={official.id} value={official.id}>
                            {official.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Team Data */}
        <div className="space-y-6 col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Selection
              </CardTitle>
            </CardHeader>
            <CardContent className=" grid grid-cols-2 gap-4">
              {/* Team A */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team_a_id">Team A</Label>

                  <Select
                    value={formData.team_a_id}
                    onValueChange={(value) => {
                      if (value === formData.team_b_id) {
                        // Swap teams if same team is selected
                        setFormData({
                          ...formData,
                          team_a_id: value,
                          team_b_id: formData.team_a_id,
                          // Reset captain and wicketkeeper selections when swapping
                          team_a_captain_id: "",
                          team_a_wicketkeeper_id: "",
                          team_b_captain_id: "",
                          team_b_wicketkeeper_id: "",
                        });
                      } else {
                        setFormData({
                          ...formData,
                          team_a_id: value,
                          // Reset captain and wicketkeeper when changing team
                          team_a_captain_id: "",
                          team_a_wicketkeeper_id: "",
                        });
                      }
                    }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team A" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.team_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.team_a_id && teamAPlayers.length > 0 && (
                  <div className="space-y-3">
                    <Label>Team A Players</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Search players..."
                        value={teamASearch}
                        onChange={(e) => setTeamASearch(e.target.value)}
                      />
                    </div>
                    <div className="h-[28rem] overflow-y-auto border rounded-md p-3 space-y-2">
                      {filteredTeamAPlayers.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center space-x-2">
                          <Checkbox
                            id={`team_a_${player.id}`}
                            checked={
                              formData.team_a_players.find(
                                (p) => p.player_id === player.id // This is correct
                              )?.is_playing || false
                            }
                            onCheckedChange={(checked) =>
                              handlePlayerSelection(
                                "A",
                                player.id,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`team_a_${player.id}`}
                            className="text-sm">
                            {player.name} ({player.role})
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="team_a_captain_id">Captain</Label>
                        <Select
                          value={formData.team_a_captain_id}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              team_a_captain_id: value,
                            })
                          }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Captain" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamAPlayers.map((player) => (
                              <SelectItem
                                key={player.id}
                                value={player.id.toString()}>
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team_a_wicketkeeper_id">
                          Wicketkeeper
                        </Label>
                        <Select
                          value={formData.team_a_wicketkeeper_id}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              team_a_wicketkeeper_id: value,
                            })
                          }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select WK" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamAPlayers.map((player) => (
                              <SelectItem
                                key={player.id}
                                value={player.id.toString()}>
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Team B */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team_b_id">Team B</Label>
                  <Select
                    value={formData.team_b_id}
                    onValueChange={(value) => {
                      if (value === formData.team_a_id) {
                        // Swap teams if same team is selected
                        setFormData({
                          ...formData,
                          team_b_id: value,
                          team_a_id: formData.team_b_id,
                          // Reset captain and wicketkeeper selections when swapping
                          team_a_captain_id: "",
                          team_a_wicketkeeper_id: "",
                          team_b_captain_id: "",
                          team_b_wicketkeeper_id: "",
                        });
                      } else {
                        setFormData({
                          ...formData,
                          team_b_id: value,
                          // Reset captain and wicketkeeper when changing team
                          team_b_captain_id: "",
                          team_b_wicketkeeper_id: "",
                        });
                      }
                    }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team B" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.team_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.team_b_id && teamBPlayers.length > 0 && (
                  <div className="space-y-3">
                    <Label>Team B Players</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Search players..."
                        value={teamBSearch}
                        onChange={(e) => setTeamBSearch(e.target.value)}
                      />
                    </div>

                    <div className="h-[28rem] overflow-y-auto border rounded-md p-3 space-y-2">
                      {filteredTeamBPlayers.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center space-x-2">
                          <Checkbox
                            id={`team_b_${player.id}`}
                            checked={
                              formData.team_b_players.find(
                                (p) => p.player_id === player.id // This is correct
                              )?.is_playing || false
                            }
                            onCheckedChange={(checked) =>
                              handlePlayerSelection(
                                "B",
                                player.id,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`team_b_${player.id}`}
                            className="text-sm">
                            {player.name} ({player.role})
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="team_b_captain_id">Captain</Label>
                        <Select
                          value={formData.team_b_captain_id}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              team_b_captain_id: value,
                            })
                          }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Captain" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamBPlayers.map((player) => (
                              <SelectItem
                                key={player.id}
                                value={player.id.toString()}>
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team_b_wicketkeeper_id">
                          Wicketkeeper
                        </Label>
                        <Select
                          value={formData.team_b_wicketkeeper_id}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              team_b_wicketkeeper_id: value,
                            })
                          }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select WK" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamBPlayers.map((player) => (
                              <SelectItem
                                key={player.id}
                                value={player.id.toString()}>
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
