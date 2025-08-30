import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to matches page as the default
  redirect("/matches")
}
