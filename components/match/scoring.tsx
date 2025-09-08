/** @format */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function Scoring() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [dialogContext, setDialogContext] = useState({ section: "", type: "" });

  const handleQuestionMarkClick = (section: string, type: string) => {
    setDialogContext({ section, type });
    setCustomValue("");
    setIsDialogOpen(true);
  };

  const handleSubmitCustomValue = () => {
    if (customValue.trim()) {
      // Here you can handle the custom value submission
      console.log(`Custom value for ${dialogContext.section}: ${customValue}`);
      // Add your logic here to process the custom value
      setIsDialogOpen(false);
      setCustomValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmitCustomValue();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Scoring</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-8 gap-1">
          {/* Wicket + Pen column */}
          <div className="grid grid-rows-2 gap-1">
            <Button className="h-full bg-red-500 text-white">Wicket</Button>
            <Button className="h-full bg-teal-500 text-white">Pen</Button>
          </div>

          {/* Runs */}
          <div className="flex flex-col p-1 pb-0">
            <div className="text-center font-semibold bg-blue-900 text-white">
              Runs
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {[0, 1, 2, 3, 4, 6, 5, "?"].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  className={`h-10 ${val === "?" ? "col-span-2" : ""}`}
                  onClick={() =>
                    val === "?" ? handleQuestionMarkClick("Runs", "runs") : null
                  }>
                  {val}
                </Button>
              ))}
            </div>
          </div>

          {/* Wides */}
          <div className="flex flex-col p-1 pb-0">
            <div className="text-center font-semibold bg-blue-900 text-white">
              Wides
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {["w", "+1", "+2", "+3", "+4", "?"].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  className="h-10"
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick("Wides", "wides")
                      : null
                  }>
                  {val}
                </Button>
              ))}
            </div>
          </div>

          {/* Byes */}
          <div className="flex flex-col p-1 pb-0">
            <div className="text-center font-semibold bg-blue-900 text-white">
              Byes
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {[1, 2, 3, 4, "?"].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  className={`h-10 ${val === "?" ? "col-span-2" : ""}`}>
                  {val}
                </Button>
              ))}
            </div>
          </div>

          {/* Leg Byes */}
          <div className="flex flex-col p-1 pb-0">
            <div className="text-center font-semibold bg-blue-900 text-white">
              Leg Byes
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {[1, 2, 3, 4, "?"].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  className={`h-10 ${val === "?" ? "col-span-2" : ""}`}>
                  {val}
                </Button>
              ))}
            </div>
          </div>

          {/* No Ball (b) */}
          <div className="flex flex-col p-1 pb-0">
            <div className="text-center font-semibold bg-blue-900 text-white">
              No Ball (b)
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {[1, 2, 3, 4, "?"].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  className={`h-10 ${val === "?" ? "col-span-2" : ""}`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick("No Ball (b)", "no-ball-b")
                      : null
                  }>
                  {val}
                </Button>
              ))}
            </div>
          </div>

          {/* No Ball (lb) */}
          <div className="flex flex-col p-1 pb-0">
            <div className="text-center font-semibold bg-blue-900 text-white">
              No Ball (lb)
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {[1, 2, 3, 4, "?"].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  className={`h-10 ${val === "?" ? "col-span-2" : ""}`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick("No Ball (lb)", "no-ball-lb")
                      : null
                  }>
                  {val}
                </Button>
              ))}
            </div>
          </div>

          {/* No Ball (Runs) */}
          <div className="flex flex-col p-1 pb-0">
            <div className="text-center font-semibold bg-blue-900 text-white">
              No Ball (Runs)
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {[0, 1, 2, 3, 4, 6, "?"].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  className={`h-10 ${val === "?" ? "col-span-3" : ""}`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick(
                          "No Ball (Runs)",
                          "no-ball-runs"
                        )
                      : null
                  }>
                  {val}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Value Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>
              Enter Custom Value for {dialogContext.section}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="custom-value" className="text-right">
                Value
              </Label>
              <Input
                id="custom-value"
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="col-span-3"
                placeholder="Enter custom value"
                autoFocus
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCustomValue}
              disabled={!customValue.trim()}>
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
