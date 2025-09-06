/** @format */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Replace } from "lucide-react";

export default function PlayControl() {
  return (
    <>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Play Control</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-7">
          {/* left col */}
          <div className="col-span-2 flex-col gap-2 flex pt-10">
            <div className="grid grid-cols-12 w-full">
              <Label className="col-span-2">Striker :</Label>
              <Select>
                <SelectTrigger className="w-full col-span-9">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Players</SelectLabel>
                    <SelectItem value="T20">T20</SelectItem>
                    <SelectItem value="ODI">ODI</SelectItem>
                    <SelectItem value="TEST">TEST</SelectItem>
                    <SelectItem value="T10">T10</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className="aspect-square ml-2">
                <Replace />{" "}
              </Button>
            </div>

            <div className="grid grid-cols-12 w-full">
              <Label className="col-span-2">Non-Striker :</Label>
              <Select>
                <SelectTrigger className="w-full col-span-9">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Players</SelectLabel>
                    <SelectItem value="T20">T20</SelectItem>
                    <SelectItem value="ODI">ODI</SelectItem>
                    <SelectItem value="TEST">TEST</SelectItem>
                    <SelectItem value="T10">T10</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className="aspect-square ml-2">
                <Replace />{" "}
              </Button>
            </div>

            <div className="grid grid-cols-12 w-full pt-1">
              <Label className="col-span-2">Non-Striker :</Label>
              <div className="w-full col-span-9"></div>
              <p className="text-center">P/S:</p>
            </div>
          </div>
          {/* middle col */}
          <div className="grid grid-cols-4 col-span-1 text-center pl-6">
            <div className="flex flex-col gap-4">
              <p className="border-2 border-white/0 font-semibold">R</p>
              <p className="border-2 border-white/0">0</p>
              <p className="border-2 border-white/0">0</p>
              <p className="border-2 border-white/0">0</p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="border-2 border-white/0 font-semibold">B</p>
              <p className="border-2 border-white/0">0</p>
              <p className="border-2 border-white/0">0</p>
              <p className="border-2 border-white/0">0</p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="border-2 border-white/0 font-semibold">4</p>
              <p className="border-2 border-white/0">0</p>
              <p className="border-2 border-white/0">0</p>
              <p className="border-2 border-white/0">0</p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="border-2 border-white/0 font-semibold">6</p>
              <p className="border-2 border-white/0">0</p>
              <p className="border-2 border-white/0">0</p>
              <p className="border-2 border-white/0">0</p>
            </div>
          </div>
          {/* right col */}
          <div className="col-span-4 pt-7 flex flex-col gap-2">
            <div className="grid grid-cols-12 w-full items-center">
              <Label className="col-span-2">Bowler :</Label>
              <Select>
                <SelectTrigger className="w-full col-span-6">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Players</SelectLabel>
                    <SelectItem value="T20">T20</SelectItem>
                    <SelectItem value="ODI">ODI</SelectItem>
                    <SelectItem value="TEST">TEST</SelectItem>
                    <SelectItem value="T10">T10</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className="col-span-1 aspect-square mx-1">
                <Replace />{" "}
              </Button>
              <div className="col-span-3 grid grid-cols-4 text-center -translate-y-4">
                <div className="flex flex-col">
                  <p>O</p>
                  <p>0</p>
                </div>
                <div className="flex flex-col">
                  <p>M</p>
                  <p>0</p>
                </div>
                <div className="flex flex-col">
                  <p>R</p>
                  <p>0</p>
                </div>
                <div className="flex flex-col">
                  <p>W</p>
                  <p>0</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 w-full items-center">
              <Label className="col-span-2">Bowler :</Label>
              <div className="col-span-6 flex gap-1 w-fit">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Players</SelectLabel>
                      <SelectItem value="T20">T20</SelectItem>
                      <SelectItem value="ODI">ODI</SelectItem>
                      <SelectItem value="TEST">TEST</SelectItem>
                      <SelectItem value="T10">T10</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-center">.</p>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Players</SelectLabel>
                      <SelectItem value="T20">T20</SelectItem>
                      <SelectItem value="ODI">ODI</SelectItem>
                      <SelectItem value="TEST">TEST</SelectItem>
                      <SelectItem value="T10">T10</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button className="col-span-1 aspect-square mx-1">
                <Replace />{" "}
              </Button>
              <Button className="col-span-3 text-center">Edit</Button>
            </div>

            <div className="grid grid-cols-12 w-full items-center">
              <Label className="col-span-2">Bowler :</Label>
              <Select>
                <SelectTrigger className="w-full col-span-6">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Players</SelectLabel>
                    <SelectItem value="T20">T20</SelectItem>
                    <SelectItem value="ODI">ODI</SelectItem>
                    <SelectItem value="TEST">TEST</SelectItem>
                    <SelectItem value="T10">T10</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className="col-span-1 aspect-square mx-1">
                <Replace />{" "}
              </Button>
              <Button className="col-span-3 text-center">End Ball</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
