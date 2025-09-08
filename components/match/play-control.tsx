/** @format */
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Edit, Replace } from "lucide-react";
import PlayControlEdit from "../modals/play-control-dialog";

export default function PlayControl() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      {" "}
      <PlayControlEdit open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <Card className="col-span-1">
        <CardHeader className="flex justify-between">
          <CardTitle>Play Control</CardTitle>
          <Button
            className="col-span-1 aspect-square mx-1"
            onClick={() => setIsDialogOpen(true)}>
            <Edit />
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-7">
          {/* left col */}
          <div className="col-span-2 flex-col gap-2 flex pt-10">
            <div className="grid grid-cols-12 w-full">
              <Label className="col-span-2">Striker :</Label>
              <p className="col-span-9 px-3 py-2 border rounded-md">
                Player Name
              </p>
              <Button className="aspect-square ml-2">
                <Replace />{" "}
              </Button>
            </div>

            <div className="grid grid-cols-12 w-full">
              <Label className="col-span-2">Non-Striker :</Label>
              <p className="col-span-9 px-3 py-2 border rounded-md">
                Player Name
              </p>
              <Button className="aspect-square ml-2">
                <Replace />{" "}
              </Button>
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
              <p className="border-2 border-white/0">0</p>
              {/* Non-Striker RUNS */}
              <p className="border-2 border-white/0">0</p>
              {/* This Over RUNS */}
              <p className="border-2 border-white/0">0</p>
            </div>
            {/* BALLS */}
            <div className="flex flex-col gap-[18px]">
              <p className="border-2 border-white/0 font-semibold">B</p>
              {/* Striker BALLS */}
              <p className="border-2 border-white/0">0</p>
              {/* Non-striker BALLS */}
              <p className="border-2 border-white/0">0</p>
              {/* this over BALLS */}
              <p className="border-2 border-white/0">0</p>
            </div>
            {/* FOURS */}
            <div className="flex flex-col gap-[18px]">
              <p className="border-2 border-white/0 font-semibold">4</p>
              {/* Striker FOURS */}
              <p className="border-2 border-white/0">0</p>
              {/* Non-Striker FOURS */}
              <p className="border-2 border-white/0">0</p>
              {/* this over FOURS */}
              <p className="border-2 border-white/0">0</p>
            </div>
            {/* SIXES */}
            <div className="flex flex-col gap-[18px]">
              <p className="border-2 border-white/0 font-semibold">6</p>
              {/* striker SIXES */}
              <p className="border-2 border-white/0">0</p>
              {/* non-striker SIXES */}
              <p className="border-2 border-white/0">0</p>
              {/* this over SIXES */}
              <p className="border-2 border-white/0">0</p>
            </div>
          </div>
          {/* right col */}
          <div className="col-span-4 pt-8 flex flex-col gap-2">
            <div className="grid grid-cols-12 w-full items-center">
              <Label className="col-span-2">Bowler :</Label>
              <p className="col-span-6 px-3 py-2 border rounded-md">
                Bowler Name
              </p>
              <Button className="col-span-1 aspect-square mx-1">
                <Replace />{" "}
              </Button>
              <div className="col-span-3 grid grid-cols-4 text-center -translate-y-4">
                <div className="flex flex-col">
                  <p>O</p>
                  {/* Bowler overs */}
                  <p>0</p>
                </div>
                <div className="flex flex-col">
                  <p>M</p>
                  {/* Bowler Mains/dots */}
                  <p>0</p>
                </div>
                <div className="flex flex-col">
                  <p>R</p>
                  {/* Bowler Runs */}
                  <p>0</p>
                </div>
                <div className="flex flex-col">
                  <p>W</p>
                  {/* Bowler Wickets */}
                  <p>0</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 w-full items-center">
              <Label className="col-span-2">Over.Ball :</Label>
              <div className="col-span-6 flex gap-1 items-center">
                <p className="px-3 py-2 border rounded-md flex-1 text-center">
                  0
                </p>
                <p className="text-center">.</p>
                <p className="px-3 py-2 border rounded-md flex-1 text-center">
                  0
                </p>
              </div>
              <Button className="col-span-1 aspect-square mx-1">
                <Replace />{" "}
              </Button>
              <Button className="col-span-3 text-center bg-yellow-400 hover:bg-yellow-600">Unlock</Button>
            </div>

            <div className="grid grid-cols-12 w-full items-center">
              <div className="col-span-9"></div>
              <Button className="col-span-3 text-center">End Ball</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
