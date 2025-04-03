import React from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

const UsersLayout = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage all your users
        </p>
      </div>

      {/* Secondary navigation (tabs) for users section */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4">
          <NavLink
            to="/dashboard/users"
            end // This ensures it matches only `/dashboard/users` exactly
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-teal-500 text-teal-600 dark:text-teal-400"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              }`
            }
          >
            All Users
          </NavLink>

          <NavLink
            to="/dashboard/users/doctors"
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-teal-500 text-teal-600 dark:text-teal-400"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              }`
            }
          >
            Doctors
          </NavLink>

          <NavLink
            to="/dashboard/users/customers"
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-teal-500 text-teal-600 dark:text-teal-400"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              }`
            }
          >
            Customers
          </NavLink>

          <NavLink
            to="/dashboard/users/staff"
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-teal-500 text-teal-600 dark:text-teal-400"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              }`
            }
          >
            Staff
          </NavLink>
        </nav>
      </div>

      {/* Child routes will render here */}
      <Outlet />
    </div>
  );
};

export default UsersLayout;
