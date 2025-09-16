/** @format */
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import PlayControlEdit from "../modals/play-control-dialog";
import { useMatch } from "@/context/match-context";

interface CurrentState {
  striker: {
    id: number;
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strike_rate: string;
  };
  non_striker: {
    id: number;
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strike_rate: string;
  };
  bowler: {
    id: number;
    name: string;
    overs: string;
    maidens: number;
    runs: number;
    wickets: number;
    economy: string;
  };
  this_over: {
    runs: string;
    balls: string;
    fours: string;
    sixes: string;
  };
}

export default function PlayControl() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { liveStatus, canEdit, setCanEdit } = useMatch();
  const [currentState, setCurrentState] = useState<CurrentState | null>(null);

  // Replace fetchBatsmanStats and fetchBowlerStats with:
  const fetchCurrentState = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/ballByBall/innings/1/current-state"
      );
      const data = await response.json();
      if (data.success) {
        setCurrentState(data.data.current_state);
      }
    } catch (error) {
      console.error("Error fetching current state:", error);
    }
  };

  useEffect(() => {
    fetchCurrentState();
  }, []);

  const striker = currentState?.striker;
  const nonStriker = currentState?.non_striker;
  const currentBowler = currentState?.bowler;
  const thisOver = currentState?.this_over;

  return (
    <>
      {" "}
      <PlayControlEdit open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <Card className="col-span-1">
        <CardHeader className="flex justify-between items-center border-b">
          <CardTitle>Play Control</CardTitle>
          <div className="w-10 h-auto aspect-square">
            {canEdit && (
              <Button
                className="col-span-1 aspect-square mx-1"
                onClick={() => setIsDialogOpen(true)}>
                <Edit />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-7">
          {/* left col */}
          <div className="col-span-2 flex-col gap-2 flex pt-10">
            {/* <div className="grid grid-cols-12 w-full">
              <Label className="col-span-3">Striker :</Label>
              <p className="col-span-9 px-3 py-2 border rounded-md">
                {liveStatus?.current_batsmen?.find((b) => b.is_striker)
                  ?.player_name || "No Striker"}
              </p>
            </div>

            <div className="grid grid-cols-12 w-full">
              <Label className="col-span-3">Non-Striker :</Label>
              <p className="col-span-9 px-3 py-2 border rounded-md">
                {liveStatus?.current_batsmen?.find((b) => !b.is_striker)
                  ?.player_name || "No Non-Striker"}
              </p>
            </div> */}

            <div className="grid grid-cols-12 w-full">
              <Label className="col-span-3">Striker :</Label>
              <p className="col-span-9 px-3 py-2 border rounded-md">
                {striker?.name || "No Striker"}
              </p>
            </div>

            <div className="grid grid-cols-12 w-full">
              <Label className="col-span-3">Non-Striker :</Label>
              <p className="col-span-9 px-3 py-2 border rounded-md">
                {nonStriker?.name || "No Non-Striker"}
              </p>
            </div>

            <div className="grid grid-cols-12 w-full pt-1">
              <Label className="col-span-2">This Over :</Label>
              <div className="w-full col-span-9"></div>
              <p className="text-center"></p>
            </div>
          </div>
          {/* middle col */}
          <div className="grid grid-cols-4 col-span-1 text-center pl-6">
            {/* RUNS */}
            <div className="flex flex-col gap-[18px]">
              <p className="border-2 border-white/0 font-semibold">R</p>
              {/* Striker RUNS */}
              <p className="border-2 border-white/0">{striker?.runs || 0}</p>
              {/* Non-Striker RUNS */}
              <p className="border-2 border-white/0">{nonStriker?.runs || 0}</p>
              {/* This Over RUNS */}
              <p className="border-2 border-white/0"> {thisOver?.runs || 0}</p>
            </div>
            {/* BALLS */}
            <div className="flex flex-col gap-[18px]">
              <p className="border-2 border-white/0 font-semibold">B</p>
              {/* Striker BALLS */}
              <p className="border-2 border-white/0">{striker?.balls || 0}</p>
              {/* Non-striker BALLS */}
              <p className="border-2 border-white/0">
                {nonStriker?.balls || 0}
              </p>
              {/* this over BALLS */}
              <p className="border-2 border-white/0"> {thisOver?.balls || 0}</p>
            </div>
            {/* FOURS */}
            <div className="flex flex-col gap-[18px]">
              <p className="border-2 border-white/0 font-semibold">4</p>
              {/* Striker FOURS */}
              <p className="border-2 border-white/0">{striker?.fours || 0}</p>
              {/* Non-Striker FOURS */}
              <p className="border-2 border-white/0">
                {nonStriker?.fours || 0}
              </p>
              {/* this over FOURS */}
              <p className="border-2 border-white/0"> {thisOver?.fours || 0}</p>
            </div>
            {/* SIXES */}
            <div className="flex flex-col gap-[18px]">
              <p className="border-2 border-white/0 font-semibold">6</p>
              {/* striker SIXES */}
              <p className="border-2 border-white/0">{striker?.sixes || 0}</p>
              {/* non-striker SIXES */}
              <p className="border-2 border-white/0">
                {nonStriker?.sixes || 0}
              </p>
              {/* this over SIXES */}
              <p className="border-2 border-white/0"> {thisOver?.sixes || 0}</p>
            </div>
          </div>
          {/* right col */}
          <div className="col-span-4 pt-8 flex flex-col gap-2">
            <div className="grid grid-cols-12 w-full items-center">
              <Label className="col-span-2">Bowler :</Label>
              <p className="col-span-6 px-3 py-2 border rounded-md">
                {currentBowler?.name || "No Bowler"}
              </p>
              {/* empty div */}
              <div className="" />
              <div className="col-span-3 grid grid-cols-4 text-center -translate-y-4">
                <div className="flex flex-col">
                  <p>O</p>
                  {/* Bowler overs */}
                  <p>{currentBowler?.overs || "0"}</p>
                </div>
                <div className="flex flex-col">
                  <p>M</p>
                  {/* Bowler Mains/dots */}
                  <p>{currentBowler?.maidens || "0"}</p>
                </div>
                <div className="flex flex-col">
                  <p>R</p>
                  {/* Bowler Runs */}
                  <p>{currentBowler?.runs || "0"}</p>
                </div>
                <div className="flex flex-col">
                  <p>W</p>
                  {/* Bowler Wickets */}
                  <p>{currentBowler?.wickets || "0"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 w-full items-center">
              <Label className="col-span-2">Over.Ball :</Label>
              <div className="col-span-6 flex gap-1 items-center">
                <p className="px-3 py-2 border rounded-md flex-1 text-center">
                  {liveStatus?.last_ball?.over_number != null
                    ? liveStatus.last_ball.over_number - 1
                    : "N/A"}
                </p>
                <p className="text-center">.</p>
                <p className="px-3 py-2 border rounded-md flex-1 text-center">
                  {liveStatus?.last_ball?.ball_number || "N/A"}
                </p>
              </div>
              {/* empty div */}
              <div className="" />

              <Button
                className={`col-span-3 text-center ${canEdit ? "bg-yellow-400 hover:bg-yellow-600" : "bg-blue-400 hover:bg-blue-600" }`}
                onClick={() => setCanEdit(!canEdit)}>
                {canEdit ? "LOCK" : "UNLOCK"}
              </Button>
            </div>

            <div className="grid grid-cols-12 w-full items-center">
              <div className="col-span-9"></div>
              <div className="col-span-3">
                {canEdit && (
                  <Button className=" w-full text-center">End Ball</Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
