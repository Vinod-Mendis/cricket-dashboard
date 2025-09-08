/** @format */

"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Users, Plus, Search, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

interface Team {
  id: string;
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

function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    team_name: "",
    short_name: "",
    primary_color: "#006600",
    secondary_color: "#FFFFFF",
    extra_color: "#FF0000",
    flag: "",
    logo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/teams",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setOpen(false);
        setFormData({
          team_name: "",
          short_name: "",
          primary_color: "#006600",
          secondary_color: "#FFFFFF",
          extra_color: "#FF0000",
          flag: "",
          logo: "",
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team_name">Team Name *</Label>
              <Input
                id="team_name"
                value={formData.team_name}
                onChange={(e) =>
                  setFormData({ ...formData, team_name: e.target.value })
                }
                placeholder="e.g., Pakistan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_name">Short Name *</Label>
              <Input
                id="short_name"
                value={formData.short_name}
                onChange={(e) =>
                  setFormData({ ...formData, short_name: e.target.value })
                }
                placeholder="e.g., PAK"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color *</Label>
              <Input
                id="primary_color"
                type="color"
                value={formData.primary_color}
                onChange={(e) =>
                  setFormData({ ...formData, primary_color: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <Input
                id="secondary_color"
                type="color"
                value={formData.secondary_color}
                onChange={(e) =>
                  setFormData({ ...formData, secondary_color: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra_color">Extra Color</Label>
              <Input
                id="extra_color"
                type="color"
                value={formData.extra_color}
                onChange={(e) =>
                  setFormData({ ...formData, extra_color: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flag">Flag URL</Label>
              <Input
                id="flag"
                type="url"
                value={formData.flag}
                onChange={(e) =>
                  setFormData({ ...formData, flag: e.target.value })
                }
                placeholder="http://example.com/flag.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
                placeholder="http://example.com/logo.png"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditTeamDialog({
  team,
  onUpdate,
}: {
  team: Team;
  onUpdate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    team_name: team.team_name,
    short_name: team.short_name,
    primary_color: team.primary_color,
    secondary_color: team.secondary_color || "#FFFFFF",
    extra_color: team.extra_color || "#FF0000",
    flag: team.flag || "",
    logo: team.logo || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/teams/${team.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setOpen(false);
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating team:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team_name">Team Name *</Label>
              <Input
                id="team_name"
                value={formData.team_name}
                onChange={(e) =>
                  setFormData({ ...formData, team_name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_name">Short Name *</Label>
              <Input
                id="short_name"
                value={formData.short_name}
                onChange={(e) =>
                  setFormData({ ...formData, short_name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color *</Label>
              <Input
                id="primary_color"
                type="color"
                value={formData.primary_color}
                onChange={(e) =>
                  setFormData({ ...formData, primary_color: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <Input
                id="secondary_color"
                type="color"
                value={formData.secondary_color}
                onChange={(e) =>
                  setFormData({ ...formData, secondary_color: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra_color">Extra Color</Label>
              <Input
                id="extra_color"
                type="color"
                value={formData.extra_color}
                onChange={(e) =>
                  setFormData({ ...formData, extra_color: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flag">Flag URL</Label>
              <Input
                id="flag"
                type="url"
                value={formData.flag}
                onChange={(e) =>
                  setFormData({ ...formData, flag: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TeamCard({ team, onUpdate }: { team: Team; onUpdate: () => void }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on action buttons or their children
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("[role='dialog']") ||
      target.closest(".dialog-content")
    ) {
      return;
    }
    router.push(`/teams/${team.id}`);
  };
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete ${team.team_name}?`)) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/teams/${team.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <Image
            src={team.logo || "/placeholder.svg"}
            alt={`${team.team_name} logo`}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">
              {team.team_name}
            </CardTitle>
            <p className="text-muted-foreground">{team.short_name}</p>
          </div>
          <div
            className="flex items-center gap-2"
            style={{ backgroundColor: team.primary_color }}>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: team.primary_color }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Team Colors</span>
          </div>
          <div className="flex gap-1">
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: team.primary_color }}
            />
            {team.secondary_color && (
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: team.secondary_color }}
              />
            )}
            {team.extra_color && (
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: team.extra_color }}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <EditTeamDialog team={team} onUpdate={onUpdate} />
          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-destructive hover:text-destructive bg-transparent"
            onClick={handleDelete}
            disabled={deleting}>
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/teams"
      );
      if (response.ok) {
        const data = await response.json();
        setTeams(data.data || []);
        setFilteredTeams(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchTeams = async (query: string) => {
    if (!query.trim()) {
      setFilteredTeams(teams);
      return;
    }

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/teams/search?q=${encodeURIComponent(
          query
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredTeams(data.data || []);
      }
    } catch (error) {
      console.error("Error searching teams:", error);
      // Fallback to local filtering
      const filtered = teams.filter(
        (team) =>
          team.team_name.toLowerCase().includes(query.toLowerCase()) ||
          team.short_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTeams(filtered);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchTeams(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, teams]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Cricket Teams</h1>
          <p className="text-muted-foreground mt-2">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">Cricket Teams</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view all cricket teams and their details
            </p>
          </div>
          <CreateTeamDialog />
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search teams by name or short name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => (
          <TeamCard key={team.id} team={team} onUpdate={fetchTeams} />
        ))}
      </div>

      {filteredTeams.length === 0 && !loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No Teams Found" : "No Teams Available"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? `No teams match "${searchQuery}". Try a different search term.`
                  : "There are currently no teams registered. Create your first team to get started."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
