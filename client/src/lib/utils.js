import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import {
  Home,
  Calendar,
  Clock,
  Users,
  User,
  Stethoscope,
  Syringe,
  Pill,
  ClipboardCheck,
  Settings,
  BookOpenCheck,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  Bed,
  Activity,
  FileText,
  HeartPulse,
  ScanEye,
} from "lucide-react";



export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const filterNavigation = (navItems, userRole) => {
  return navItems
    .filter((item) => {
      // Filter the top-level navigation item based on the user role
      if (item.requiredRole && item.requiredRole !== userRole) {
        return false;
      }

      // If the item has children, filter those as well
      if (item.hasDropdown && item.children) {
        item.children = item.children.filter((child) => {
          return child.requiredRole === userRole;
        });
      }

      return true; // Keep the item
    })
    .map((item) => {
      // If it has children, process them recursively
      if (item.hasDropdown && item.children) {
        item.children = filterNavigation(item.children, userRole);
      }
      return item;
    });
};



export const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "Appointments",
    path: "/dashboard/appointments",
    icon: Calendar,
    hasDropdown: true,
    roleRequired: ["admin", "doctor", "receptionist", "nurse"],
    children: [
      {
        name: "Schedule",
        path: "/dashboard/appointments/schedule",
        icon: CalendarClock,
        roleRequired: ["admin", "doctor", "receptionist"],
      },
      {
        name: "Upcoming",
        path: "/dashboard/appointments/upcoming",
        icon: CalendarCheck,
        roleRequired: ["admin", "doctor", "receptionist", "nurse"],
      },
      {
        name: "Completed",
        path: "/dashboard/appointments/completed",
        icon: BookOpenCheck,
        roleRequired: ["admin", "doctor"],
      },
      {
        name: "Cancelled",
        path: "/dashboard/appointments/cancelled",
        icon: CalendarX,
        roleRequired: ["admin", "receptionist"],
      },
    ],
  },
  {
    name: "Patients",
    path: "/dashboard/patients",
    icon: User,
    hasDropdown: true,
    roleRequired: ["admin", "doctor", "receptionist"],
    children: [
      {
        name: "Directory",
        path: "/dashboard/patients",
        icon: Users,
        roleRequired: ["admin", "doctor", "receptionist"],
      },
      {
        name: "Medical Records",
        path: "/dashboard/patients/records",
        icon: FileText,
        roleRequired: ["admin", "doctor"],
      },
      {
        name: "New Patient",
        path: "/dashboard/patients/new",
        icon: User,
        roleRequired: ["admin", "receptionist"],
      },
    ],
  },
  {
    name: "Medical Staff",
    path: "/dashboard/staff",
    icon: Stethoscope,
    hasDropdown: true,
    roleRequired: ["admin"],
    children: [
      {
        name: "Doctors",
        path: "/dashboard/staff/doctors",
        icon: Stethoscope,
      },
      {
        name: "Nurses",
        path: "/dashboard/staff/nurses",
        icon: Syringe,
      },
      {
        name: "Receptionists",
        path: "/dashboard/staff/receptionists",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    name: "Ward Management",
    path: "/dashboard/wards",
    icon: Bed,
    roleRequired: ["admin", "nurse"],
    hasDropdown: true,
    children: [
      {
        name: "Bed Availability",
        path: "/dashboard/wards/availability",
        icon: Bed,
        roleRequired: ["admin", "nurse", "receptionist"],
      },
      {
        name: "Patient Admissions",
        path: "/dashboard/wards/admissions",
        icon: HeartPulse,
        roleRequired: ["admin", "nurse"],
      },
    ],
  },
  {
    name: "Pharmacy",
    path: "/dashboard/pharmacy",
    icon: Pill,
    roleRequired: ["admin", "pharmacist"],
    hasDropdown: true,
    children: [
      {
        name: "Inventory",
        path: "/dashboard/pharmacy/inventory",
        icon: Pill,
      },
      {
        name: "Prescriptions",
        path: "/dashboard/pharmacy/prescriptions",
        icon: ScanEye,
      },
    ],
  },
  {
    name: "Reports",
    path: "/dashboard/reports",
    icon: Activity,
    roleRequired: ["admin"],
    hasDropdown: true,
    children: [
      {
        name: "Appointments",
        path: "/dashboard/reports/appointments",
        icon: Calendar,
      },
      {
        name: "Financial",
        path: "/dashboard/reports/financial",
        icon: Activity,
      },
    ],
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
    hasDropdown: true,
    roleRequired: ["admin"],
    children: [
      {
        name: "Profile",
        path: "/dashboard/settings/profile",
        icon: User,
      },
      {
        name: "Hospital Info",
        path: "/dashboard/settings/hospital",
        icon: Home,
      },
    ],
  },
];
