/** @format */
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import EditScoreDialog from "../modals/edit-score-dialog";

interface scoreSummaryTypes {
  matchId: string;
}

interface CreateInningsData {
  match_id: string;
  innings_number: number;
  batting_team_id: string;
  bowling_team_id: string;
  scheduled_overs: number;
  target: number;
}

// POST function to create new innings
async function createInnings(data: CreateInningsData) {
  try {
    const response = await fetch(
      "https://cricket-score-board-v4g9.onrender.com/api/innings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating innings:", error);
    throw error;
  }
}

export default function ScoreSummary({ matchId }: scoreSummaryTypes) {
  const [rightSideData, setRightSideData] = useState({
    lastWicket: { value: 0, label: "Last Wicket" },
    last5Overs: { value: 0, label: "Last 5 Overs" },
    dls: { value: 0, label: "DLS" },
    runRate: { value: 0, label: "Run Rate" },
  });
  const [leftSideData, setLeftSideData] = useState({
    drs: { value: 0, label: "DRS" },
    overRate: { value: 0, label: "Over Rate" },
    cutOff: { value: 0, label: "Cut-Off" },
    oversRem: { value: 0, label: "Overs Rem" },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    innings_number: 1,
    batting_team_id: "",
    bowling_team_id: "",
    scheduled_overs: 20,
    target: 0,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const inningsData: CreateInningsData = {
        match_id: matchId,
        ...formData,
      };

      const result = await createInnings(inningsData);
      console.log("Innings created successfully:", result);

      // Reset form and close dialog
      setFormData({
        innings_number: 1,
        batting_team_id: "",
        bowling_team_id: "",
        scheduled_overs: 20,
        target: 0,
      });
      setIsDialogOpen(false);

      // You can add success notification here
      alert("Innings created successfully!");
    } catch (error) {
      console.error("Failed to create innings:", error);
      alert("Failed to create innings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle score summary updates from EditScoreDialog
  const handleScoreUpdate = (updatedData: {
    rightSideData: typeof rightSideData;
    leftSideData: typeof leftSideData;
  }) => {
    setRightSideData(updatedData.rightSideData);
    setLeftSideData(updatedData.leftSideData);
  };

  return (
    <>
      <Card className="col-span-4">
        <CardHeader className="flex justify-between">
          <CardTitle>Score Summary</CardTitle>

          <div className="flex gap-2">
            {/* Edit Score Button */}
            <EditScoreDialog
              rightSideData={rightSideData}
              leftSideData={leftSideData}
              onSave={handleScoreUpdate}
            />

            {/* Create Innings Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  Create Inning <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Innings</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new innings. All fields are
                    required.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="innings_number">Innings Number</Label>
                      <Select
                        value={formData.innings_number.toString()}
                        onValueChange={(value) =>
                          handleInputChange("innings_number", parseInt(value))
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select innings" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Innings</SelectItem>
                          <SelectItem value="2">2nd Innings</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scheduled_overs">Scheduled Overs</Label>
                      <Input
                        id="scheduled_overs"
                        type="number"
                        min="1"
                        max="50"
                        value={formData.scheduled_overs}
                        onChange={(e) =>
                          handleInputChange(
                            "scheduled_overs",
                            parseInt(e.target.value)
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batting_team_id">Batting Team ID</Label>
                    <Input
                      id="batting_team_id"
                      placeholder="e.g., TEAM-IND"
                      value={formData.batting_team_id}
                      onChange={(e) =>
                        handleInputChange("batting_team_id", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bowling_team_id">Bowling Team ID</Label>
                    <Input
                      id="bowling_team_id"
                      placeholder="e.g., TEAM-AUS"
                      value={formData.bowling_team_id}
                      onChange={(e) =>
                        handleInputChange("bowling_team_id", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target">Target (0 for 1st innings)</Label>
                    <Input
                      id="target"
                      type="number"
                      min="0"
                      value={formData.target}
                      onChange={(e) =>
                        handleInputChange("target", parseInt(e.target.value))
                      }
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Innings"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex justify-between">
          {/* left side */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <h1 className="text-2xl">
                Team Name :{" "}
                <span>
                  {0}/{0} ({"0.0"})
                </span>
              </h1>
              <h1 className="text-xl">
                Team Name :{" "}
                <span>
                  {0}/{0} ({"0.0"})
                </span>
              </h1>
            </div>
          </div>

          {/* right side */}
          <div className="w-full max-w-2xl grid grid-cols-2">
            {/* Col 1 */}
            <div className="flex flex-col justify-between border-r-black/20 border-r-2 pr-12">
              {Object.entries(rightSideData).map(([key, data]) => (
                <div className="flex justify-between" key={key}>
                  <p className="font-semibold">{data.label}</p>
                  <p>{data.value === 0 ? "N/A" : data.value}</p>
                </div>
              ))}
            </div>

            {/* Col 2 */}
            <div className="flex flex-col justify-between pl-12">
              {Object.entries(leftSideData).map(([key, data]) => (
                <div className="flex justify-between" key={key}>
                  <p className="font-semibold">{data.label}</p>
                  <p>{data.value === 0 ? "N/A" : data.value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
