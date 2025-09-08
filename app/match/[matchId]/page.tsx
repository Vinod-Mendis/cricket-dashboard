/** @format */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";
import { toast } from "sonner";
import ScoreSummary from "@/components/match/score-summary";
import PlayControl from "@/components/match/play-control";
import ScreenButtons from "@/components/match/screen-buttons";
import Scoring from "@/components/match/scoring";
import PreviewData from "@/components/match/preview-data";
import BallByBall from "@/components/match/ball-by-ball";
import Players from "@/components/match/players";

interface MatchDetails {
  match_id: string;
  title: string;
  venue: string;
  status: string;
  team_a: {
    team_id: string;
    full_name: string;
    short_name: string;
    colors: {
      primary: string;
      secondary: string;
      extra: string;
    };
    logo: string;
  };
  team_b: {
    team_id: string;
    full_name: string;
    short_name: string;
    colors: {
      primary: string;
      secondary: string;
      extra: string;
    };
    logo: string;
  };
  officials: {
    field_umpire: string;
    third_umpire: string;
    reserve_umpire: string;
    referee: string;
  };
  weather: {
    condition: string;
    temperature: number;
    humidity: number;
    wind_speed: number;
  };
  toss: {
    winner_team_id: string;
    decision: string;
  };
}

interface Squad {
  team_id: string;
  team_name: string;
  team_color: string;
  playing_xi: Array<{
    player_id: string;
    player_name: string;
    player_role: string;
    is_playing: boolean;
    is_captain: boolean;
    is_wicketkeeper: boolean;
  }>;
  bench: Array<{
    player_id: string;
    player_name: string;
    player_role: string;
    is_playing: boolean;
    is_captain: boolean;
    is_wicketkeeper: boolean;
  }>;
  total_players: number;
  captain: {
    player_id: string;
    player_name: string;
    player_role: string;
    is_captain: boolean;
    is_wicketkeeper: boolean;
  };
  wicketkeeper: {
    player_id: string;
    player_name: string;
    player_role: string;
    is_captain: boolean;
    is_wicketkeeper: boolean;
  };
}

