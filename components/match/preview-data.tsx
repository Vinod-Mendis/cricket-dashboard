/** @format */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function PreviewData() {
  const formDataPreview = [
    { id: 1, label: "Over Number", value: 0 },
    { id: 2, label: "Ball Number", value: 1 },
    { id: 3, label: "Legal Ball", value: true },
    { id: 4, label: "Bowler Name", value: "Charles Lambert" },
    { id: 5, label: "Striker Name", value: "Player A" },
    { id: 6, label: "Non Striker Name", value: "Player B" },
    { id: 7, label: "Runs Scored", value: 0 },
    { id: 8, label: "Extras", value: 0 },
    { id: 9, label: "Ball Type", value: "NORMAL" },
    { id: 10, label: "Is Wicket", value: true },
    { id: 11, label: "Wicket Type", value: "LBW" },
    { id: 12, label: "Dismissed Player Id", value: 3 },
    { id: 13, label: "Fielder Id", value: null },
  ];

  return (
    <>
      <Card className="w-full col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Preview Form-Data</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-5 text-sm">
            {/* Left column */}
            <div className="flex flex-col gap-1 border-r-2 border-r-black/20 pr-5">
              {formDataPreview.slice(0,7).map((data) => (
                <div key={data.id} className="flex justify-between">
                  <p>{data.label} : </p>
                  <p className="font-medium">{data.value}</p>
                </div>
              ))}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-1">
              {formDataPreview.slice(6,-1).map((data) => (
                <div key={data.id} className="flex justify-between">
                  <p>{data.label} : </p>
                  <p className="font-medium">{data.value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
