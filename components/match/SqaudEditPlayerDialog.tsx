/** @format */

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Player {
  player_id: number;
  player_name: string;
  player_short_name?: string;
  player_role: string;
  is_playing: boolean;
  is_captain: boolean;
  is_wicketkeeper: boolean;
}

interface EditPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  onSuccess: () => void;
  loading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

export default function EditPlayerDialog({
  open,
  onOpenChange,
  player,
  onSuccess,
  loading,
  onLoadingChange,
}: EditPlayerDialogProps) {
  const [editFormData, setEditFormData] = useState({
    name: "",
    short_name: "",
    role: "",
  });

  // Update form data when player changes
  useEffect(() => {
    if (player) {
      setEditFormData({
        name: player.player_name,
        short_name: player.player_short_name || "",
        role: player.player_role,
      });
    }
  }, [player]);

  const editPlayer = async () => {
    if (!player) return;

    onLoadingChange(true);

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/players/${player.player_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update player");
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating player:", error);
      alert("Failed to update player. Please try again.");
    } finally {
      onLoadingChange(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setEditFormData({ name: "", short_name: "", role: "" });
  };

  if (!player) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
          <DialogDescription>
            Update player information for <strong>{player.player_name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Player Name:</label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter player name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Short Name:</label>
            <input
              type="text"
              value={editFormData.short_name}
              onChange={(e) =>
                setEditFormData((prev) => ({
                  ...prev,
                  short_name: e.target.value,
                }))
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter short name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role:</label>
            <Select
              value={editFormData.role}
              onValueChange={(value) =>
                setEditFormData((prev) => ({ ...prev, role: value }))
              }>
              <SelectTrigger className="w-full mt-1">
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
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={editPlayer}
            disabled={
              !editFormData.name ||
              !editFormData.short_name ||
              !editFormData.role ||
              loading
            }>
            {loading ? "Updating..." : "Update Player"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
