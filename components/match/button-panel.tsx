/** @format */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TossDialog from "../modals/toss-dialog";

export default function ButtonPanel() {
  return (
    <>
      <Card className="w-full flex-1 h-full overflow-y-auto col-span-1">
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <TossDialog/>
        </CardContent>
      </Card>
    </>
  );
}
