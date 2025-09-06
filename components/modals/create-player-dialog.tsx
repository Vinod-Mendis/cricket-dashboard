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
  DialogTrigger,
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
import { Plus } from "lucide-react";

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

interface CreatePlayerDialogProps {
  /** Optional team ID to pre-select */
  teamId?: string | number | null;
  /** Optional team name for display */
  teamName?: string;
  /** Callback function called when a player is successfully created */
  onPlayerCreated: () => void;
  /** Custom trigger button text */
  triggerText?: string;
  /** Custom trigger button variant */
  triggerVariant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary";
  /** Whether to show team selection dropdown */
  showTeamSelection?: boolean;
  /** Custom CSS classes for the trigger button */
  triggerClassName?: string;
}

export function CreatePlayerDialog({
  teamId = null,
  teamName,
  onPlayerCreated,
  triggerText = "Create Player",
  triggerVariant = "default",
  showTeamSelection = true,
  triggerClassName = "",
}: CreatePlayerDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    role: "",
    batting_style: "",
    bowling_style: "",
    age: "",
    image: "",
    shirt_number: "",
    team_id: teamId ? String(teamId) : "",
    last_match_date: "",
    career_span: "",
  });

  // Fetch teams when dialog opens and team selection is enabled
  useEffect(() => {
    if (open && showTeamSelection) {
      fetchTeams();
    }
  }, [open, showTeamSelection]);

  // Update form data when teamId prop changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      team_id: teamId ? String(teamId) : "",
    }));
  }, [teamId]);

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

  const resetForm = () => {
    setFormData({
      name: "",
      short_name: "",
      role: "",
      batting_style: "",
      bowling_style: "",
      age: "",
      image: "",
      shirt_number: "",
      team_id: teamId ? String(teamId) : "",
      last_match_date: "",
      career_span: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const playerData = {
        ...formData,
        age: Number.parseInt(formData.age) || 0,
        shirt_number: Number.parseInt(formData.shirt_number) || 0,
        team_id:
          formData.team_id === "none" || !formData.team_id
            ? null
            : Number.parseInt(formData.team_id),
      };

      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/players",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playerData),
        }
      );

      const data = await response.json();
      if (data.success || response.ok) {
        setOpen(false);
        resetForm();
        onPlayerCreated();
      } else {
        console.error("Failed to create player:", data.message);
        // You could add toast notification here
      }
    } catch (error) {
      console.error("Error creating player:", error);
      // You could add toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          className={`flex items-center gap-2 ${triggerClassName}`}>
          <Plus className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {teamName
              ? `Create New Player for ${teamName}`
              : "Create New Player"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Rohit Sharma"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_name">Short Name</Label>
              <Input
                id="short_name"
                value={formData.short_name}
                onChange={(e) =>
                  setFormData({ ...formData, short_name: e.target.value })
                }
                placeholder="e.g., R. Sharma"
              />
            </div>
          </div>

          {/* Role and Team */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }>
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
                <Label htmlFor="team">Team</Label>
                <Select
                  value={formData.team_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, team_id: value })
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
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
              <Label htmlFor="batting_style">Batting Style</Label>
              <Select
                value={formData.batting_style}
                onValueChange={(value) =>
                  setFormData({ ...formData, batting_style: value })
                }>
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
              <Label htmlFor="bowling_style">Bowling Style</Label>
              <Select
                value={formData.bowling_style}
                onValueChange={(value) =>
                  setFormData({ ...formData, bowling_style: value })
                }>
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
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="e.g., 35"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shirt_number">Shirt Number</Label>
              <Input
                id="shirt_number"
                type="number"
                value={formData.shirt_number}
                onChange={(e) =>
                  setFormData({ ...formData, shirt_number: e.target.value })
                }
                placeholder="e.g., 45"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="http://example.com/player.jpg"
            />
          </div>

          {/* Last Match Date and Career Span */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last_match_date">Last Match Date</Label>
              <Input
                id="last_match_date"
                type="date"
                value={formData.last_match_date}
                onChange={(e) =>
                  setFormData({ ...formData, last_match_date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="career_span">Career Span</Label>
              <Input
                id="career_span"
                value={formData.career_span}
                onChange={(e) =>
                  setFormData({ ...formData, career_span: e.target.value })
                }
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
              disabled={loading || !formData.name || !formData.role}>
              {loading ? "Creating..." : "Create Player"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
