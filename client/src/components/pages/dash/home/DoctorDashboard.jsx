import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

export default function DoctorDashboard() {

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
  return (
    <div>
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
  );
}
