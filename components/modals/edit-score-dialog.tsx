/** @format */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
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

interface ScoreData {
  lastWicket: { value: number; label: string };
  last5Overs: { value: number; label: string };
  dls: { value: number; label: string };
  runRate: { value: number; label: string };
  drs: { value: number; label: string };
  overRate: { value: number; label: string };
  cutOff: { value: number; label: string };
  oversRem: { value: number; label: string };
}

interface EditScoreDialogProps {
  rightSideData: {
    lastWicket: { value: number; label: string };
    last5Overs: { value: number; label: string };
    dls: { value: number; label: string };
    runRate: { value: number; label: string };
  };
  leftSideData: {
    drs: { value: number; label: string };
    overRate: { value: number; label: string };
    cutOff: { value: number; label: string };
    oversRem: { value: number; label: string };
  };
  onSave: (updatedData: {
    rightSideData: EditScoreDialogProps["rightSideData"];
    leftSideData: EditScoreDialogProps["leftSideData"];
  }) => void;
}

export default function EditScoreDialog({
  rightSideData,
  leftSideData,
  onSave,
}: EditScoreDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ScoreData>({
    lastWicket: rightSideData.lastWicket,
    last5Overs: rightSideData.last5Overs,
    dls: rightSideData.dls,
    runRate: rightSideData.runRate,
    drs: leftSideData.drs,
    overRate: leftSideData.overRate,
    cutOff: leftSideData.cutOff,
    oversRem: leftSideData.oversRem,
  });

  // Update form data when props change
  useEffect(() => {
    setFormData({
      lastWicket: rightSideData.lastWicket,
      last5Overs: rightSideData.last5Overs,
      dls: rightSideData.dls,
      runRate: rightSideData.runRate,
      drs: leftSideData.drs,
      overRate: leftSideData.overRate,
      cutOff: leftSideData.cutOff,
      oversRem: leftSideData.oversRem,
    });
  }, [rightSideData, leftSideData]);

  const handleInputChange = (field: keyof ScoreData, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Separate the data back into right and left side
      const updatedRightSideData = {
        lastWicket: formData.lastWicket,
        last5Overs: formData.last5Overs,
        dls: formData.dls,
        runRate: formData.runRate,
      };

      const updatedLeftSideData = {
        drs: formData.drs,
        overRate: formData.overRate,
        cutOff: formData.cutOff,
        oversRem: formData.oversRem,
      };

      // Call the onSave callback
      onSave({
        rightSideData: updatedRightSideData,
        leftSideData: updatedLeftSideData,
      });

      setIsDialogOpen(false);
      alert("Score summary updated successfully!");
    } catch (error) {
      console.error("Failed to update score summary:", error);
      alert("Failed to update score summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      lastWicket: rightSideData.lastWicket,
      last5Overs: rightSideData.last5Overs,
      dls: rightSideData.dls,
      runRate: rightSideData.runRate,
      drs: leftSideData.drs,
      overRate: leftSideData.overRate,
      cutOff: leftSideData.cutOff,
      oversRem: leftSideData.oversRem,
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Score Summary</DialogTitle>
          <DialogDescription>
            Update the values for each field in the score summary.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Right Side Data Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Match Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastWicket">Last Wicket</Label>
                <Input
                  id="lastWicket"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.lastWicket.value}
                  onChange={(e) =>
                    handleInputChange(
                      "lastWicket",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last5Overs">Last 5 Overs</Label>
                <Input
                  id="last5Overs"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.last5Overs.value}
                  onChange={(e) =>
                    handleInputChange(
                      "last5Overs",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dls">DLS</Label>
                <Input
                  id="dls"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.dls.value}
                  onChange={(e) =>
                    handleInputChange("dls", parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="runRate">Run Rate</Label>
                <Input
                  id="runRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.runRate.value}
                  onChange={(e) =>
                    handleInputChange(
                      "runRate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Left Side Data Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Game Management
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drs">DRS</Label>
                <Input
                  id="drs"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.drs.value}
                  onChange={(e) =>
                    handleInputChange("drs", parseInt(e.target.value) || 0)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overRate">Over Rate</Label>
                <Input
                  id="overRate"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.overRate.value}
                  onChange={(e) =>
                    handleInputChange(
                      "overRate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cutOff">Cut-Off</Label>
                <Input
                  id="cutOff"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.cutOff.value}
                  onChange={(e) =>
                    handleInputChange("cutOff", parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oversRem">Overs Remaining</Label>
                <Input
                  id="oversRem"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.oversRem.value}
                  onChange={(e) =>
                    handleInputChange(
                      "oversRem",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>
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
              {isLoading ? "Updating..." : "Update Values"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
