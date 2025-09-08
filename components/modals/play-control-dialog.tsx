/** @format */

import React, { useState } from "react";
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

// Mock data for players and bowlers
const mockPlayers = [
  "Virat Kohli",
  "Rohit Sharma",
  "KL Rahul",
  "Hardik Pandya",
  "Ravindra Jadeja",
  "MS Dhoni",
  "Shubman Gill",
  "Rishabh Pant",
  "Jasprit Bumrah",
  "Mohammed Shami",
];

const mockBowlers = [
  "Jasprit Bumrah",
  "Mohammed Shami",
  "Yuzvendra Chahal",
  "Ravichandran Ashwin",
  "Kuldeep Yadav",
  "Bhuvneshwar Kumar",
  "Shardul Thakur",
  "Washington Sundar",
];

interface DialogControlProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export default function PlayControlEdit({ open, onOpenChange }:DialogControlProps) {
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
    bowlerMaidens: 0,
    bowlerRuns: 0,
    bowlerWickets: 0,
    overs: 0,
    balls: 0,
  });

  // eslint-disable-next-line
  const handleInputChange = (field:any, value:any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving form data:", formData);
    onOpenChange(false);
  };

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
            <CardHeader>
              <CardTitle className="text-lg">Player Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="striker">Striker</Label>
                  <Select
                    value={formData.striker}
                    onValueChange={(value) =>
                      handleInputChange("striker", value)
                    }>
                    <SelectTrigger id="striker" className="w-full">
                      <SelectValue placeholder="Select striker" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPlayers.map((player) => (
                        <SelectItem key={player} value={player}>
                          {player}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="nonStriker">Non-Striker</Label>
                  <Select
                    value={formData.nonStriker}
                    onValueChange={(value) =>
                      handleInputChange("nonStriker", value)
                    }>
                    <SelectTrigger id="nonStriker" className="w-full">
                      <SelectValue placeholder="Select non-striker" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPlayers.map((player) => (
                        <SelectItem key={player} value={player}>
                          {player}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="bowler">Bowler</Label>
                  <Select
                    value={formData.bowler}
                    onValueChange={(value) =>
                      handleInputChange("bowler", value)
                    }>
                    <SelectTrigger id="bowler" className="w-full">
                      <SelectValue placeholder="Select bowler" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBowlers.map((bowler) => (
                        <SelectItem key={bowler} value={bowler}>
                          {bowler}
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
            <CardHeader>
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
            <CardHeader>
              <CardTitle className="text-lg">
                Bowling & Over Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* First Row - Bowler Stats */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
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
                  <div className="flex-1 flex flex-col gap-2">
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
                  <div className="flex-1 flex flex-col gap-2">
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
                </div>

                {/* Second Row - Wickets & Over Info */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
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
                  <div className="flex-1 flex flex-col gap-2">
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
                  <div className="flex-1 flex flex-col gap-2">
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
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}