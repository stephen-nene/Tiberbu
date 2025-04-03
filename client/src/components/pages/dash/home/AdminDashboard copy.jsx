import React, { useState } from 'react';
import { 
  CalendarRange, 
  Users, 
  UserCog, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  PlusCircle,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Layers,
  Activity
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Badge } from '@/components/shadcn/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");

  // Dummy data for appointments
  const appointments = [
    {
      id: 1,
      patient: "Emma Johnson",
      doctor: "Dr. Robert Chen",
      department: "Cardiology",
      date: "Apr 3, 2025",
      time: "09:30 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      patient: "James Wilson",
      doctor: "Dr. Sarah Miller",
      department: "Neurology",
      date: "Apr 3, 2025",
      time: "10:15 AM",
      status: "Confirmed",
    },
    {
      id: 3,
      patient: "Olivia Davis",
      doctor: "Dr. Michael Wong",
      department: "Pediatrics",
      date: "Apr 3, 2025",
      time: "11:00.AM",
      status: "Canceled",
    },
    {
      id: 4,
      patient: "Noah Thompson",
      doctor: "Dr. Jennifer Park",
      department: "Dermatology",
      date: "Apr 3, 2025",
      time: "01:45 PM",
      status: "Pending",
    },
    {
      id: 5,
      patient: "Sophia Rodriguez",
      doctor: "Dr. David Lee",
      department: "Orthopedics",
      date: "Apr 3, 2025",
      time: "03:30 PM",
      status: "Confirmed",
    },
  ];

  // Dummy data for patients
  const patients = [
    {
      id: 101,
      name: "Emma Johnson",
      age: 45,
      gender: "Female",
      phone: "(555) 123-4567",
      lastVisit: "Mar 12, 2025",
      condition: "Hypertension",
    },
    {
      id: 102,
      name: "James Wilson",
      age: 62,
      gender: "Male",
      phone: "(555) 234-5678",
      lastVisit: "Mar 22, 2025",
      condition: "Migraine",
    },
    {
      id: 103,
      name: "Olivia Davis",
      age: 7,
      gender: "Female",
      phone: "(555) 345-6789",
      lastVisit: "Feb 15, 2025",
      condition: "Common Cold",
    },
    {
      id: 104,
      name: "Noah Thompson",
      age: 32,
      gender: "Male",
      phone: "(555) 456-7890",
      lastVisit: "Mar 30, 2025",
      condition: "Eczema",
    },
    {
      id: 105,
      name: "Sophia Rodriguez",
      age: 54,
      gender: "Female",
      phone: "(555) 567-8901",
      lastVisit: "Mar 25, 2025",
      condition: "Fractured Wrist",
    },
  ];

  // Dummy data for staff
  const staff = [
    {
      id: 201,
      name: "Dr. Robert Chen",
      role: "Cardiologist",
      department: "Cardiology",
      status: "Active",
      patients: 28,
    },
    {
      id: 202,
      name: "Dr. Sarah Miller",
      role: "Neurologist",
      department: "Neurology",
      status: "Active",
      patients: 22,
    },
    {
      id: 203,
      name: "Dr. Michael Wong",
      role: "Pediatrician",
      department: "Pediatrics",
      status: "On Leave",
      patients: 0,
    },
    {
      id: 204,
      name: "Dr. Jennifer Park",
      role: "Dermatologist",
      department: "Dermatology",
      status: "Active",
      patients: 15,
    },
    {
      id: 205,
      name: "Dr. David Lee",
      role: "Orthopedic Surgeon",
      department: "Orthopedics",
      status: "Active",
      patients: 19,
    },
  ];

  // Dummy analytics data
  const analyticsData = {
    totalAppointments: 42,
    completedAppointments: 31,
    canceledAppointments: 5,
    pendingAppointments: 6,
    totalPatients: 328,
    newPatientsThisMonth: 24,
    totalStaff: 45,
    activeStaff: 42,
    departments: 12,
    averageWaitTime: "18 mins",
    bedOccupancy: "78%",
    emergencyVisits: 15,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Active":
        return "bg-green-100 text-green-800";
      case "On Leave":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-16 md:w-64 bg-white border-r flex flex-col">
        <div className="p-4 flex items-center justify-center md:justify-start">
          <Activity className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-800 hidden md:inline">
            MediAdmin
          </span>
        </div>

        <div className="flex-1 mt-6">
          <nav className="space-y-1 px-2">
            <Button
              variant={activeTab === "appointments" ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab("appointments")}
            >
              <CalendarRange className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Appointments</span>
            </Button>

            <Button
              variant={activeTab === "patients" ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab("patients")}
            >
              <Users className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Patients</span>
            </Button>

            <Button
              variant={activeTab === "staff" ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab("staff")}
            >
              <UserCog className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Staff</span>
            </Button>

            <Button
              variant={activeTab === "analytics" ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Analytics</span>
            </Button>

            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Settings</span>
            </Button>
          </nav>
        </div>

        <div className="p-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@hospital.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {activeTab === "appointments" && "Appointments Management"}
              {activeTab === "patients" && "Patient Management"}
              {activeTab === "staff" && "Staff Management"}
              {activeTab === "analytics" && "Reports & Analytics"}
              {activeTab === "settings" && "System Settings"}
            </h1>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Today's Appointments</h2>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Appointment List</CardTitle>
                  <CardDescription>
                    Showing {appointments.length} appointments for April 3, 2025
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500">
                          <th className="pb-3 font-medium">Patient</th>
                          <th className="pb-3 font-medium">Doctor</th>
                          <th className="pb-3 font-medium">Department</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Time</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr
                            key={appointment.id}
                            className="border-t border-gray-200"
                          >
                            <td className="py-4">{appointment.patient}</td>
                            <td className="py-4">{appointment.doctor}</td>
                            <td className="py-4">{appointment.department}</td>
                            <td className="py-4">{appointment.date}</td>
                            <td className="py-4">{appointment.time}</td>
                            <td className="py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.totalAppointments}
                    </div>
                    <p className="text-sm text-gray-500">Next 7 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Completed Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <p className="text-sm text-gray-500">Out of 18 scheduled</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Average Wait Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.averageWaitTime}
                    </div>
                    <p className="text-sm text-gray-500">Today's average</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Patients Tab */}


          {/* Staff Tab */}
          {activeTab === "staff" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Staff Management</h2>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Staff Directory</CardTitle>
                  <CardDescription>
                    Manage hospital staff and assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500">
                          <th className="pb-3 font-medium">ID</th>
                          <th className="pb-3 font-medium">Name</th>
                          <th className="pb-3 font-medium">Role</th>
                          <th className="pb-3 font-medium">Department</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Patients</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff.map((member) => (
                          <tr
                            key={member.id}
                            className="border-t border-gray-200"
                          >
                            <td className="py-4">{member.id}</td>
                            <td className="py-4">{member.name}</td>
                            <td className="py-4">{member.role}</td>
                            <td className="py-4">{member.department}</td>
                            <td className="py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  member.status
                                )}`}
                              >
                                {member.status}
                              </span>
                            </td>
                            <td className="py-4">{member.patients}</td>
                            <td className="py-4">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  Schedule
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total Staff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.totalStaff}
                    </div>
                    <p className="text-sm text-gray-500">
                      Active: {analyticsData.activeStaff}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Departments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.departments}
                    </div>
                    <p className="text-sm text-gray-500">
                      Clinical & non-clinical
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">On Duty Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">32</div>
                    <p className="text-sm text-gray-500">Across all shifts</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}



          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              {/* Settings Tab - Continuation */}
              <div className="mb-6">
                <h2 className="text-lg font-medium">System Settings</h2>
                <p className="text-sm text-gray-500">
                  Configure system parameters and preferences
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Basic system configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Hospital Name
                          </label>
                          <Input
                            defaultValue="Metropolitan Medical Center"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Administrator Email
                          </label>
                          <Input
                            defaultValue="admin@hospital.com"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Contact Phone
                          </label>
                          <Input
                            defaultValue="(555) 123-4567"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Time Zone
                          </label>
                          <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                            <option>Eastern Time (ET)</option>
                            <option>Central Time (CT)</option>
                            <option>Mountain Time (MT)</option>
                            <option>Pacific Time (PT)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <Input
                          defaultValue="123 Medical Plaza Dr., Healthville, CA 90210"
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            Enable appointment reminders via email
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            Enable SMS notifications
                          </span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appointment Settings</CardTitle>
                      <CardDescription>
                        Configure appointment behavior
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            Default Appointment Duration
                          </label>
                          <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                            <option>15 minutes</option>
                            <option selected>30 minutes</option>
                            <option>45 minutes</option>
                            <option>60 minutes</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Schedule Start Time
                          </label>
                          <Input
                            type="time"
                            defaultValue="08:00"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Schedule End Time
                          </label>
                          <Input
                            type="time"
                            defaultValue="17:00"
                            className="mt-1"
                          />
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              defaultChecked
                            />
                            <span className="ml-2 text-sm">
                              Allow online booking
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              defaultChecked
                            />
                            <span className="ml-2 text-sm">
                              Require approval for new appointments
                            </span>
                          </label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save Changes</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        User roles and permissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            Default User Role
                          </label>
                          <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                            <option>Administrator</option>
                            <option selected>Staff</option>
                            <option>Doctor</option>
                            <option>Nurse</option>
                            <option>Receptionist</option>
                            <option>Read-only</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Password Policy
                          </label>
                          <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                            <option>Basic (8+ characters)</option>
                            <option selected>
                              Standard (8+ chars, 1 uppercase, 1 number)
                            </option>
                            <option>
                              Strong (12+ chars, uppercase, number, symbol)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Password Expiry
                          </label>
                          <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                            <option>30 days</option>
                            <option selected>90 days</option>
                            <option>180 days</option>
                            <option>Never</option>
                          </select>
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              defaultChecked
                            />
                            <span className="ml-2 text-sm">
                              Enable two-factor authentication
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              defaultChecked
                            />
                            <span className="ml-2 text-sm">
                              Auto-lock after inactivity (15 min)
                            </span>
                          </label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>System Backup & Maintenance</CardTitle>
                    <CardDescription>
                      Data protection and system updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Backup Frequency
                          </label>
                          <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                            <option>Every 6 hours</option>
                            <option selected>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Retention Period
                          </label>
                          <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                            <option>7 days</option>
                            <option selected>30 days</option>
                            <option>90 days</option>
                            <option>365 days</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Backup Storage Location
                        </label>
                        <Input
                          defaultValue="secure-cloud-backup.hospital.com"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Last Successful Backup
                        </label>
                        <p className="text-sm mt-1">April 3, 2025 03:15 AM</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          System Version
                        </label>
                        <p className="text-sm mt-1">MediAdmin v4.2.1</p>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            Automatic system updates
                          </span>
                        </label>
                      </div>

                      <div className="flex space-x-2">
                        <Button>Run Backup Now</Button>
                        <Button variant="outline">Restore from Backup</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications & Alerts</CardTitle>
                    <CardDescription>
                      System notification settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium block">
                          Email Notifications
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            New patient registrations
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            Appointment cancellations
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            Staff schedule changes
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            System alerts and warnings
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium block">
                          System Alerts
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            Low inventory warnings
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            Failed login attempts
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            Database connection issues
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm">
                            System performance alerts
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Notification Settings</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}