export default function MatchDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [squads, setSquads] = useState<{ [key: string]: Squad }>({});
  const [innings, setInnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const [matchResponse, squadResponse, inningsResponse] =
          await Promise.all([
            fetch(
              `https://cricket-score-board-v4g9.onrender.com/api/matches/${matchId}`
            ),
            fetch(
              `https://cricket-score-board-v4g9.onrender.com/api/matches/${matchId}/squads`
            ),
            fetch(
              `https://cricket-score-board-v4g9.onrender.com/api/innings/match/${matchId}`
            ),
          ]);

        const matchData = await matchResponse.json();
        const squadData = await squadResponse.json();
        const inningsData = await inningsResponse.json();

        if (matchData.success) {
          setMatchDetails(matchData.data);
        }

        if (squadData.success) {
          setSquads(squadData.data.squads);
        }

        if (inningsData.success) {
          // You'll need to add this state variable
          setInnings(inningsData.data); // or however the response is structured
          console.log(innings);
        }
      } catch (error) {
        console.error("Error fetching match details:", error);
        toast.error("Failed to load match details");
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchMatchDetails();
    }
  }, [matchId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading match details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!matchDetails) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Match Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested match could not be found.
            </p>
            <Button onClick={() => router.push("/matches")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Matches
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between">
            <div className="flex gap-4 items-center">
              <Button
                variant="outline"
                onClick={() => router.push("/matches")}
                className="">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Matches
              </Button>
              <div className="flex gap-4 items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-balance">
                    {matchDetails.title}
                  </h1>
                  <p className="text-muted-foreground">
                    Match ID: {matchDetails.match_id}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(
                    matchDetails.status
                  )} text-white capitalize`}>
                  {matchDetails.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 ">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-4 flex flex-col gap-4">
              <ScoreSummary matchId={matchId} />
              <PlayControl />
              <Scoring />
            </div>
            <ScreenButtons />
          </div>
          <div className="grid grid-cols-2 gap-4 h-[18rem]">
            <PreviewData />
            <div className="col-span-1 w-full h-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Players squads={squads} matchId={matchId} />
            <BallByBall inningId={5} />
          </div>

          {/* Match Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teams */}
            {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      backgroundColor: matchDetails.team_a.colors.primary,
                    }}>
                    {matchDetails.team_a.short_name}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {matchDetails.team_a.full_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {matchDetails.team_a.short_name}
                    </div>
                  </div>
                </div>

                <div className="text-2xl font-bold text-muted-foreground">
                  VS
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {matchDetails.team_b.full_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {matchDetails.team_b.short_name}
                    </div>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      backgroundColor: matchDetails.team_b.colors.primary,
                    }}>
                    {matchDetails.team_b.short_name}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

            {/* Toss Information */}
            {matchDetails.toss && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Toss
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">
                    <span className="font-semibold">
                      {matchDetails.toss.winner_team_id ===
                      matchDetails.team_a.team_id
                        ? matchDetails.team_a.short_name
                        : matchDetails.team_b.short_name}
                    </span>{" "}
                    won the toss and chose to{" "}
                    <span className="font-semibold">
                      {matchDetails.toss.decision.toLowerCase()}
                    </span>{" "}
                    first
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Match Info Sidebar */}
          <div className="space-y-6">
            {/* Venue & Weather */}
            {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Venue & Weather
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold">{matchDetails.venue}</div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <CloudSun className="h-4 w-4" />
                  <span className="font-medium">
                    {matchDetails.weather.condition}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Thermometer className="h-4 w-4" />
                  <span>{matchDetails.weather.temperature}°C</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Humidity: {matchDetails.weather.humidity}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Wind: {matchDetails.weather.wind_speed} km/h
                </div>
              </div>
            </CardContent>
          </Card> */}

            {/* Officials */}
            {/* <Card>
            <CardHeader>
              <CardTitle>Match Officials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Field Umpire:</span>
                <span className="font-medium">
                  {matchDetails.officials.field_umpire}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Third Umpire:</span>
                <span className="font-medium">
                  {matchDetails.officials.third_umpire}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reserve Umpire:</span>
                <span className="font-medium">
                  {matchDetails.officials.reserve_umpire}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Referee:</span>
                <span className="font-medium">
                  {matchDetails.officials.referee}
                </span>
              </div>
            </CardContent>
          </Card> */}
          </div>
        </div>

        {/* Team Squads */}
        {/* <div className="mt-8">
        <Tabs defaultValue={Object.keys(squads)[0]} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            {Object.values(squads).map((squad) => (
              <TabsTrigger key={squad.team_id} value={squad.team_id}>
                {squad.team_name} Squad ({squad.total_players})
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(squads).map(([teamId, squad]) => (
            <TabsContent key={teamId} value={teamId} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Playing XI
                      <Badge variant="outline">
                        {squad.playing_xi.length} players
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {squad.playing_xi.map((player) => (
                        <div
                          key={player.player_id}
                          className="flex items-center justify-between p-2 rounded-lg border">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {player.player_name}
                              {player.is_captain && (
                                <Badge variant="secondary" className="text-xs">
                                  C
                                </Badge>
                              )}
                              {player.is_wicketkeeper && (
                                <Badge variant="secondary" className="text-xs">
                                  WK
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {player.player_role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Bench
                      <Badge variant="outline">
                        {squad.bench.length} players
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {squad.bench.length > 0 ? (
                        squad.bench.map((player) => (
                          <div
                            key={player.player_id}
                            className="flex items-center justify-between p-2 rounded-lg border">
                            <div>
                              <div className="font-medium">
                                {player.player_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {player.player_role}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No bench players
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div> */}
      </div>
    </>
  );
}
