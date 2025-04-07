import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  RefreshCw,
  X,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Badge } from "@/components/shadcn/badge";
import { manageStore } from "@/store/manageStore";

export default function Availability() {
  const fetchAvailabilities = manageStore((state) => state.fetchAvailabilities);
  const availabilities = manageStore((state) => state.availabilities);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [filterParams, setFilterParams] = useState({
    doctor: "",
    weekday: null,
    timeFrom: "",
    timeTo: "",
  });

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const weekdays = [
    { value: 0, label: "Monday" },
    { value: 1, label: "Tuesday" },
    { value: 2, label: "Wednesday" },
    { value: 3, label: "Thursday" },
    { value: 4, label: "Friday" },
    { value: 5, label: "Saturday" },
    { value: 6, label: "Sunday" },
  ];

  const getWeekdayName = (day) => {
    return (
      weekdays.find((weekday) => weekday.value === day)?.label || "Unknown"
    );
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleFilterChange = (key, value) => {
    setFilterParams({ ...filterParams, [key]: value });
  };

  const applyFilters = () => {
    console.log("Applying filters:", filterParams);
    // Will be handled by backend
  };

  const resetFilters = () => {
    setFilterParams({
      doctor: "",
      weekday: null,
      timeFrom: "",
      timeTo: "",
    });
    console.log("Filters reset");
    fetchAvailabilities();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Availability Schedule</h1>
        <div className="flex gap-2">
          <div className="border-0 rounded-md flex gap-2 items-center">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-9 px-2"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-9 px-2"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={toggleFilters}>
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button onClick={() => fetchAvailabilities()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter section */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Availabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Doctor</label>
                <Input
                  placeholder="Search by doctor name"
                  value={filterParams.doctor}
                  onChange={(e) => handleFilterChange("doctor", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Day of Week
                </label>
                <Select
                  value={
                    filterParams.weekday !== null
                      ? filterParams.weekday.toString()
                      : undefined
                  }
                  onValueChange={(value) =>
                    handleFilterChange(
                      "weekday",
                      value ? parseInt(value) : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekdays.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  From Time
                </label>
                <Input
                  type="time"
                  value={filterParams.timeFrom}
                  onChange={(e) =>
                    handleFilterChange("timeFrom", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  To Time
                </label>
                <Input
                  type="time"
                  value={filterParams.timeTo}
                  onChange={(e) => handleFilterChange("timeTo", e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No availabilities message */}
      {availabilities.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Calendar className="h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium">No availabilities found</h3>
            <p className="text-sm text-gray-500">
              There are currently no availabilities matching your criteria.
            </p>
            <Button
              onClick={() => {
                resetFilters();
                fetchAvailabilities();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </Card>
      )}

      {/* Grid view for availabilities */}
      {availabilities.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availabilities.map((availability) => (
            <Card key={availability.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      {getWeekdayName(availability.weekday)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatTime(availability.start_time)} -{" "}
                      {formatTime(availability.end_time)}
                    </p>
                  </div>
                  <Badge
                    className={
                      availability.is_available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {availability.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <div className="text-sm space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Doctor ID:</span>
                    <span className="font-medium">
                      {availability.doctor.substring(0, 8)}...
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-500">Specialization:</span>
                    <span className="font-medium">
                      {availability.doctor_detail.specializations[0].name}
                    </span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recurring:</span>
                    <span>{availability.is_recurring ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fee:</span>
                    <span>${availability.doctor_detail.fees}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex flex-wrap gap-1">
                  {availability.doctor_detail.specializations.map((spec, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {spec.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table view for availabilities */}
      {availabilities.length > 0 && viewMode === "table" && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor ID</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                {/* <TableHead>Specialization</TableHead> */}
                <TableHead>Fee</TableHead>
                <TableHead>Recurring</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availabilities.map((availability) => (
                <TableRow key={availability.id}>
                  <TableCell className="font-medium">
                    {availability.doctor_detail.user?.username||"N/A"}
                    {/* {availability.doctor.substring(0, 8)}... */}
                  </TableCell>
                  <TableCell>{getWeekdayName(availability.weekday)}</TableCell>
                  <TableCell>
                    {formatTime(availability.start_time)} -{" "}
                    {formatTime(availability.end_time)}
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {availability.doctor_detail.specializations
                        .slice(0, 1)
                        .map((spec, i) => (
                          <Badge key={i} variant="outline">
                            {spec.name}
                          </Badge>
                        ))}
                      {availability.doctor_detail.specializations.length >
                        1 && (
                        <Badge variant="outline">
                          +
                          {availability.doctor_detail.specializations.length -
                            1}
                        </Badge>
                      )}
                    </div>
                  </TableCell> */}
                  <TableCell>${availability.doctor_detail.fees}</TableCell>
                  <TableCell>
                    {availability.is_recurring ? (
                      <Badge variant="outline" className="bg-green-50">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50">
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {availability.is_available ? (
                      <Badge className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        Unavailable
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
