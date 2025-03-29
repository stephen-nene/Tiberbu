import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  User, 
  Stethoscope, 
  MoreVertical, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shadcn/tabs";
import { Badge } from "@/components/shadcn/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/shadcn/dropdown-menu";

import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";

import { toast } from "sonner";
export default function AppointmentsPage() {

  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      patient: "Sarah Johnson", 
      doctor: "Dr. Amara Ibrahim", 
      specialty: "Cardiology",
      date: "2025-03-30", 
      time: "09:30 AM", 
      status: "Upcoming",
      type: "Check-up",
      notes: "Regular blood pressure check"
    },
    { 
      id: 2, 
      patient: "Michael Chen", 
      doctor: "Dr. Richard Wong", 
      specialty: "Neurology",
      date: "2025-03-30", 
      time: "10:15 AM", 
      status: "Confirmed",
      type: "Consultation",
      notes: "Recurring migraines"
    },
    { 
      id: 3, 
      patient: "Emily Rodriguez", 
      doctor: "Dr. Elena Rodriguez", 
      specialty: "Pediatrics",
      date: "2025-03-30", 
      time: "11:00 AM", 
      status: "Completed",
      type: "Vaccination",
      notes: "MMR vaccine"
    },
    { 
      id: 4, 
      patient: "David Washington", 
      doctor: "Dr. Samuel Okafor", 
      specialty: "Orthopedics",
      date: "2025-03-30", 
      time: "01:30 PM", 
      status: "Cancelled",
      type: "Follow-up",
      notes: "Post knee surgery"
    },
    { 
      id: 5, 
      patient: "Fatima Al-Zahra", 
      doctor: "Dr. Priya Sharma", 
      specialty: "Dermatology",
      date: "2025-03-31", 
      time: "09:00 AM", 
      status: "Upcoming",
      type: "Consultation",
      notes: "Skin rash examination"
    },
    { 
      id: 6, 
      patient: "James Wilson", 
      doctor: "Dr. James Wilson", 
      specialty: "Psychiatry",
      date: "2025-03-31", 
      time: "10:30 AM", 
      status: "Confirmed",
      type: "Therapy",
      notes: "Bi-weekly session"
    },
    { 
      id: 7, 
      patient: "Sophia Park", 
      doctor: "Dr. Elena Rodriguez", 
      specialty: "Pediatrics",
      date: "2025-03-31", 
      time: "02:00 PM", 
      status: "Confirmed",
      type: "Check-up",
      notes: "Annual physical"
    },
    { 
      id: 8, 
      patient: "Robert Nguyen", 
      doctor: "Dr. James Wilson", 
      specialty: "Psychiatry",
      date: "2025-03-31", 
      time: "03:30 PM", 
      status: "Upcoming",
      type: "Consultation",
      notes: "New medication review"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "upcoming") return matchesSearch && appointment.status === "Upcoming";
    if (activeTab === "confirmed") return matchesSearch && appointment.status === "Confirmed";
    if (activeTab === "completed") return matchesSearch && appointment.status === "Completed";
    if (activeTab === "cancelled") return matchesSearch && appointment.status === "Cancelled";
    
    return matchesSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ))
    
        toast.success(`Appointment status changed to ${newStatus}`, {
          description: "Appointment Updated",
        });

  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(app => app.id !== id));
    setDeleteDialogOpen(false);
    
      
      toast.error("Appointment deleted successfully");
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Upcoming": 
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
          {status}
        </Badge>;
      case "Confirmed": 
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
          {status}
        </Badge>;
      case "Completed": 
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
          {status}
        </Badge>;
      case "Cancelled": 
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
          {status}
        </Badge>;
      default: 
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusCount = (status) => {
    return appointments.filter(app => app.status === status).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointment Management</h1>
        <Button
          onClick={() =>
            toast.success(`Feature Coming Soon 🚧`, {
              description:
                "Appointment scheduling will be available in the next update",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Today's Appointments */}
        <Card className="bg-blue-100 dark:bg-blue-900 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {appointments.filter((app) => app.date === "2025-03-30").length}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming */}
        <Card className="bg-yellow-100 dark:bg-yellow-900 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              {getStatusCount("Upcoming")}
            </div>
          </CardContent>
        </Card>

        {/* Confirmed */}
        <Card className="bg-green-100 dark:bg-green-900 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {getStatusCount("Confirmed")}
            </div>
          </CardContent>
        </Card>

        {/* Cancelled */}
        <Card className="bg-red-100 dark:bg-red-900 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">
              {getStatusCount("Cancelled")}
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert variant="purple" className="mb-6">
        {/* <AlertCircle className="h-4 w-4" /> */}
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You have {getStatusCount("Upcoming")} upcoming appointments today.
          {getStatusCount("Upcoming") > 2
            ? " It's going to be a busy day!"
            : ""}
        </AlertDescription>
      </Alert>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger
            value="all"
            variant="all"
            onClick={() => setActiveTab("all")}
          >
            All ({appointments.length})
          </TabsTrigger>

          <TabsTrigger
            value="upcoming"
            variant="upcoming"
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({getStatusCount("Upcoming")})
          </TabsTrigger>

          <TabsTrigger
            value="confirmed"
            variant="confirmed"
            onClick={() => setActiveTab("confirmed")}
          >
            Confirmed ({getStatusCount("Confirmed")})
          </TabsTrigger>

          <TabsTrigger
            value="completed"
            variant="completed"
            onClick={() => setActiveTab("completed")}
          >
            Completed ({getStatusCount("Completed")})
          </TabsTrigger>

          <TabsTrigger
            value="cancelled"
            variant="cancelled"
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({getStatusCount("Cancelled")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">All Appointments</TabsContent>
        <TabsContent value="upcoming">Upcoming Appointments</TabsContent>
        <TabsContent value="confirmed">Confirmed Appointments</TabsContent>
        <TabsContent value="completed">Completed Appointments</TabsContent>
        <TabsContent value="cancelled">Cancelled Appointments</TabsContent>
      </Tabs>

      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No appointments found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium">
                        {appointment.patient}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Stethoscope className="mr-2 h-4 w-4" />
                      {appointment.doctor} • {appointment.specialty}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {appointment.date} • {appointment.time} •{" "}
                      {appointment.type}
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {appointment.status === "Upcoming" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(appointment.id, "Confirmed")
                          }
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(appointment.id, "Cancelled")
                          }
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {appointment.status === "Confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(appointment.id, "Completed")
                        }
                      >
                        Mark Complete
                      </Button>
                    )}

                    <Dialog
                      open={
                        deleteDialogOpen &&
                        appointmentToDelete === appointment.id
                      }
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              toast.info("Feature not yet implemented", {
                                description:
                                  "Edit functionality will be available soon",
                              })
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setAppointmentToDelete(appointment.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure absolutely sure?
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the appointment record.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleDeleteAppointment(appointment.id)
                            }
                          >
                            Delete Appointment
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}