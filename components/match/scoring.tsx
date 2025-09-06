/** @format */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export default function Scoring() {
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
            <div className="grid grid-cols-4 gap-1 mt-2">
              {[0, 1, 2, 3, 4, 6 ,5, '?'].map((val) => (
                <Button key={val} variant="outline" className="h-10">
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
            <div className="grid grid-cols-3 gap-1 mt-2">
              {["w", "+1", "+2", "+3", "+4", "?"].map((val) => (
                <Button key={val} variant="outline" className="h-10">
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
              {[1, 2, 3, 4].map((val) => (
                <Button key={val} variant="outline" className="h-10">
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
              {[1, 2, 3, 4].map((val) => (
                <Button key={val} variant="outline" className="h-10">
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
                <Button key={val} variant="outline" className="h-10">
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
              {[1, 2, 3, 4].map((val) => (
                <Button key={val} variant="outline" className="h-10">
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
              {[0, 1, 2, 3, 4, 6].map((val) => (
                <Button key={val} variant="outline" className="h-10">
                  {val}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
