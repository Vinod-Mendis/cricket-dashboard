/** @format */
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type SectionType =
  | "wicket"
  | "pen"
  | "runs"
  | "wides"
  | "byes"
  | "leg_byes"
  | "no_ball_b"
  | "no_ball_lb"
  | "no_ball_runs";

export default function Scoring() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [dialogContext, setDialogContext] = useState({ section: "", type: "" });
  const [selectedButtons, setSelectedButtons] = useState<
    Record<SectionType, string | number | null>
  >({
    wicket: null,
    pen: null,
    runs: null,
    wides: null,
    byes: null,
    leg_byes: null,
    no_ball_b: null,
    no_ball_lb: null,
    no_ball_runs: null,
  });

  useEffect(() => {
    console.log("customValue changed:", customValue);
  }, [customValue]);

  useEffect(() => {
    console.log("dialogContext changed:", dialogContext);
  }, [dialogContext]);

  useEffect(() => {
    console.log("selectedButtons changed:", selectedButtons);
  }, [selectedButtons]);

  const handleQuestionMarkClick = (section: string, type: string) => {
    setDialogContext({ section, type });
    setCustomValue("");
    setIsDialogOpen(true);
  };

  const handleButtonClick = (section: SectionType, value: string | number) => {
    setSelectedButtons((prev) => ({
      ...prev,
      [section]: prev[section] === value ? null : value,
    }));
  };

  const handleSubmitCustomValue = () => {
    if (customValue.trim()) {
      const sectionKey = dialogContext.type as SectionType;
      const numericValue = Number(customValue);
      setSelectedButtons((prev) => ({
        ...prev,
        [sectionKey]: numericValue,
      }));
      console.log(`Custom value for ${dialogContext.section}: ${numericValue}`);
      setIsDialogOpen(false);
      setCustomValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmitCustomValue();
    }
  };

  const isButtonSelected = (
    section: SectionType,
    value: string | number
  ): boolean => {
    return selectedButtons[section] === value;
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
            <Button
              className={`h-full text-white ${
                isButtonSelected("wicket", "wicket")
                  ? "bg-red-700"
                  : "bg-red-500"
              }`}
              onClick={() => handleButtonClick("wicket", "wicket")}>
              Wicket
            </Button>
            <Button
              className={`h-full text-white ${
                isButtonSelected("pen", "pen") ? "bg-teal-700" : "bg-teal-500"
              }`}
              onClick={() => handleButtonClick("pen", "pen")}>
              Pen
            </Button>
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
                  variant={
                    val === "?"
                      ? "outline"
                      : isButtonSelected("runs", val)
                      ? "default"
                      : "outline"
                  }
                  className={`h-10 ${val === "?" ? "col-span-2" : ""} ${
                    val !== "?" && isButtonSelected("runs", val)
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick("Runs", "runs")
                      : handleButtonClick("runs", val)
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
              {["w", 1, 2, 3, 4, "?"].map((val) => (
                <Button
                  key={val}
                  variant={
                    val === "?"
                      ? "outline"
                      : isButtonSelected("wides", val)
                      ? "default"
                      : "outline"
                  }
                  className={`h-10 ${
                    val !== "?" && isButtonSelected("wides", val)
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick("Wides", "wides")
                      : handleButtonClick("wides", val)
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
                  variant={
                    val === "?"
                      ? "outline"
                      : isButtonSelected("byes", val)
                      ? "default"
                      : "outline"
                  }
                  className={`h-10 ${val === "?" ? "col-span-2" : ""} ${
                    val !== "?" && isButtonSelected("byes", val)
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick("Byes", "byes")
                      : handleButtonClick("byes", val)
                  }>
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
                  variant={
                    val === "?"
                      ? "outline"
                      : isButtonSelected("leg_byes", val)
                      ? "default"
                      : "outline"
                  }
                  className={`h-10 ${val === "?" ? "col-span-2" : ""} ${
                    val !== "?" && isButtonSelected("leg_byes", val)
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick("Leg Byes", "leg_byes")
                      : handleButtonClick("leg_byes", val)
                  }>
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
                  variant={
                    val === "?"
                      ? "outline"
                      : isButtonSelected("no_ball_b", val)
                      ? "default"
                      : "outline"
                  }
                  className={`h-10 ${val === "?" ? "col-span-2" : ""} ${
                    val !== "?" && isButtonSelected("no_ball_b", val)
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick("No Ball (b)", "no_ball_b")
                      : handleButtonClick("no_ball_b", val)
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
                  variant={
                    val === "?"
                      ? "outline"
                      : isButtonSelected("no_ball_lb", val)
                      ? "default"
                      : "outline"
                  }
                  className={`h-10 ${val === "?" ? "col-span-2" : ""} ${
                    val !== "?" && isButtonSelected("no_ball_lb", val)
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick("No Ball (lb)", "no_ball_lb")
                      : handleButtonClick("no_ball_lb", val)
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
                  variant={
                    val === "?"
                      ? "outline"
                      : isButtonSelected("no_ball_runs", val)
                      ? "default"
                      : "outline"
                  }
                  className={`h-10 ${val === "?" ? "col-span-3" : ""} ${
                    val !== "?" && isButtonSelected("no_ball_runs", val)
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    val === "?"
                      ? handleQuestionMarkClick(
                          "No Ball (Runs)",
                          "no_ball_runs"
                        )
                      : handleButtonClick("no_ball_runs", val)
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
