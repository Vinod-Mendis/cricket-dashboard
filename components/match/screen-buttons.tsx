/** @format */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export default function ScreenButtons() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Screen Controller</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1 overflow-y-auto overflow-hidden max-h-[38rem]"> 
          {[...Array(30)].map((_, i) => (
            <Button key={i} variant="outline" className="h-12 w-full">
              {i + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
