/** @format */

"use client";

import MatchContent from "@/components/match/match-content";
import { MatchProvider } from "@/context/match-context";
import { useParams } from "next/navigation";

export default function MatchDetailsPage() {
  const params = useParams();
  const matchId = params.matchId as string;

  return (
    <MatchProvider matchId={matchId}>
      <MatchContent />
    </MatchProvider>
  );
}
