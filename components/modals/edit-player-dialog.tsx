/** @format */

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Player {
  id: string | number;
  name: string;
  short_name: string;
  role: string;
  batting_style: string;
  bowling_style: string;
  age: number;
  image: string;
  shirt_number: number;
  team_id: string | number | null;
  team_name: string;
  team_color: string;
  last_match_date: string;
  career_span: string;
  created_at: string;
  updated_at: string;
}

interface Team {
  id: string | number;
  team_name: string;
  short_name: string;
  primary_color: string;
  secondary_color?: string;
  extra_color?: string;
  flag?: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

interface EditPlayerDialogProps {
  /** The player being edited */
  player: Player | null;
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Function to handle dialog open/close state */
  onOpenChange: (open: boolean) => void;
  /** Callback function called when a player is successfully updated */
  onPlayerUpdated: () => void;
  /** Whether to show team selection dropdown */
  showTeamSelection?: boolean;
}

export function EditPlayerDialog({
  player,
  isOpen,
  onOpenChange,
  onPlayerUpdated,
  showTeamSelection = true,
}: EditPlayerDialogProps) {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Fetch teams when dialog opens and team selection is enabled
  useEffect(() => {
    if (isOpen && showTeamSelection) {
      fetchTeams();
    }
  }, [isOpen, showTeamSelection]);

  // Update local editing state when player prop changes
  useEffect(() => {
    if (player) {
      setEditingPlayer({ ...player });
    } else {
      setEditingPlayer(null);
    }
  }, [player]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/teams"
      );
      if (response.ok) {
        const data = await response.json();
        setTeams(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;

    setLoading(true);

    try {
      const playerData = {
        name: editingPlayer.name,
        short_name: editingPlayer.short_name,
        role: editingPlayer.role,
        batting_style: editingPlayer.batting_style,
        bowling_style: editingPlayer.bowling_style,
        age: editingPlayer.age,
        image: editingPlayer.image,
        shirt_number: editingPlayer.shirt_number,
        team_id:
          editingPlayer.team_id === "none" || !editingPlayer.team_id
            ? null
            : editingPlayer.team_id,
        last_match_date: editingPlayer.last_match_date,
        career_span: editingPlayer.career_span,
      };

      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players/${editingPlayer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playerData),
        }
      );

      const data = await response.json();
      if (data.success || response.ok) {
        handleClose();
        onPlayerUpdated();
      } else {
        console.error("Failed to update player:", data.message);
        // You could add toast notification here
      }
    } catch (error) {
      console.error("Error updating player:", error);
      // You could add toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setEditingPlayer(null);
  };

  const updateField = <K extends keyof Player>(field: K, value: Player[K]) => {
    if (!editingPlayer) return;
    setEditingPlayer({
      ...editingPlayer,
      [field]: value,
    });
  };

  if (!editingPlayer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={editingPlayer.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., Rohit Sharma"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-short_name">Short Name</Label>
              <Input
                id="edit-short_name"
                value={editingPlayer.short_name}
                onChange={(e) => updateField("short_name", e.target.value)}
                placeholder="e.g., R. Sharma"
              />
            </div>
          </div>

          {/* Role and Team */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select
                value={editingPlayer.role}
                onValueChange={(value) => updateField("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Batsman">Batsman</SelectItem>
                  <SelectItem value="Bowler">Bowler</SelectItem>
                  <SelectItem value="All-rounder">All-rounder</SelectItem>
                  <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {showTeamSelection && (
              <div className="space-y-2">
                <Label htmlFor="edit-team">Team</Label>
                <Select
                  value={
                    editingPlayer.team_id !== undefined &&
                    editingPlayer.team_id !== null
                      ? String(editingPlayer.team_id)
                      : "none"
                  }
                  onValueChange={(value) =>
                    updateField("team_id", value === "none" ? null : value)
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team">
                      {editingPlayer.team_id && editingPlayer.team_id !== "none"
                        ? teams.find(
                            (team) =>
                              String(team.id) === String(editingPlayer.team_id)
                          )?.team_name || "Unknown team"
                        : "No team"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No team</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.team_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Batting and Bowling Style */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-batting_style">Batting Style</Label>
              <Select
                value={editingPlayer.batting_style}
                onValueChange={(value) => updateField("batting_style", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batting style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right-handed">Right-handed</SelectItem>
                  <SelectItem value="Left-handed">Left-handed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bowling_style">Bowling Style</Label>
              <Select
                value={editingPlayer.bowling_style}
                onValueChange={(value) => updateField("bowling_style", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bowling style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right-arm Fast">Right-arm Fast</SelectItem>
                  <SelectItem value="Left-arm Fast">Left-arm Fast</SelectItem>
                  <SelectItem value="Right-arm Off-break">
                    Right-arm Off-break
                  </SelectItem>
                  <SelectItem value="Left-arm Orthodox">
                    Left-arm Orthodox
                  </SelectItem>
                  <SelectItem value="Right-arm Leg-break">
                    Right-arm Leg-break
                  </SelectItem>
                  <SelectItem value="Left-arm Chinaman">
                    Left-arm Chinaman
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Age and Shirt Number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                type="number"
                value={editingPlayer.age}
                onChange={(e) =>
                  updateField("age", Number.parseInt(e.target.value) || 0)
                }
                placeholder="e.g., 35"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shirt_number">Shirt Number</Label>
              <Input
                id="edit-shirt_number"
                type="number"
                value={editingPlayer.shirt_number}
                onChange={(e) =>
                  updateField(
                    "shirt_number",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="e.g., 45"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-image">Image URL</Label>
            <Input
              id="edit-image"
              value={editingPlayer.image}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="http://example.com/player.jpg"
            />
          </div>

          {/* Last Match Date and Career Span */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-last_match_date">Last Match Date</Label>
              <Input
                id="edit-last_match_date"
                type="date"
                value={formatDateForInput(editingPlayer.last_match_date)}
                onChange={(e) => updateField("last_match_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-career_span">Career Span</Label>
              <Input
                id="edit-career_span"
                value={editingPlayer.career_span}
                onChange={(e) => updateField("career_span", e.target.value)}
                placeholder="e.g., 2007-Present"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !editingPlayer.name || !editingPlayer.role}>
              {loading ? "Updating..." : "Update Player"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
