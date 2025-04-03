import React from 'react'
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

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
  Activity,
} from "lucide-react";

export default function Patients() {
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

  return (
    <div>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Patient Records</h2>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Patient List</CardTitle>
            <CardDescription>
              Manage patient information and medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Age</th>
                    <th className="pb-3 font-medium">Gender</th>
                    <th className="pb-3 font-medium">Phone</th>
                    <th className="pb-3 font-medium">Last Visit</th>
                    <th className="pb-3 font-medium">Condition</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-t border-gray-200">
                      <td className="py-4">{patient.id}</td>
                      <td className="py-4">{patient.name}</td>
                      <td className="py-4">{patient.age}</td>
                      <td className="py-4">{patient.gender}</td>
                      <td className="py-4">{patient.phone}</td>
                      <td className="py-4">{patient.lastVisit}</td>
                      <td className="py-4">{patient.condition}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
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
              <CardTitle className="text-base">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analyticsData.totalPatients}
              </div>
              <p className="text-sm text-gray-500">Registered patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analyticsData.newPatientsThisMonth}
              </div>
              <p className="text-sm text-gray-500">April 2025</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Current Inpatients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">43</div>
              <p className="text-sm text-gray-500">
                Bed occupancy: {analyticsData.bedOccupancy}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
