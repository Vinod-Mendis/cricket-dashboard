/** @format */

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  UserCheck,
  Gavel,
} from "lucide-react";
import { toast } from "sonner";

interface MatchOfficial {
  id: string;
  name: string;
  image?: string;
  type: "UMPIRE" | "REFEREE" | "FIELD";
  created_at?: string;
  updated_at?: string;
}

interface OfficialStats {
  total_officials: string;
  total_umpires: string;
  total_referees: string;
  total_field_officials: string;
}

function getTypeBadgeColor(type: string) {
  switch (type) {
    case "UMPIRE":
      return "bg-blue-500";
    case "REFEREE":
      return "bg-green-500";
    case "FIELD":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
}

export default function OfficialsPage() {
  const [officials, setOfficials] = useState<MatchOfficial[]>([]);
  const [stats, setStats] = useState<OfficialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<MatchOfficial | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    type: "UMPIRE" as "UMPIRE" | "REFEREE" | "FIELD",
  });

  useEffect(() => {
    fetchOfficials();
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (searchQuery || filterType !== "all") {
      handleSearch();
    } else {
      fetchOfficials();
    }
  }, [searchQuery, filterType]);

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/matchOfficials"
      );
      const result = await response.json();
      if (result.success) {
        setOfficials(result.data);
      }
    } catch (error) {
       console.error(error);
      toast.error("Failed to fetch officials");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/matchOfficials/statistics"
      );
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
       console.error(error);
      console.error("Failed to fetch statistics:", error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let url =
        "https://cricket-score-board-v4g9.onrender.com/api/matchOfficials";

      if (filterType !== "all" && !searchQuery) {
        url = `https://cricket-score-board-v4g9.onrender.com/api/matchOfficials/type/${filterType}`;
      } else if (searchQuery || filterType !== "all") {
        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);
        if (filterType !== "all") params.append("type", filterType);
        url = `https://cricket-score-board-v4g9.onrender.com/api/matchOfficials/search?${params.toString()}`;
      }

      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setOfficials(result.data);
      }
    } catch (error) {
       console.error(error);
      toast.error("Failed to search officials");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/matchOfficials",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Official created successfully");
        setIsCreateDialogOpen(false);
        setFormData({ name: "", image: "", type: "UMPIRE" });
        fetchOfficials();
        fetchStatistics();
      } else {
        toast.error("Failed to create official");
      }
    } catch (error) {
       console.error(error);
      toast.error("Failed to create official");
    }
  };

  const handleEditOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficial) return;

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/matchOfficials/${editingOfficial.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Official updated successfully");
        setIsEditDialogOpen(false);
        setEditingOfficial(null);
        setFormData({ name: "", image: "", type: "UMPIRE" });
        fetchOfficials();
      } else {
        toast.error("Failed to update official");
      }
    } catch (error) {
       console.error(error);
      toast.error("Failed to update official");
    }
  };

  const handleDeleteOfficial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this official?")) return;

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/matchOfficials/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Official deleted successfully");
        fetchOfficials();
        fetchStatistics();
      } else {
        toast.error("Failed to delete official");
      }
    } catch (error) {
       console.error(error);
      toast.error("Failed to delete official");
    }
  };

  const openEditDialog = (official: MatchOfficial) => {
    setEditingOfficial(official);
    setFormData({
      name: official.name,
      image: official.image || "",
      type: official.type,
    });
    setIsEditDialogOpen(true);
  };

  if (loading && officials.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Match Officials</h1>
          <p className="text-muted-foreground mt-2">
            Manage cricket match officials and referees
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Official
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Official</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOfficial} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="http://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "UMPIRE" | "REFEREE" | "FIELD") =>
                    setFormData({ ...formData, type: value })
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UMPIRE">Umpire</SelectItem>
                    <SelectItem value="REFEREE">Referee</SelectItem>
                    <SelectItem value="FIELD">Field Official</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Create Official
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Officials
                  </p>
                  <p className="text-2xl font-bold">{stats.total_officials}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Umpires</p>
                  <p className="text-2xl font-bold">{stats.total_umpires}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Gavel className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Referees</p>
                  <p className="text-2xl font-bold">{stats.total_referees}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Field Officials
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.total_field_officials}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search officials by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="UMPIRE">Umpires</SelectItem>
                <SelectItem value="REFEREE">Referees</SelectItem>
                <SelectItem value="FIELD">Field Officials</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Officials Directory ({officials.length} officials)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {officials.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {officials.map((official) => (
                    <TableRow key={official.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {official.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getTypeBadgeColor(
                            official.type
                          )} text-white`}>
                          {official.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {official.image ? (
                          <img
                            src={official.image || "/placeholder.svg"}
                            alt={official.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(official)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOfficial(official.id)}>
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
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Officials Found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterType !== "all"
                    ? "No officials match your search criteria."
                    : "There are currently no match officials registered."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Official</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditOfficial} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="http://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "UMPIRE" | "REFEREE" | "FIELD") =>
                  setFormData({ ...formData, type: value })
                }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UMPIRE">Umpire</SelectItem>
                  <SelectItem value="REFEREE">Referee</SelectItem>
                  <SelectItem value="FIELD">Field Official</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Update Official
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
