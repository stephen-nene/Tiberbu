import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Clock,
  User,
  X,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/shadcn/dropdown-menu";
import { Badge } from "@/components/shadcn/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { manageStore } from "@/store/manageStore";
import { useNavigate } from "react-router-dom";

export default function Availability() {
  const fetchAvailabilities = manageStore((state) => state.fetchAvailabilities);
  const availabilities = manageStore((state) => state.availabilities);
  const [viewMode, setViewMode] = useState("card");
  const [filters, setFilters] = useState({
    doctor: "",
    weekday: "",
    timeRange: { start: "", end: "" }
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAvailabilities();
  }, []);

  const loadAvailabilities = async () => {
    setIsLoading(true);
    try {
      await fetchAvailabilities();
    } catch (error) {
      console.error("Failed to fetch availabilities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert weekday number to string
  const getWeekdayName = (day) => {
    const weekdays = [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];
    return weekdays[day];
  };

  // Format time for display
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };

  // Filter availabilities based on selected filters
  const filteredAvailabilities = availabilities.filter(item => {
    let matchesDoctor = true;
    let matchesWeekday = true;
    let matchesTimeRange = true;
    
    if (filters.doctor) {
      matchesDoctor = item.doctor === filters.doctor;
    }
    
    if (filters.weekday !== "") {
      matchesWeekday = item.weekday === parseInt(filters.weekday);
    }
    
    if (filters.timeRange.start && filters.timeRange.end) {
      const availStart = item.start_time;
      const availEnd = item.end_time;
      matchesTimeRange = 
        (availStart >= filters.timeRange.start && availStart <= filters.timeRange.end) ||
        (availEnd >= filters.timeRange.start && availEnd <= filters.timeRange.end) ||
        (availStart <= filters.timeRange.start && availEnd >= filters.timeRange.end);
    }
    
    return matchesDoctor && matchesWeekday && matchesTimeRange;
  });

  // Get unique doctors for filter dropdown
  const uniqueDoctors = [...new Set(availabilities.map(item => item.doctor))];

  const clearFilters = () => {
    setFilters({
      doctor: "",
      weekday: "",
      timeRange: { start: "", end: "" }
    });
  };

  // Empty state component
  const EmptyState = ({ filtered }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No availabilities found</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">
        {filtered 
          ? "No availabilities match your current filters. Try adjusting your filter criteria." 
          : "There are no availabilities to display at the moment."}
      </p>
      <div className="flex gap-4">
        {filtered && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
        <Button onClick={loadAvailabilities}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Doctor Availabilities</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAvailabilities}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Tabs 
            value={viewMode} 
            onValueChange={setViewMode} 
            className="ml-auto"
          >
            <TabsList>
              <TabsTrigger value="card">Card View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Availabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Doctor</label>
                <Select 
                  value={filters.doctor}
                  onValueChange={(value) => setFilters({...filters, doctor: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Doctors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Doctors</SelectItem>
                    {uniqueDoctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Day of Week</label>
                <Select 
                  value={filters.weekday}
                  onValueChange={(value) => setFilters({...filters, weekday: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Days</SelectItem>
                    <SelectItem value="0">Monday</SelectItem>
                    <SelectItem value="1">Tuesday</SelectItem>
                    <SelectItem value="2">Wednesday</SelectItem>
                    <SelectItem value="3">Thursday</SelectItem>
                    <SelectItem value="4">Friday</SelectItem>
                    <SelectItem value="5">Saturday</SelectItem>
                    <SelectItem value="6">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Start Time</label>
                  <Input 
                    type="time" 
                    value={filters.timeRange.start}
                    onChange={(e) => setFilters({
                      ...filters, 
                      timeRange: {...filters.timeRange, start: e.target.value}
                    })}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">End Time</label>
                  <Input 
                    type="time" 
                    value={filters.timeRange.end}
                    onChange={(e) => setFilters({
                      ...filters, 
                      timeRange: {...filters.timeRange, end: e.target.value}
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
          </CardFooter>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredAvailabilities.length === 0 ? (
        <EmptyState filtered={
          filters.doctor !== "" || 
          filters.weekday !== "" || 
          (filters.timeRange.start !== "" && filters.timeRange.end !== "")
        } />
      ) : (
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="card" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailabilities.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2">
                          {getWeekdayName(item.weekday)}
                        </Badge>
                        <CardTitle className="text-base font-medium">
                          {item.doctor_detail.specializations.map(spec => spec.name).join(", ")}
                        </CardTitle>
                      </div>
                      <Badge variant={item.is_available ? "success" : "destructive"}>
                        {item.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Doctor ID:</span>
                      <span className="ml-2 text-sm">{item.doctor}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Hours:</span>
                      <span className="ml-2 text-sm">
                        {formatTime(item.start_time)} - {formatTime(item.end_time)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Recurring:</span>
                      <span className="ml-2 text-sm">
                        {item.is_recurring ? "Yes" : "No"}
                      </span>
                    </div>
                    
                    {item.doctor_detail.experience && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Experience:</span> {item.doctor_detail.experience} years
                      </div>
                    )}
                    
                    {item.doctor_detail.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.doctor_detail.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Specializations</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recurring</TableHead>
                      <TableHead>Experience</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAvailabilities.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.doctor.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{getWeekdayName(item.weekday)}</TableCell>
                        <TableCell>
                          {formatTime(item.start_time)} - {formatTime(item.end_time)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.doctor_detail.specializations.slice(0, 2).map((spec, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {spec.name}
                              </Badge>
                            ))}
                            {item.doctor_detail.specializations.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.doctor_detail.specializations.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.is_available ? "success" : "destructive"}>
                            {item.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.is_recurring ? "Yes" : "No"}</TableCell>
                        <TableCell>{item.doctor_detail.experience} years</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}