/** @format */

import { useMatch } from "@/context/match-context";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft, RefreshCcw, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";
import Players from "./players";
import ScoreSummary from "./score-summary";
import PlayControl from "./play-control";
import Scoring from "./scoring";
import ScreenButtons from "./screen-buttons";
import PreviewData from "./preview-data";
import ButtonPanel from "./button-panel";
import BallByBall from "./ball-by-ball";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getTextColor } from "@/utils/getTextColor";
import BattingOrder from "./batting-order";

export default function MatchContent() {
  const { matchDetails, squads, matchId, loading, refreshMatchData } =
    useMatch();
  const router = useRouter();

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
                <Badge
                  style={{
                    backgroundColor: matchDetails.team_a.colors.primary,
                    color: getTextColor(matchDetails.team_a.colors.primary),
                  }}
                  className="uppercase p-2 px-4">
                  {matchDetails.team_a.short_name}
                </Badge>

                <p className="text-muted-foreground font-bold">VS</p>

                <Badge
                  style={{
                    backgroundColor: matchDetails.team_b.colors.primary,
                    color: getTextColor(matchDetails.team_b.colors.primary),
                  }}
                  className="uppercase p-2 px-4">
                  {matchDetails.team_b.short_name}
                </Badge>
              </div>
              {/* <div className="h-full w-px bg-gray-300"></div> */}
            </div>
            <Button
              className="bg-red-400 hover:bg-red-500"
              onClick={refreshMatchData}>
              Refresh <RefreshCcw />
            </Button>
            <div className="flex gap-4">
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
              <div className="h-full w-px bg-gray-300"></div>
              <div className="flex gap-4 items-center justify-between">
                <p className="text-muted-foreground">Macth Type :</p>
                <Badge className={`bg-yellow-300 uppercase text-black`}>
                  {matchDetails.match_type}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 ">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-4 flex flex-col gap-4">
              <ScoreSummary />
              <PlayControl />
              <Scoring />
            </div>
            <ScreenButtons />
          </div>
          <div className="grid grid-cols-2 gap-4 h-[18rem]">
            <PreviewData />
            <ButtonPanel />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <BattingOrder />
              <Players squads={squads} matchId={matchId} />
            </div>
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
