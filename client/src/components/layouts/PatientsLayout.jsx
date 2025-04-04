import React from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";


const PatientsLayout = () => {
  return (
    <div className="p-4 md:p-6">
      {/* <div className="mb-3">
        <h1 className="text-2xl font-bold">Patients Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage all your Patients
        </p>
      </div> */}

      {/* Secondary navigation (tabs) for users section */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4">
          <NavLink
            to="/dashboard/patients"
            end // This ensures it matches only `/dashboard/users` exactly
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-teal-500 text-teal-600 dark:text-teal-400"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              }`
            }
          >
            All Patients
          </NavLink>

          <NavLink
            to="/dashboard/patients/records"
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-teal-500 text-teal-600 dark:text-teal-400"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              }`
            }
          >
            Records
          </NavLink>
        </nav>
      </div>

      {/* Child routes will render here */}
      <Outlet />
    </div>
  );
};

export default PatientsLayout;
