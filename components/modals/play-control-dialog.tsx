/** @format */

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMatch } from "@/context/match-context";

interface BowlingTeamData {
  players: {
    bowlers_available: Array<{
      player_id: number;
      player_name: string;
      player_role: string;
      bowling_style: string;
    }>;
  };
}

interface CurrentState {
  striker: {
    id: number;
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
  };
  non_striker: {
    id: number;
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
  };
  bowler: {
    id: number;
    name: string;
    overs: string;
    maidens: number;
    runs: number;
    wickets: number;
    balls: number;
  };
  this_over: {
    runs: string;
    balls: string;
    fours: string;
    sixes: string;
  };
}

interface DialogControlProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PlayControlEdit({
  open,
  onOpenChange,
}: DialogControlProps) {
  const { battingOrder } = useMatch();

  const [bowlingTeam, setBowlingTeam] = useState<BowlingTeamData | null>(null);
  const [loadingBowlers, setLoadingBowlers] = useState(false);
  // Form state
  const [formData, setFormData] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
    strikerRuns: 0,
    nonStrikerRuns: 0,
    thisOverRuns: 0,
    strikerBalls: 0,
    nonStrikerBalls: 0,
    thisOverBalls: 0,
    strikerFours: 0,
    nonStrikerFours: 0,
    thisOverFours: 0,
    strikerSixes: 0,
    nonStrikerSixes: 0,
    thisOverSixes: 0,
    bowlerOvers: 0,
    bowlerBalls: 0,
    bowlerMaidens: 0,
    bowlerRuns: 0,
    bowlerWickets: 0,
    // overs: 0,
    // balls: 0,
  });
  const [currentState, setCurrentState] = useState<CurrentState | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  useEffect(() => {
    console.log("formdata:", formData);
  }, [formData]);

  const fetchCurrentState = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/1/current-state"
      );
      const data = await response.json();
      if (data.success) {
        const state = data.data.current_state;
        setCurrentState(state);
        console.log("state", state);

        // Initialize form with current state values
        setFormData((prev) => ({
          ...prev,
          // player IDS
          striker: state.striker.id,
          nonStriker: state.non_striker.id,
          bowler: state.bowler.id,
          // batting stats
          //  -- Striker
          strikerRuns: state.striker.runs,
          strikerBalls: state.striker.balls,
          strikerFours: state.striker.fours,
          strikerSixes: state.striker.sixes,
          //  -- Non-Striker
          nonStrikerRuns: state.non_striker.runs,
          nonStrikerBalls: state.non_striker.balls,
          nonStrikerFours: state.non_striker.fours,
          nonStrikerSixes: state.non_striker.sixes,
          // Bowling stats
          bowlerOvers: parseInt(state.bowler.overs) || 0,
          bowlerMaidens: state.bowler.maidens,
          bowlerRuns: state.bowler.runs,
          bowlerWickets: state.bowler.wickets,
          bowlerBalls: parseInt(state.bowler.balls) || 0,
          // this_over
          thisOverRuns: parseInt(state.this_over.runs) || 0,
          thisOverBalls: parseInt(state.this_over.balls) || 0,
          thisOverFours: parseInt(state.this_over.fours) || 0,
          thisOverSixes: parseInt(state.this_over.sixes) || 0,
          // balls: parseInt(state.bowler.balls) || 0, // Current ball in over
          // overs: liveStatus?.last_ball?.over_number || 0, // Current over
        }));
      }
    } catch (error) {
      console.error("Error fetching current state:", error);
    }
  };

  // Fetch bowling team data
  const fetchBowlingTeam = async () => {
    setLoadingBowlers(true);
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/1/bowling-team"
      );
      const data = await response.json();
      if (data.success) {
        setBowlingTeam(data.data);
      }
    } catch (error) {
      console.error("Error fetching bowling team:", error);
    } finally {
      setLoadingBowlers(false);
    }
  };

  const availableBowlers = bowlingTeam?.players?.bowlers_available || [];

  useEffect(() => {
    if (open) {
      fetchBowlingTeam();
      fetchCurrentState();
    }
  }, [open]);

  // Get available players with NOT_OUT status, excluding the other selection
  const availableStrikers =
    battingOrder?.batting_order?.filter(
      (player) =>
        player.status === "NOT_OUT" &&
        player.player_id.toString() !== formData.nonStriker
    ) || [];

  const availableNonStrikers =
    battingOrder?.batting_order?.filter(
      (player) =>
        player.status === "NOT_OUT" &&
        player.player_id.toString() !== formData.striker
    ) || [];

  // eslint-disable-next-line
  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    try {
      const requestBody = {
        striker_id: parseInt(formData.striker),
        non_striker_id: parseInt(formData.nonStriker),
        bowler_id: parseInt(formData.bowler),
        batting_stats: {
          striker: {
            runs: formData.strikerRuns,
            balls: formData.strikerBalls,
            fours: formData.strikerFours,
            sixes: formData.strikerSixes,
          },
          non_striker: {
            runs: formData.nonStrikerRuns,
            balls: formData.nonStrikerBalls,
            fours: formData.nonStrikerFours,
            sixes: formData.nonStrikerSixes,
          },
        },
        bowling_stats: {
          overs: formData.bowlerOvers,
          balls: formData.bowlerBalls,
          runs: formData.bowlerRuns,
          wickets: formData.bowlerWickets,
          maidens: formData.bowlerMaidens,
          no_balls: 0,
        },
        over_info: {
          runs: formData.thisOverRuns,
          balls: formData.thisOverBalls,
          fours: formData.thisOverFours,
          sixes: formData.thisOverSixes,
        },
      };

      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/1/update-statistics",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log("Statistics updated successfully");
        onOpenChange(false);
      } else {
        console.error("Failed to update statistics");
      }
    } catch (error) {
      console.error("Error updating statistics:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  // const getPlayerNameById = (id: string | number, players: any[]) => {
  //   const player = players.find(
  //     (p: any) => p.player_id.toString() === id.toString()
  //   );
  //   return player ? player.player_name : "";
  // };

  const handleCancel = () => {
    // Reset form or handle cancel logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[100rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Cricket Score</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6">
          {/* Player Information */}
          <Card className="min-w-md">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Player Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="striker">Striker</Label>
                  <Select
                    // value={currentState?.striker.name}
                    onValueChange={(value) =>
                      handleInputChange("striker", value)
                    }>
                    <SelectTrigger id="striker" className="w-full">
                      <SelectValue placeholder={currentState?.striker.name} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStrikers.map((player) => (
                        <SelectItem
                          key={player.player_id}
                          value={player.player_id.toString()}>
                          {player.player_name} ({player.player_role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="nonStriker">Non-Striker</Label>
                  <Select
                    // value={formData.nonStriker}
                    onValueChange={(value) =>
                      handleInputChange("nonStriker", value)
                    }>
                    <SelectTrigger id="nonStriker" className="w-full">
                      <SelectValue
                        placeholder={currentState?.non_striker.name}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableNonStrikers.map((player) => (
                        <SelectItem
                          key={player.player_id}
                          value={player.player_id.toString()}>
                          {player.player_name} ({player.player_role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="bowler">Bowler</Label>
                  <Select
                    // value={formData.bowler}
                    onValueChange={(value) =>
                      handleInputChange("bowler", value)
                    }
                    disabled={loadingBowlers}>
                    <SelectTrigger id="bowler" className="w-full">
                      <SelectValue placeholder={currentState?.bowler.name} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBowlers.map((bowler) => (
                        <SelectItem
                          key={bowler.player_id}
                          value={bowler.player_id.toString()}>
                          {bowler.player_name} ({bowler.bowling_style})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batting Statistics */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Batting Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Headers */}
                <div className="flex gap-4">
                  <div className="flex-1 font-semibold text-center">
                    Striker
                  </div>
                  <div className="flex-1 font-semibold text-center">
                    Non-Striker
                  </div>
                  <div className="flex-1 font-semibold text-center">
                    This Over
                  </div>
                </div>

                {/* Runs Row */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Runs</Label>
                    <Input
                      type="number"
                      value={formData.strikerRuns}
                      onChange={(e) =>
                        handleInputChange(
                          "strikerRuns",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Runs</Label>
                    <Input
                      type="number"
                      value={formData.nonStrikerRuns}
                      onChange={(e) =>
                        handleInputChange(
                          "nonStrikerRuns",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Runs</Label>
                    <Input
                      type="number"
                      value={formData.thisOverRuns}
                      onChange={(e) =>
                        handleInputChange(
                          "thisOverRuns",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>

                {/* Balls Row */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Balls</Label>
                    <Input
                      type="number"
                      value={formData.strikerBalls}
                      onChange={(e) =>
                        handleInputChange(
                          "strikerBalls",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Balls</Label>
                    <Input
                      type="number"
                      value={formData.nonStrikerBalls}
                      onChange={(e) =>
                        handleInputChange(
                          "nonStrikerBalls",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Balls</Label>
                    <Input
                      type="number"
                      value={formData.thisOverBalls}
                      onChange={(e) =>
                        handleInputChange(
                          "thisOverBalls",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>

                {/* Fours Row */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Fours</Label>
                    <Input
                      type="number"
                      value={formData.strikerFours}
                      onChange={(e) =>
                        handleInputChange(
                          "strikerFours",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Fours</Label>
                    <Input
                      type="number"
                      value={formData.nonStrikerFours}
                      onChange={(e) =>
                        handleInputChange(
                          "nonStrikerFours",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Fours</Label>
                    <Input
                      type="number"
                      value={formData.thisOverFours}
                      onChange={(e) =>
                        handleInputChange(
                          "thisOverFours",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>

                {/* Sixes Row */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Sixes</Label>
                    <Input
                      type="number"
                      value={formData.strikerSixes}
                      onChange={(e) =>
                        handleInputChange(
                          "strikerSixes",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Sixes</Label>
                    <Input
                      type="number"
                      value={formData.nonStrikerSixes}
                      onChange={(e) =>
                        handleInputChange(
                          "nonStrikerSixes",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Label className="text-sm">Sixes</Label>
                    <Input
                      type="number"
                      value={formData.thisOverSixes}
                      onChange={(e) =>
                        handleInputChange(
                          "thisOverSixes",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bowling Statistics */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">
                Bowling & Over Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Bowler Stats Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Bowler Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="bowlerOvers">Bowler Overs</Label>
                      <Input
                        id="bowlerOvers"
                        type="number"
                        value={formData.bowlerOvers}
                        onChange={(e) =>
                          handleInputChange(
                            "bowlerOvers",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="bowlerMaidens">Bowler Maidens</Label>
                      <Input
                        id="bowlerMaidens"
                        type="number"
                        value={formData.bowlerMaidens}
                        onChange={(e) =>
                          handleInputChange(
                            "bowlerMaidens",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="bowlerRuns">Bowler Runs</Label>
                      <Input
                        id="bowlerRuns"
                        type="number"
                        value={formData.bowlerRuns}
                        onChange={(e) =>
                          handleInputChange(
                            "bowlerRuns",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="bowlerWickets">Bowler Wickets</Label>
                      <Input
                        id="bowlerWickets"
                        type="number"
                        value={formData.bowlerWickets}
                        onChange={(e) =>
                          handleInputChange(
                            "bowlerWickets",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Overs & Balls Section */}
                {/* <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Overs & Balls
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="overs">Overs</Label>
                      <Input
                        id="overs"
                        type="number"
                        value={formData.overs}
                        onChange={(e) =>
                          handleInputChange(
                            "overs",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="balls">Balls</Label>
                      <Input
                        id="balls"
                        type="number"
                        value={formData.balls}
                        onChange={(e) =>
                          handleInputChange(
                            "balls",
                            parseInt(e.target.value) || 0
                          )
                        }
                        max={5}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateLoading}>
            {updateLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
