// routes.js
import { lazy } from "react";

const AuthRoutes = {
  Login: lazy(() => import("../pages/auth/Login.jsx")),
  Register: lazy(() => import("../pages/auth/Signup.jsx")),
  Reset: lazy(() => import("../pages/auth/Reset.jsx")),
  Forgot: lazy(() => import("../pages/auth/Forgot.jsx")),
  Activate: lazy(() => import("../pages/auth/Activate.jsx")),
};

const LayoutRoutes = {
  AvailabilityLayout: lazy(() =>
    import("../../components/layouts/AvailabilityLayout.jsx")
  ),
  DashboardLayout: lazy(() =>
    import("../../components/layouts/Dashlayout.jsx")
  ),
  UsersLayout: lazy(() => import("../../components/layouts/UsersLayout.jsx")),
  PatientsLayout: lazy(() =>
    import("../../components/layouts/PatientsLayout.jsx")
  ),
  AppointmentsLayout: lazy(()=>import("../../components/layouts/AppointmentsLayout.jsx")),
};

const DashRoutes = {
  Dashboard: lazy(() => import("../pages/dash/home/Dashboard.jsx")),

  Availability: lazy(() =>
    import("../pages/dash/availability/Availability.jsx")
  ),
  Appointments: lazy(() =>
    import("../pages/dash/appointments/Appointments.jsx")
  ),
  NewAppointments: lazy(() =>
    import("../pages/dash/appointments/NewAppointments.jsx")
  ),
  NewAvailability: lazy(() =>
    import("../pages/dash/availability/NewAvailability.jsx")
  ),
  Profile: lazy(() => import("../pages/dash/Profile.jsx")),
  Security: lazy(() => import("../pages/dash/Security.jsx")),

  Patients: lazy(() => import("../pages/dash/users/Patients/Patients.jsx")),
  Records: lazy(() => import("../pages/dash/users/Records/Records.jsx")),
  // Users: lazy(() => import("../Components/pages/dash/Users.jsx")),
};

import Home from "../pages/public/Home.jsx";
import Record from "../pages/public/Record.jsx";
import Doctors from "../pages/public/Doctors.jsx";
import Patients from "../pages/public/Patients.jsx";
import Appointments from "../pages/public/Appointments.jsx";
import Logs from "../pages/public/Doctors.jsx";

// import Training from "../pages/public/training.jsx";
import Error404 from "../pages/utils/Error404.jsx";
import ComingSoon from "../pages/utils/ComminSoon.jsx";
import ComingSoon2 from "../pages/utils/ComminSoon copy.jsx";

// Route configurations
export const routes = [
  // Public Routes
  { path: "/", element: Home },
  { path: "/records", element: Record },
  { path: "/doctors", element: Doctors },
  { path: "/patients", element: Patients },
  { path: "/appointments", element: Appointments },

  { path: "/logs", element: Logs },

  // authentication routes
  { path: "/login", element: AuthRoutes.Login },
  { path: "/register", element: AuthRoutes.Register },
  { path: "/forgot", element: AuthRoutes.Forgot },
  { path: "/activate/:token", element: AuthRoutes.Activate },
  { path: "/reset/:token", element: AuthRoutes.Reset },

  // Protected Routes
  {
    path: "/profile",
    element: DashRoutes.Profile,
    protected: true,
    allowPendingAccess: true,
  },
  // Dashboard Routes
  // {
  //   path: "/dashboard/home",
  //   element: DashRoutes.Dashboard,
  //   protected: true,
  //   roles: ["admin", "user"],
  // },

  {
    path: "/dashboard/",
    element: LayoutRoutes.DashboardLayout,
    protected: true,
    roles: ["system_admin", "clinician", "patient"],
    children: [
      {
        path: "",
        element: DashRoutes.Dashboard,
        protected: true,
        roles: ["system_admin", "clinician", "patient"],
      },
      {
        path: "settings/profile",
        element: DashRoutes.Profile,
        protected: true,
        // roles: ["system_admin", "clinician", "patient"],
      },

      {
        path: "availability",
        element: LayoutRoutes.AvailabilityLayout,
        protected: true,
        roles: ["system_admin"],
        children: [
          {
            path: "",
            element: DashRoutes.Availability,
            protected: true,
            roles: ["system_admin"],
          },
          {
            path: "new",
            element: DashRoutes.NewAvailability,
            protected: true,
            roles: ["system_admin", "clinician"],
          },
          // {
          //   path: "*",
          //   element: ComingSoon,
          // },
        ],
      },
      {
        path: "appointments",
        element: LayoutRoutes.AppointmentsLayout,
        protected: true,
        roles: ["system_admin"],
        children: [
          {
            path: "",
            element: DashRoutes.Appointments,
            protected: true,
            roles: ["system_admin", "clinician"],
          },
          {
            path: "Schedule",
            element: DashRoutes.NewAppointments,
            protected: true,
            roles: ["system_admin", "clinician"],
          },
          {
            path: "*",
            element: ComingSoon2,
          },
        ],
      },
      {
        path: "patients",
        element: LayoutRoutes.PatientsLayout,
        protected: true,
        roles: ["system_admin"],
        children: [
          {
            path: "",
            element: DashRoutes.Patients,
            protected: true,
            roles: ["system_admin", "clinician"],
          },
          {
            path: "records",
            element: DashRoutes.Records,
            protected: true,
            roles: ["system_admin"],
          },
          // {
          //   path: "staff",
          //   element: DashRoutes.StaffManagement,
          //   protected: true,
          //   roles: ["system_admin"],
          // },
          {
            path: "*",
            element: ComingSoon2,
          },
        ],
      },

      {
        path: "settings/security",
        element: DashRoutes.Security,
        protected: true,
        roles: ["system_admin", "clinician"],
      },

      // Add other dashboard routes as needed
      { path: "*", element: ComingSoon }, // For routes that aren't implemented yet
    ],
  },

  // 404 Route
  { path: "*", element: Error404 },
  { path: "/commingsoon", element: ComingSoon },
];
