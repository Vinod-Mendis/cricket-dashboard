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

interface CreateInningsData {
  match_id: string;
  innings_number: number;
  batting_team_id: string;
  bowling_team_id: string;
  scheduled_overs: number;
  target: number;
}

interface CreateInningsDialogProps {
  matchId: string;
  onInningsCreated?: (data: CreateInningsData) => void;
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

export default function CreateInningsDialog({
  matchId,
  onInningsCreated,
}: CreateInningsDialogProps) {
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

      // Call the callback if provided
      if (onInningsCreated) {
        onInningsCreated(inningsData);
      }

      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);

      // Success notification
      alert("Innings created successfully!");
    } catch (error) {
      console.error("Failed to create innings:", error);
      alert("Failed to create innings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      innings_number: 1,
      batting_team_id: "",
      bowling_team_id: "",
      scheduled_overs: 20,
      target: 0,
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          Create Inning <Plus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
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
                  <SelectItem value="3">3rd Innings</SelectItem>
                  <SelectItem value="4">4th Innings</SelectItem>
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
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="e.g., 20"
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
            <p className="text-xs text-gray-500">
              Enter the unique identifier for the batting team
            </p>
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
            <p className="text-xs text-gray-500">
              Enter the unique identifier for the bowling team
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Runs</Label>
            <Input
              id="target"
              type="number"
              min="0"
              value={formData.target}
              onChange={(e) =>
                handleInputChange("target", parseInt(e.target.value) || 0)
              }
              placeholder="0 for 1st innings"
              required
            />
            <p className="text-xs text-gray-500">
              Set to 0 for first innings, or enter target for chasing team
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
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
