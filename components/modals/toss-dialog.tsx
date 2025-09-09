/** @format */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Coins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMatch } from "@/context/match-context";

interface TossData {
  toss_winner_team_id: number;
  toss_decision: "BAT" | "BOWL";
}

interface TeamData {
  team_id: number;
  name: string;
  short_name: string;
}

interface TossResponse {
  success: boolean;
  data: {
    match_id: string;
    teams: {
      team_a: TeamData;
      team_b: TeamData;
    };
    toss: {
      winner_team_id: string;
      winner_team_name: string;
      winner_short_name: string;
      decision: string;
      summary: string;
    };
  };
}

export default function TossDialog() {
  const { matchDetails, matchId, refreshMatchData, setToss, toss } = useMatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentToss, setCurrentToss] = useState<
    TossResponse["data"]["toss"] | null
  >(null);
  const [formData, setFormData] = useState<TossData>({
    toss_winner_team_id: 0,
    toss_decision: "BAT",
  });

  // Fetch toss data when dialog opens
  const fetchTossData = async () => {
    if (!matchId) return;

    setIsFetching(true);
    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/matches/${matchId}/toss`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TossResponse = await response.json();

      if (result.success) {
        setCurrentToss(result.data.toss);
        setToss(result.data.toss);

        // Pre-fill form if toss already exists
        if (result.data.toss.winner_team_id) {
          setFormData({
            toss_winner_team_id: parseInt(result.data.toss.winner_team_id),
            toss_decision: result.data.toss.decision as "BAT" | "BOWL",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching toss data:", error);
      alert("Failed to load toss data");
    } finally {
      setIsFetching(false);
    }
  };

  // Update toss
  const updateToss = async (data: TossData) => {
    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/matches/${matchId}/toss`,
        {
          method: "PATCH",
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
      console.error("Error updating toss:", error);
      throw error;
    }
  };

  const handleInputChange = (field: keyof TossData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.toss_winner_team_id === 0) {
      alert("Please select a team that won the toss");
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateToss(formData);
      console.log("Toss updated successfully:", result.data);

      // Update toss state directly
      if (result.data) {
        setToss(result.data);
      }

      setIsDialogOpen(false);
      setTimeout(() => {
        refreshMatchData();
      }, 500);
    } catch (error) {
      console.error("Failed to update toss:", error);
      alert("Failed to update toss. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  useEffect(() => {
    if (toss && toss.winner_team_id) {
      setFormData({
        toss_winner_team_id: parseInt(toss.winner_team_id),
        toss_decision: toss.decision as "BAT" | "BOWL",
      });
    }
  }, [toss]);

  useEffect(() => {
    fetchTossData();
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Coins className="h-4 w-4 mr-2" />
          Manage Toss
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Toss Management</DialogTitle>
          <DialogDescription>
            Set or update the toss details for this match.
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading toss data...</span>
          </div>
        ) : (
          <>
            {/* Current Toss Status */}
            {currentToss && currentToss.winner_team_id && (
              <div className="p-4 bg-muted rounded-lg mb-4">
                <h4 className="font-medium mb-2">Current Toss Status:</h4>
                <p className="text-sm text-muted-foreground">
                  {currentToss.summary}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toss_winner">Toss Winner</Label>
                <Select
                  value={formData.toss_winner_team_id.toString()}
                  onValueChange={(value) =>
                    handleInputChange("toss_winner_team_id", parseInt(value))
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select team that won the toss" />
                  </SelectTrigger>
                  <SelectContent>
                    {matchDetails?.team_a && (
                      <SelectItem value={matchDetails.team_a.team_id}>
                        {matchDetails.team_a.full_name} (
                        {matchDetails.team_a.short_name})
                      </SelectItem>
                    )}
                    {matchDetails?.team_b && (
                      <SelectItem value={matchDetails.team_b.team_id}>
                        {matchDetails.team_b.full_name} (
                        {matchDetails.team_b.short_name})
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toss_decision">Toss Decision</Label>
                <Select
                  value={formData.toss_decision}
                  onValueChange={(value) =>
                    handleInputChange("toss_decision", value)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select toss decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAT">Bat First</SelectItem>
                    <SelectItem value="BOWL">Bowl First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || isFetching}>
                  {isLoading ? "Updating..." : "Update Toss"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
