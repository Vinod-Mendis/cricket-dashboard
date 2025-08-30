/** @format */

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Cloud,
  Sun,
  CloudRain,
  Droplets,
  Wind,
  MapPin,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Thermometer,
  Eye,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface WeatherRecord {
  id: number;
  condition: string;
  temperature: number;
  humidity: number;
  chance_of_rain?: number;
  wind_speed?: number;
  description?: string;
  icon_code?: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

interface WeatherStats {
  total_records: string;
  avg_temperature: number;
  min_temperature: number;
  max_temperature: number;
  most_common_condition: string;
}

function getWeatherIcon(condition: string) {
  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun className="h-8 w-8 text-yellow-500" />;
    case "cloudy":
    case "partly cloudy":
      return <Cloud className="h-8 w-8 text-gray-500" />;
    case "rainy":
    case "light rain":
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    default:
      return <Cloud className="h-8 w-8 text-gray-500" />;
  }
}

function getConditionColor(condition: string) {
  switch (condition.toLowerCase()) {
    case "sunny":
      return "bg-yellow-500";
    case "cloudy":
    case "partly cloudy":
      return "bg-gray-500";
    case "rainy":
    case "light rain":
      return "bg-blue-500";
    case "hot":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function WeatherCard({
  weather,
  onEdit,
  onDelete,
}: {
  weather: WeatherRecord;
  onEdit: (weather: WeatherRecord) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {weather.location}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              className={`${getConditionColor(weather.condition)} text-white`}>
              {weather.condition}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(weather)}
                className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(weather.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main weather display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="text-3xl font-bold">{weather.temperature}°C</div>
              <div className="text-sm text-muted-foreground">
                {weather.condition}
              </div>
            </div>
          </div>
        </div>

        {/* Weather details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div className="font-semibold">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-sm text-muted-foreground">Wind Speed</div>
              <div className="font-semibold">
                {weather.wind_speed || 0} km/h
              </div>
            </div>
          </div>
        </div>

        {weather.chance_of_rain !== undefined && (
          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground">Chance of Rain</div>
            <div className="font-semibold">{weather.chance_of_rain}%</div>
          </div>
        )}

        {weather.description && (
          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground mb-1">
              Description
            </div>
            <p className="text-sm">{weather.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WeatherForm({
  weather,
  onSubmit,
  onCancel,
  isLoading,
}: {
  weather?: WeatherRecord;
  onSubmit: (data: Partial<WeatherRecord>) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    condition: weather?.condition || "",
    temperature: weather?.temperature || 0,
    humidity: weather?.humidity || 0,
    chance_of_rain: weather?.chance_of_rain || 0,
    wind_speed: weather?.wind_speed || 0,
    description: weather?.description || "",
    icon_code: weather?.icon_code || "",
    location: weather?.location || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="e.g., Colombo"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) =>
              setFormData({ ...formData, condition: value })
            }>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunny">Sunny</SelectItem>
              <SelectItem value="cloudy">Cloudy</SelectItem>
              <SelectItem value="partly cloudy">Partly Cloudy</SelectItem>
              <SelectItem value="rainy">Rainy</SelectItem>
              <SelectItem value="light rain">Light Rain</SelectItem>
              <SelectItem value="overcast">Overcast</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={(e) =>
              setFormData({
                ...formData,
                temperature: Number.parseFloat(e.target.value),
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="humidity">Humidity (%)</Label>
          <Input
            id="humidity"
            type="number"
            min="0"
            max="100"
            value={formData.humidity}
            onChange={(e) =>
              setFormData({
                ...formData,
                humidity: Number.parseInt(e.target.value),
              })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chance_of_rain">Chance of Rain (%)</Label>
          <Input
            id="chance_of_rain"
            type="number"
            min="0"
            max="100"
            value={formData.chance_of_rain}
            onChange={(e) =>
              setFormData({
                ...formData,
                chance_of_rain: Number.parseInt(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wind_speed">Wind Speed (km/h)</Label>
          <Input
            id="wind_speed"
            type="number"
            step="0.1"
            min="0"
            value={formData.wind_speed}
            onChange={(e) =>
              setFormData({
                ...formData,
                wind_speed: Number.parseFloat(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Weather description..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon_code">Icon Code</Label>
        <Input
          id="icon_code"
          value={formData.icon_code}
          onChange={(e) =>
            setFormData({ ...formData, icon_code: e.target.value })
          }
          placeholder="e.g., 01d"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : weather
            ? "Update Weather"
            : "Create Weather"}
        </Button>
      </div>
    </form>
  );
}

export default function WeatherPage() {
  const [weatherRecords, setWeatherRecords] = useState<WeatherRecord[]>([]);
  const [statistics, setStatistics] = useState<WeatherStats | null>(null);
  const [latestWeather, setLatestWeather] = useState<WeatherRecord | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingWeather, setEditingWeather] = useState<WeatherRecord | null>(
    null
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");

  const fetchWeatherRecords = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/weather"
      );
      const data = await response.json();
      if (data.success) {
        setWeatherRecords(data.data);
      }
    } catch (error) {
      console.error("Error fetching weather records:", error);
      toast.error("Failed to fetch weather records");
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/weather/statistics"
      );
      const data = await response.json();
      if (data.success) {
        setStatistics(data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchLatestWeather = async (location?: string) => {
    try {
      const url = location
        ? `https://cricket-score-board-v4g9.onrender.com/api/weather/latest?location=${encodeURIComponent(
            location
          )}`
        : "https://cricket-score-board-v4g9.onrender.com/api/weather/latest";
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setLatestWeather(data.data);
      }
    } catch (error) {
      console.error("Error fetching latest weather:", error);
    }
  };

  const createWeather = async (weatherData: Partial<WeatherRecord>) => {
    setIsCreating(true);
    try {
      const response = await fetch(
        "https://cricket-score-board-v4g9.onrender.com/api/weather",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(weatherData),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Weather record created successfully");
        setShowCreateDialog(false);
        fetchWeatherRecords();
        fetchStatistics();
      } else {
        toast.error("Failed to create weather record");
      }
    } catch (error) {
      console.error("Error creating weather:", error);
      toast.error("Failed to create weather record");
    } finally {
      setIsCreating(false);
    }
  };

  const updateWeather = async (
    id: number,
    weatherData: Partial<WeatherRecord>
  ) => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/weather/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(weatherData),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Weather record updated successfully");
        setShowEditDialog(false);
        setEditingWeather(null);
        fetchWeatherRecords();
        fetchStatistics();
      } else {
        toast.error("Failed to update weather record");
      }
    } catch (error) {
      console.error("Error updating weather:", error);
      toast.error("Failed to update weather record");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteWeather = async (id: number) => {
    if (!confirm("Are you sure you want to delete this weather record?"))
      return;

    try {
      const response = await fetch(
        `https://cricket-score-board-v4g9.onrender.com/api/weather/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Weather record deleted successfully");
        fetchWeatherRecords();
        fetchStatistics();
      } else {
        toast.error("Failed to delete weather record");
      }
    } catch (error) {
      console.error("Error deleting weather:", error);
      toast.error("Failed to delete weather record");
    }
  };

  const handleEdit = (weather: WeatherRecord) => {
    setEditingWeather(weather);
    setShowEditDialog(true);
  };

  const handleLocationSearch = () => {
    if (searchLocation.trim()) {
      fetchLatestWeather(searchLocation.trim());
    } else {
      fetchLatestWeather();
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchWeatherRecords(),
        fetchStatistics(),
        fetchLatestWeather(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Cloud className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Weather Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage weather conditions and forecasts
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Weather Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Weather Record</DialogTitle>
              </DialogHeader>
              <WeatherForm
                onSubmit={createWeather}
                onCancel={() => setShowCreateDialog(false)}
                isLoading={isCreating}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Records
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.total_records}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Temperature
              </CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.avg_temperature}°C
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Min Temperature
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.min_temperature}°C
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Max Temperature
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.max_temperature}°C
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Common</CardTitle>
              <Sun className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {statistics.most_common_condition}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Latest Weather</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-48"
                />
                <Button onClick={handleLocationSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {latestWeather ? (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(latestWeather.condition)}
                  <div>
                    <div className="font-semibold">
                      {latestWeather.location}
                    </div>
                    <div className="text-2xl font-bold">
                      {latestWeather.temperature}°C
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {latestWeather.condition}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Humidity: {latestWeather.humidity}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Wind: {latestWeather.wind_speed || 0} km/h
                  </div>
                  {latestWeather.chance_of_rain !== undefined && (
                    <div className="text-sm text-muted-foreground">
                      Rain: {latestWeather.chance_of_rain}%
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No latest weather data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {weatherRecords.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {weatherRecords.map((weather) => (
            <WeatherCard
              key={weather.id}
              weather={weather}
              onEdit={handleEdit}
              onDelete={deleteWeather}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Cloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Weather Records</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first weather record.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Weather Record
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Weather Record</DialogTitle>
          </DialogHeader>
          {editingWeather && (
            <WeatherForm
              weather={editingWeather}
              onSubmit={(data) => updateWeather(editingWeather.id, data)}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingWeather(null);
              }}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
