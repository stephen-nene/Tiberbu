import React from "react";
import { Outlet } from "react-router-dom";
import DashNav from "./DashNav";

export default function DashLayout() {
  return (
    <>
      <DashNav />

      <div className="co ntainer mx-auto min-h-screen py-5 px-5">
        <Outlet />
      </div>
    </>
  );
}
