/** @format */
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import EditScoreDialog from "../modals/edit-score-dialog";
import CreateInningsDialog from "../modals/create-innings";

interface scoreSummaryTypes {
  matchId: string;
  matchDetails: any;
}

export default function ScoreSummary({
  matchId,
  matchDetails,
}: scoreSummaryTypes) {
  const [rightSideData, setRightSideData] = useState({
    lastWicket: { value: 0, label: "Last Wicket" },
    last5Overs: { value: 0, label: "Last 5 Overs" },
    dls: { value: 0, label: "DLS" },
    runRate: { value: 0, label: "Run Rate" },
  });
  const [leftSideData, setLeftSideData] = useState({
    drs: { value: 0, label: "DRS" },
    overRate: { value: 0, label: "Over Rate" },
    cutOff: { value: 0, label: "Cut-Off" },
    oversRem: { value: 0, label: "Overs Rem" },
  });

  // Handle score summary updates from EditScoreDialog
  const handleScoreUpdate = (updatedData: {
    rightSideData: typeof rightSideData;
    leftSideData: typeof leftSideData;
  }) => {
    setRightSideData(updatedData.rightSideData);
    setLeftSideData(updatedData.leftSideData);
  };

  // Optional callback when innings is created
  const handleInningsCreated = () => {
    // You can add any logic here to refresh data or update UI
    console.log("Innings created successfully, refreshing data...");
    // For example, you might want to fetch updated match data here
  };

  return (
    <>
      <Card className="col-span-4">
        <CardHeader className="flex justify-between">
          <CardTitle>Score Summary</CardTitle>

          <div className="flex gap-2">
            {/* Edit Score Button */}
            <EditScoreDialog
              rightSideData={rightSideData}
              leftSideData={leftSideData}
              onSave={handleScoreUpdate}
            />

            {/* Create Innings Button */}
            <CreateInningsDialog
              matchId={matchId}
              onInningsCreated={handleInningsCreated}
            />
          </div>
        </CardHeader>
        <CardContent className="flex justify-between">
          {/* left side */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <h1 className="text-2xl">
                Team Name :{" "}
                <span>
                  {0}/{0} ({"0.0"})
                </span>
              </h1>
              <h1 className="text-xl">
                Team Name :{" "}
                <span>
                  {0}/{0} ({"0.0"})
                </span>
              </h1>
            </div>
          </div>

          {/* right side */}
          <div className="w-full max-w-2xl grid grid-cols-2">
            {/* Col 1 */}
            <div className="flex flex-col justify-between border-r-black/20 border-r-2 pr-12">
              {Object.entries(rightSideData).map(([key, data]) => (
                <div className="flex justify-between" key={key}>
                  <p className="font-semibold">{data.label}</p>
                  <p>{data.value === 0 ? "N/A" : data.value}</p>
                </div>
              ))}
            </div>

            {/* Col 2 */}
            <div className="flex flex-col justify-between pl-12">
              {Object.entries(leftSideData).map(([key, data]) => (
                <div className="flex justify-between" key={key}>
                  <p className="font-semibold">{data.label}</p>
                  <p>{data.value === 0 ? "N/A" : data.value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
