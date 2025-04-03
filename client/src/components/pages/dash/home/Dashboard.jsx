import React from "react";
import { useUserStore } from "@/store/useUserStore";
import AdminDashboard from "./AdminDashboard.jsx";
import DoctorDashboard from "./DoctorDashboard.jsx";
import PatientDashboard from "./PatientDashboard.jsx";


export default function Dashboard() {

  const user = useUserStore((state) => state.user); 

  return (
    <div className="min-h-screen bg-sk y-500 p-3">
      <h1>Welcome to the Hospital Management System</h1>
      {user.role === "system_admin" && <AdminDashboard />}
      {user.role === "clinician" && <DoctorDashboard />}
      {user.role === "patient" && <PatientDashboard />}
    </div>
  );
}
