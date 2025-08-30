"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCricket } from "@/components/cricket-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Users, Plus, UserPlus, Edit, Trash2, Search } from "lucide-react"
import Image from "next/image"

interface Player {
  id: string
  name: string
  short_name: string
  role: string
  batting_style: string
  bowling_style: string
  age: number
  image: string
  shirt_number: number
  team_id: string
  last_match_date: string
  career_span: string
}

function CreatePlayerDialog({
  teamId,
  teamName,
  onPlayerCreated,
}: { teamId: string; teamName: string; onPlayerCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    role: "",
    batting_style: "",
    bowling_style: "",
    age: "",
    image: "",
    shirt_number: "",
    team_id: teamId,
    last_match_date: "",
    career_span: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://cricket-score-board-v4g9.onrender.com/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: Number.parseInt(formData.age),
          shirt_number: Number.parseInt(formData.shirt_number),
        }),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({
          name: "",
          short_name: "",
          role: "",
          batting_style: "",
          bowling_style: "",
          age: "",
          image: "",
          shirt_number: "",
          team_id: teamId,
          last_match_date: "",
          career_span: "",
        })
        onPlayerCreated()
      }
    } catch (error) {
      console.error("Error creating player:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Player
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Player for {teamName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Rohit Sharma"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_name">Short Name *</Label>
              <Input
                id="short_name"
                value={formData.short_name}
                onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                placeholder="e.g., R. Sharma"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Batsman">Batsman</SelectItem>
                  <SelectItem value="Bowler">Bowler</SelectItem>
                  <SelectItem value="All-rounder">All-rounder</SelectItem>
                  <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g., 35"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batting_style">Batting Style</Label>
              <Select
                value={formData.batting_style}
                onValueChange={(value) => setFormData({ ...formData, batting_style: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batting style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right-handed">Right-handed</SelectItem>
                  <SelectItem value="Left-handed">Left-handed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bowling_style">Bowling Style</Label>
              <Select
                value={formData.bowling_style}
                onValueChange={(value) => setFormData({ ...formData, bowling_style: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bowling style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right-arm Fast">Right-arm Fast</SelectItem>
                  <SelectItem value="Left-arm Fast">Left-arm Fast</SelectItem>
                  <SelectItem value="Right-arm Off-break">Right-arm Off-break</SelectItem>
                  <SelectItem value="Left-arm Orthodox">Left-arm Orthodox</SelectItem>
                  <SelectItem value="Right-arm Leg-break">Right-arm Leg-break</SelectItem>
                  <SelectItem value="Left-arm Chinaman">Left-arm Chinaman</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shirt_number">Shirt Number</Label>
              <Input
                id="shirt_number"
                type="number"
                value={formData.shirt_number}
                onChange={(e) => setFormData({ ...formData, shirt_number: e.target.value })}
                placeholder="e.g., 45"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_match_date">Last Match Date</Label>
              <Input
                id="last_match_date"
                type="date"
                value={formData.last_match_date}
                onChange={(e) => setFormData({ ...formData, last_match_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="career_span">Career Span</Label>
            <Input
              id="career_span"
              value={formData.career_span}
              onChange={(e) => setFormData({ ...formData, career_span: e.target.value })}
              placeholder="e.g., 2007-Present"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="http://example.com/player.jpg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Player"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddExistingPlayersDialog({
  teamId,
  teamName,
  onPlayersAdded,
}: { teamId: string; teamName: string; onPlayersAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (open) {
      fetchAvailablePlayers()
    }
  }, [open, teamId])

  const fetchAvailablePlayers = async () => {
    try {
      const response = await fetch(`https://cricket-score-board-v4g9.onrender.com/api/players?exclude_team=${teamId}`)
      if (response.ok) {
        const data = await response.json()
        setAvailablePlayers(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching available players:", error)
      setAvailablePlayers([])
    }
  }

  const filteredPlayers = availablePlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayers((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  const handleAddPlayers = async () => {
    if (selectedPlayers.length === 0) return

    setLoading(true)
    try {
      const promises = selectedPlayers.map((playerId) =>
        fetch(`https://cricket-score-board-v4g9.onrender.com/api/player/${playerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ team_id: teamId }),
        }),
      )

      await Promise.all(promises)
      setOpen(false)
      setSelectedPlayers([])
      onPlayersAdded()
    } catch (error) {
      console.error("Error adding players to team:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <UserPlus className="h-4 w-4" />
          Add Existing Players
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Existing Players to {teamName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {filteredPlayers.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Current Team</TableHead>
                    <TableHead>Age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPlayers.includes(player.id)}
                          onCheckedChange={() => handlePlayerToggle(player.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{player.role}</Badge>
                      </TableCell>
                      <TableCell>{player.team_id || "Unassigned"}</TableCell>
                      <TableCell>{player.age}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No players found matching your search." : "No available players to add."}
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-muted-foreground">
              {selectedPlayers.length} player{selectedPlayers.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPlayers} disabled={loading || selectedPlayers.length === 0}>
                {loading
                  ? "Adding..."
                  : `Add ${selectedPlayers.length} Player${selectedPlayers.length !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { teams } = useCricket()
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const teamId = params.teamId as string
  const team = teams.find((t) => t.id === teamId)

  console.log(teamPlayers);
  

  useEffect(() => {
    if (teamId) {
      fetchTeamPlayers()
    }
  }, [teamId])

  const fetchTeamPlayers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://cricket-score-board-v4g9.onrender.com/api/players/team/${teamId }`)
      if (response.ok) {
        const data = await response.json()
        setTeamPlayers(data.data || [])
      } else {
        setTeamPlayers([])
      }
    } catch (error) {
      console.error("Error fetching team players:", error)
      setTeamPlayers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlayer = async (playerId: string) => {
    try {
      const response = await fetch(`https://cricket-score-board-v4g9.onrender.com/api/player/${playerId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchTeamPlayers()
      }
    } catch (error) {
      console.error("Error deleting player:", error)
    }
  }

  const filteredPlayers = Array.isArray(teamPlayers)
    ? teamPlayers.filter(
        (player) =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.role.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  if (!team) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Team Not Found</h1>
          <Button onClick={() => router.push("/teams")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/teams")} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Teams
        </Button>

        <div className="flex items-center gap-4 mb-4">
          <Image
            src={team.logo || "/placeholder.svg"}
            alt={`${team.name} logo`}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-balance">{team.name}</h1>
            <p className="text-muted-foreground">{team.shortName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Squad Size:</span>
            <Badge variant="secondary">
              {teamPlayers.length}/{team.maxPlayers}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Players</CardTitle>
              <div className="flex gap-2">
                <CreatePlayerDialog teamId={teamId} teamName={team.name} onPlayerCreated={fetchTeamPlayers} />
                <AddExistingPlayersDialog teamId={teamId} teamName={team.name} onPlayersAdded={fetchTeamPlayers} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players by name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading players...</div>
              ) : filteredPlayers.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Team ID</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Shirt #</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlayers.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-mono text-sm">{player.id}</TableCell>
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{player.role}</Badge>
                          </TableCell>
                          <TableCell>{player.team_id}</TableCell>
                          <TableCell>{player.age}</TableCell>
                          <TableCell>{player.shirt_number || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeletePlayer(player.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No players found matching your search." : "No players in this team yet."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
