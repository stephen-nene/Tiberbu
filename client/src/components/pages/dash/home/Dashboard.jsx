import React from "react";
import { useUserStore } from "@/store/useUserStore";
import AdminDashboard from "./AdminDashboard.jsx";
import DoctorDashboard from "./DoctorDashboard.jsx";
import PatientDashboard from "./PatientDashboard.jsx";



export default function Dashboard() {
  const user = useUserStore((state) => state.user); // Get the user role

  return (
    <div className="min-h-screen bg-sky-500">
      <h1>Welcome to the Hospital Management System</h1>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "clinician" && <DoctorDashboard />}
      {user.role === "patient" && <PatientDashboard />}
    </div>
  );
}
