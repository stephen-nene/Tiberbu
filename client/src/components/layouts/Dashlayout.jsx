import React from "react";
import { Outlet } from "react-router-dom";
import DashNav from "./DashNav";

export default function DashLayout() {
  return (
    <>
      <DashNav />

      <div className="container mx-auto min-h-screen ">
        <Outlet />
      </div>
    </>
  );
}
