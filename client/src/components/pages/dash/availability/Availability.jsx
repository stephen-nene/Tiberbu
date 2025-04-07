import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, RefreshCw, X } from "lucide-react";
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
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/shadcn/popover";
import { Badge } from "@/components/shadcn/badge";
import { manageStore } from "@/store/manageStore";
import { useNavigate } from "react-router-dom";

export default function Availability() {
  const fetchAvailabilities = manageStore((state) => state.fetchAvailabilities);
  const availabilities = manageStore((state) => state.availabilities);
  const [showFilters, setShowFilters] = useState(false);
  const [filterParams, setFilterParams] = useState({
    doctor: "",
    weekday: "",
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
    // Will be handled by backend - just logging for now
  };

  const resetFilters = () => {
    setFilterParams({
      doctor: "",
      weekday: "",
      timeFrom: "",
      timeTo: "",
    });
    console.log("Filters reset");
    fetchAvailabilities();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Group availabilities by doctor for card view
  const doctorAvailabilities = availabilities.reduce((acc, availability) => {
    const doctorId = availability.doctor;
    if (!acc[doctorId]) {
      acc[doctorId] = {
        doctor: availability.doctor_detail,
        schedules: [],
      };
    }
    acc[doctorId].schedules.push(availability);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Availabilities</h1>
        <div className="flex gap-2">
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
                  value={filterParams.weekday}
                  onValueChange={(value) =>
                    handleFilterChange("weekday", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All days</SelectItem>
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

      {/* Card view for doctor availabilities */}
      {availabilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.values(doctorAvailabilities).map((item) => (
            <Card key={item.doctor.user}>
              <CardHeader>
                <CardTitle>Dr. {item.doctor.user.substring(0, 8)}...</CardTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.doctor.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline">
                      {spec.name}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Experience:</span>{" "}
                    {item.doctor.experience} years
                  </p>
                  <p>
                    <span className="font-medium">Consultation Fee:</span> $
                    {item.doctor.fees}
                  </p>
                  <p>
                    <span className="font-medium">Accepting New Patients:</span>{" "}
                    {item.doctor.accepting_new_patients ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">Emergency Available:</span>{" "}
                    {item.doctor.emergency_availability ? "Yes" : "No"}
                  </p>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Availability Schedule:</h4>
                    <ul className="space-y-1">
                      {item.schedules.map((schedule) => (
                        <li
                          key={schedule.id}
                          className="text-sm border-l-2 border-blue-500 pl-2"
                        >
                          <span className="font-medium">
                            {getWeekdayName(schedule.weekday)}:
                          </span>{" "}
                          {formatTime(schedule.start_time)} -{" "}
                          {formatTime(schedule.end_time)}
                          {schedule.is_recurring && (
                            <Badge className="ml-2" variant="secondary">
                              Recurring
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Calendar className="h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium">No availabilities found</h3>
            <p className="text-sm text-gray-500">
              There are currently no doctor availabilities matching your
              criteria.
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

      {/* Table view for availabilities */}
      {availabilities.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Availability Details</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Recurring</TableHead>
                <TableHead>Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availabilities.map((availability) => (
                <TableRow key={availability.id}>
                  <TableCell>
                    <div className="font-medium">
                      {availability.doctor_detail.user.substring(0, 8)}...
                    </div>
                    <div className="text-sm text-gray-500">
                      {availability.doctor_detail.specializations[0].name}
                    </div>
                  </TableCell>
                  <TableCell>{getWeekdayName(availability.weekday)}</TableCell>
                  <TableCell>{formatTime(availability.start_time)}</TableCell>
                  <TableCell>{formatTime(availability.end_time)}</TableCell>
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
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
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
