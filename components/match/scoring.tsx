/** @format */
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMatch } from "@/context/match-context";
import WicketDialog from "../modals/wicket-dialog";

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
  const { liveStatus, ballEvent, setBallEvent, inningId, canEdit } = useMatch();
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
  const [isWicketDialogOpen, setIsWicketDialogOpen] = useState(false);

  useEffect(() => {
    if (!ballEvent) {
      setBallEvent({
        innings_id: inningId ?? 0,
        over_number: 0,
        ball_number: 0,
        legal_ball: true,
        bowler_id: null,
        striker_id: null,
        non_striker_id: null,
        runs_scored: 0,
        extras: 0,
        ball_type: "LEGAL",
        is_wicket: false,
        wicket_type: null,
        dismissed_player_id: null,
        fielder_id: null,
        shot_type: null,
        fielding_position: null,
        commentary: "N/A",
        team_score: 0,
        team_wickets: 0,
      });
    }
  }, [ballEvent, setBallEvent]);

  const handleWicketClick = () => {
    setIsWicketDialogOpen(true);
  };

  const handleWicketSubmit = (wicketData: {
    wicket_type: string;
    dismissed_player_id: number;
    fielder_id?: number;
  }) => {
    if (ballEvent) {
      setBallEvent({
        ...ballEvent,
        is_wicket: true,
        wicket_type: wicketData.wicket_type,
        dismissed_player_id: wicketData.dismissed_player_id,
        fielder_id: wicketData.fielder_id || null,
      });
    }

    setSelectedButtons((prev) => ({
      ...prev,
      wicket: "wicket",
    }));
  };

  useEffect(() => {
    console.log("Ball Event Updated:", ballEvent);
  }, [ballEvent]);

  const extrasTypes: SectionType[] = [
    "wides",
    "byes",
    "leg_byes",
    "no_ball_b",
    "no_ball_lb",
    "no_ball_runs",
  ];

  const updateBallEvent = () => {
    if (!ballEvent) return; // Early return if ballEvent is null

    const newEvent = { ...ballEvent };

    // Reset to defaults
    newEvent.runs_scored = 0;
    newEvent.extras = 0;
    newEvent.legal_ball = true;
    newEvent.ball_type = "LEGAL";

    // Set runs from runs section
    if (selectedButtons.runs !== null) {
      newEvent.runs_scored =
        typeof selectedButtons.runs === "number"
          ? selectedButtons.runs
          : Number.parseInt(selectedButtons.runs as string);
    }

    // Check for extras (only one should be selected)
    const selectedExtras = extrasTypes.find(
      (type) => selectedButtons[type] !== null
    );

    if (selectedExtras) {
      const extrasValue = selectedButtons[selectedExtras];

      switch (selectedExtras) {
        case "wides":
          newEvent.ball_type = "WIDE";
          newEvent.legal_ball = false;
          if (extrasValue === "w") {
            newEvent.extras += 0;
          } else {
            newEvent.extras +=
              typeof extrasValue === "number"
                ? extrasValue
                : Number.parseInt(extrasValue as string);
          }
          break;

        case "byes":
          newEvent.ball_type = "BYE";
          newEvent.legal_ball = true;
          newEvent.extras +=
            typeof extrasValue === "number"
              ? extrasValue
              : Number.parseInt(extrasValue as string);
          break;

        case "leg_byes":
          newEvent.ball_type = "LEG_BYE";
          newEvent.legal_ball = true;
          newEvent.extras +=
            typeof extrasValue === "number"
              ? extrasValue
              : Number.parseInt(extrasValue as string);
          break;

        case "no_ball_b":
          newEvent.ball_type = "NO_BALL";
          newEvent.legal_ball = false;
          newEvent.extras +=
            typeof extrasValue === "number"
              ? extrasValue
              : Number.parseInt(extrasValue as string);
          break;

        case "no_ball_lb":
          newEvent.ball_type = "NO_BALL";
          newEvent.legal_ball = false;
          newEvent.extras +=
            typeof extrasValue === "number"
              ? extrasValue
              : Number.parseInt(extrasValue as string);
          break;

        case "no_ball_runs":
          newEvent.ball_type = "NO_BALL";
          newEvent.legal_ball = false;
          newEvent.extras +=
            typeof extrasValue === "number"
              ? extrasValue
              : Number.parseInt(extrasValue as string);
          break;
      }
    }

    // Handle wicket
    if (selectedButtons.wicket !== null) {
      newEvent.is_wicket = true;
    } else {
      newEvent.is_wicket = false;
      newEvent.wicket_type = null;
      newEvent.dismissed_player_id = null;
      newEvent.fielder_id = null;
    }

    // Set the updated ballEvent (not using a function anymore)
    setBallEvent(newEvent);
  };

  const handleQuestionMarkClick = (section: string, type: string) => {
    setDialogContext({ section, type });
    setCustomValue("");
    setIsDialogOpen(true);
  };

  const handleButtonClick = (section: SectionType, value: string | number) => {
    setSelectedButtons((prev) => {
      const newSelected = { ...prev };

      // If clicking an extras type, clear all other extras types
      if (extrasTypes.includes(section)) {
        extrasTypes.forEach((type) => {
          if (type !== section) {
            newSelected[type] = null;
          }
        });
      }

      // Toggle the clicked button
      newSelected[section] = prev[section] === value ? null : value;

      return newSelected;
    });
  };

  //  Sync bowler and batsmen from liveStatus
  useEffect(() => {
    if (liveStatus?.current_batsmen && ballEvent) {
      setBallEvent({
        ...ballEvent,
        striker_id:
          liveStatus.current_batsmen.find((batsman) => batsman.is_striker)
            ?.player_id || null,
        non_striker_id:
          liveStatus.current_batsmen.find((batsman) => !batsman.is_striker)
            ?.player_id || null,
        bowler_id: liveStatus.current_bowler?.bowler_id || ballEvent.bowler_id,
        ball_number: liveStatus?.last_ball?.ball_number || 0,
        over_number: liveStatus?.last_ball?.over_number || 0,
      });
    }
  }, [liveStatus, setBallEvent]);

  // Update ball event whenever selectedButtons changes
  useEffect(() => {
    updateBallEvent();
  }, [selectedButtons]);

  const handleSubmitCustomValue = () => {
    if (customValue.trim()) {
      const sectionKey = dialogContext.type as SectionType;
      const numericValue = Number(customValue);

      setSelectedButtons((prev) => {
        const newSelected = { ...prev };

        // If setting an extras type, clear all other extras types
        if (extrasTypes.includes(sectionKey)) {
          extrasTypes.forEach((type) => {
            if (type !== sectionKey) {
              newSelected[type] = null;
            }
          });
        }

        newSelected[sectionKey] = numericValue;
        return newSelected;
      });

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
      <WicketDialog
        isOpen={isWicketDialogOpen}
        onOpenChange={setIsWicketDialogOpen}
        currentBatsmen={liveStatus?.current_batsmen || []}
        onWicketSubmit={handleWicketSubmit}
      />
      <Card>
        <CardHeader>
          <CardTitle>Scoring</CardTitle>
          <div className="text-sm text-gray-600 mt-2 grid grid-cols-6 gap-2">
            <div>Ball Type: {ballEvent?.ball_type}</div>
            <div>Runs Scored: {ballEvent?.runs_scored}</div>
            <div>Extras: {ballEvent?.extras}</div>
            <div>Legal Ball: {ballEvent?.legal_ball ? "Yes" : "No"}</div>
            <div>Is Wicket: {ballEvent?.is_wicket ? "Yes" : "No"}</div>
            <div>Innings ID: {ballEvent?.innings_id}</div>
            <div>Over: {ballEvent?.over_number}</div>
            <div>Ball: {ballEvent?.ball_number}</div>
            <div>Bowler ID: {ballEvent?.bowler_id || "N/A"}</div>
            <div>Striker ID: {ballEvent?.striker_id || "N/A"}</div>
            <div>Non-Striker ID: {ballEvent?.non_striker_id || "N/A"}</div>
            <div>Team Score: {ballEvent?.team_score}</div>
            <div>Team Wickets: {ballEvent?.team_wickets}</div>
            <div>Wicket Type: {ballEvent?.wicket_type || "N/A"}</div>
            <div>
              Dismissed Player: {ballEvent?.dismissed_player_id || "N/A"}
            </div>
            <div>Fielder ID: {ballEvent?.fielder_id || "N/A"}</div>
            <div>Shot Type: {ballEvent?.shot_type || "N/A"}</div>
            <div>
              Fielding Position: {ballEvent?.fielding_position || "N/A"}
            </div>
            {/* <div className="col-span-3">
              Commentary: {ballEvent.commentary || "N/A"}
            </div> */}
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-8 gap-1">
          {/* Wicket + Pen column */}
          <div className="grid grid-rows-2 gap-1">
            <Button
              disabled={!canEdit}
              className={`h-full text-white ${
                isButtonSelected("wicket", "wicket")
                  ? "bg-red-700"
                  : "bg-red-500"
              }`}
              onClick={handleWicketClick}>
              Wicket
            </Button>
            <Button
              disabled={!canEdit}
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
                  disabled={!canEdit}
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
                  disabled={!canEdit}
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
                  disabled={!canEdit}
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
                  disabled={!canEdit}
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
                  disabled={!canEdit}
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
                  disabled={!canEdit}
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
                  disabled={!canEdit}
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
