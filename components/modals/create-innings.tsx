/** @format */
"use client";

import React, { useState } from "react";
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
import { useMatch } from "@/context/match-context";

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

export default function CreateInningsDialog() {
  const { matchId } = useMatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    innings_number: 1,
    batting_team_id: "",
    bowling_team_id: "",
    scheduled_overs: 20,
    target: 0,
  });
  const { matchDetails } = useMatch();

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

  if (!matchDetails) {
    return null; // or return a loading state
  }

  return (
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
            Enter the details for the new innings. All fields are required.
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
                  {matchDetails.match_type.toLowerCase() === "test" && (
                    <>
                      <SelectItem value="3">3rd Innings</SelectItem>
                      <SelectItem value="4">4th Innings</SelectItem>
                    </>
                  )}
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
                  handleInputChange("scheduled_overs", parseInt(e.target.value))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batting_team">Batting Team</Label>
              <Select
                value={formData.batting_team_id}
                onValueChange={(value) => {
                  if (value === formData.bowling_team_id) {
                    // Swap teams if same team selected
                    handleInputChange("batting_team_id", value);
                    handleInputChange(
                      "bowling_team_id",
                      formData.batting_team_id
                    );
                  } else {
                    handleInputChange("batting_team_id", value);
                  }
                }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select batting team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={matchDetails.team_a.team_id}>
                    {matchDetails.team_a.full_name}
                  </SelectItem>
                  <SelectItem value={matchDetails.team_b.team_id}>
                    {matchDetails.team_b.full_name}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bowling_team">Bowling Team</Label>
              <Select
                value={formData.bowling_team_id}
                onValueChange={(value) => {
                  if (value === formData.batting_team_id) {
                    // Swap teams if same team selected
                    handleInputChange("bowling_team_id", value);
                    handleInputChange(
                      "batting_team_id",
                      formData.bowling_team_id
                    );
                  } else {
                    handleInputChange("bowling_team_id", value);
                  }
                }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bowling team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={matchDetails.team_a.team_id}
                    disabled={
                      formData.batting_team_id === matchDetails.team_a.team_id
                    }>
                    {matchDetails.team_a.full_name}
                  </SelectItem>
                  <SelectItem
                    value={matchDetails.team_b.team_id}
                    disabled={
                      formData.batting_team_id === matchDetails.team_b.team_id
                    }>
                    {matchDetails.team_b.full_name}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
  );
}
