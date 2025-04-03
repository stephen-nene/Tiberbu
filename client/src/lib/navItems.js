// navItems.js
export const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "Home", // Use a string key for the icon
  },
  {
    name: "Appointments",
    path: "/dashboard/appointments",
    icon: "Truck", // Use a string key for the icon
    hasDropdown: true,
    roleRequired: ["system_admin", "manager", "staff"],
    children: [
      {
        name: "All",
        path: "/dashboard/appointments",
        icon: "Clock", // Icon for All Appointments
        roleRequired: ["system_admin", "manager"],
      },
      {
        name: "Upcoming",
        path: "/dashboard/appointments/upcoming",
        icon: "Clock", // Icon for Upcoming Appointments
        roleRequired: ["system_admin", "manager", "staff"],
      },
      {
        name: "Completed",
        path: "/dashboard/appointments/completed",
        icon: "Clock", // Icon for Completed Appointments
        roleRequired: ["system_admin", "manager", "staff"],
      },
      {
        name: "Cancelled",
        path: "/dashboard/appointments/cancelled",
        icon: "Clock", // Icon for Cancelled Appointments
        roleRequired: ["system_admin", "manager", "staff"],
      },
    ],
  },
  {
    name: "Users",
    path: "/dashboard/users",
    icon: "Users", // Icon for Users
    hasDropdown: true,
    children: [
      {
        name: "Admins",
        path: "/dashboard/users/admins",
        icon: "User", // Icon for Admins
        roleRequired: ["system_admin", "manager", "staff"],
      },
      {
        name: "Clinicians",
        path: "/dashboard/users/clinicians",
        icon: "User", // Icon for Clinicians
        roleRequired: ["system_admin", "manager", "staff"],
      },
      {
        name: "Patients",
        path: "/dashboard/users/patients",
        icon: "User", // Icon for Patients
        roleRequired: ["system_admin", "manager", "staff", "clinician"],
      },
    ],
  },
  {
    name: "Tracking",
    path: "/dashboard/tracking",
    icon: "Map", // Icon for Tracking
    roleRequired: ["system_admin", "manager"],
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: "Settings", // Icon for Settings
    hasDropdown: true,
    children: [
      {
        name: "Profile",
        path: "/dashboard/settings/profile",
        icon: "Clock", // Icon for Profile
        roleRequired: ["system_admin", "manager", "staff"],
      },
    ],
  },
];
