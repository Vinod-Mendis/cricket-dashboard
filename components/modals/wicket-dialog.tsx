/** @format */

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const WICKET_TYPES = [
  "BOWLED",
  "CAUGHT",
  "LBW",
  "RUN_OUT",
  "STUMPED",
  "HIT_WICKET",
  "RETIRED_HURT",
  "RETIRED_OUT",
  "OBSTRUCTING",
  "HIT_BALL_TWICE",
  "HANDLED_BALL",
  "TIMED_OUT",
] as const;

interface WicketDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentBatsmen: Array<{
    player_id: number;
    player_name: string;
    is_striker: boolean;
  }>;
  onWicketSubmit: (wicketData: {
    wicket_type: string;
    dismissed_player_id: number;
    fielder_id?: number;
  }) => void;
}

export default function WicketDialog({
  isOpen,
  onOpenChange,
  currentBatsmen,
  onWicketSubmit,
}: WicketDialogProps) {
  const [wicketType, setWicketType] = useState<string>("");
  const [dismissedPlayerId, setDismissedPlayerId] = useState<string>("");
  const [fielderId, setFielderId] = useState<string>("");

  const FIELDERS = [
    { id: 1, name: "Fielder 1" },
    { id: 2, name: "Fielder 2" },
    { id: 3, name: "Fielder 3" },
    { id: 4, name: "Fielder 4" },
  ] as const;

  const handleSubmit = () => {
    if (wicketType && dismissedPlayerId) {
      const wicketData = {
        wicket_type: wicketType,
        dismissed_player_id: parseInt(dismissedPlayerId),
        ...(shouldShowFielder() &&
          fielderId && { fielder_id: parseInt(fielderId) }),
      };

      onWicketSubmit(wicketData);

      // Reset form
      setWicketType("");
      setDismissedPlayerId("");
      setFielderId("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setWicketType("");
    setDismissedPlayerId("");
    setFielderId("");
    onOpenChange(false);
  };

  const shouldShowFielder = () => {
    return wicketType === "CAUGHT" || wicketType === "RUN_OUT";
  };

  const isFormValid =
    wicketType && dismissedPlayerId && (!shouldShowFielder() || fielderId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Wicket Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Wicket Type Selection */}
          <div className="grid gap-2">
            <Label htmlFor="wicket-type">Wicket Type</Label>
            <Select value={wicketType} onValueChange={setWicketType}>
              <SelectTrigger>
                <SelectValue placeholder="Select wicket type" />
              </SelectTrigger>
              <SelectContent>
                {WICKET_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dismissed Player Selection */}
          <div className="grid gap-2">
            <Label htmlFor="dismissed-player">Dismissed Player</Label>
            <Select
              value={dismissedPlayerId}
              onValueChange={setDismissedPlayerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select dismissed player" />
              </SelectTrigger>
              <SelectContent>
                {currentBatsmen.map((batsman) => (
                  <SelectItem
                    key={batsman.player_id}
                    value={batsman.player_id.toString()}>
                    {batsman.player_name} (
                    {batsman.is_striker ? "Striker" : "Non-Striker"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fielder Selection - only show for CAUGHT and RUN_OUT */}
          {shouldShowFielder() && (
            <div className="grid gap-2">
              <Label htmlFor="fielder">Fielder</Label>
              <Select value={fielderId} onValueChange={setFielderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fielder" />
                </SelectTrigger>
                <SelectContent>
                  {FIELDERS.map((fielder) => (
                    <SelectItem key={fielder.id} value={fielder.id.toString()}>
                      {fielder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Dialog Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-red-600 hover:bg-red-700 text-white">
            Confirm Wicket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
