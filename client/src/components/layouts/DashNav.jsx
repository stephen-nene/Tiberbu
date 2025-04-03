import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Home,
  Truck,
  ClipboardCheck,
  BarChart,
  User,
  Users,
  Sun,
  Moon,
  Map,
  Bell,
  ShoppingCart,
  Settings,
  ChevronDown,
  ChevronRight,
  Package,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";

const DashNav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loggedIn, logOut, darkMode, toggleDarkMode } = useUserStore();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleExpand = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleLogout = () => {
    toast("Are you sure you want to logout?", {
      action: {
        label: "Confirm",
        onClick: () => {
          logOut(navigate);
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
      duration: Infinity,
    });
  };

  // Reorganized navigation items with dropdowns
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Shipments",
      path: "/dashboard/shipments",
      icon: <Truck className="w-5 h-5" />,
      hasDropdown: true,
      children: [
        {
          name: "All Shipments",
          path: "/dashboard/shipments",
          icon: <Package className="w-4 h-4" />,
        },
        {
          name: "Dispatch",
          path: "/dashboard/shipments/dispatch",
          icon: <Truck className="w-4 h-4" />,
        },
        {
          name: "Receive",
          path: "/dashboard/shipments/receive",
          icon: <ClipboardCheck className="w-4 h-4" />,
        },
        {
          name: "Track",
          path: "/dashboard/shipments/track",
          icon: <Map className="w-4 h-4" />,
        },
      ],
    },
    // {
    //   name: "Assign",
    //   path: "/dashboard/shipments/dispatch",
    //   icon: <ClipboardCheck className="w-5 h-5" />,
    // },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <Users className="w-5 h-5" />,
      hasDropdown: true,
      children: [
        {
          name: "Drivers",
          path: "/dashboard/users/drivers",
          icon: <User className="w-4 h-4" />,
        },
        {
          name: "Customers",
          path: "/dashboard/users/customers",
          icon: <Users className="w-4 h-4" />,
        },
        {
          name: "Staff",
          path: "/dashboard/users/staff",
          icon: <User className="w-4 h-4" />,
        },
      ],
      // Only show to admin
      roleRequired: "admin",
    },
    // {
    //   name: "Tracking",
    //   path: "/dashboard/tracking",
    //   icon: <Map className="w-5 h-5" />,
    // },
    {
      name: "Reports",
      path: "/dashboard/reports",
      icon: <BarChart className="w-5 h-5" />,
      hasDropdown: true,
      children: [
        {
          name: "Delivery Performance",
          path: "/dashboard/reports/delivery",
          icon: <Clock className="w-4 h-4" />,
        },
        {
          name: "Financial Summary",
          path: "/dashboard/reports/financial",
          icon: <FileText className="w-4 h-4" />,
        },
      ],
      // Only show to admin and manager
      roleRequired: ["admin", "manager"],
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
      hasDropdown: true,
      children: [
        {
          name: "Profile",
          path: "/dashboard/settings/profile",
          icon: <Clock className="w-4 h-4" />,
          roleRequired: ["admin", "manager", "staff"],
        },
        // {
        //   name: "Account",
        //   path: "/dashboard/reports/financial",
        //   icon: <FileText className="w-4 h-4" />,
        // },
      ],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roleRequired) return true;
    if (Array.isArray(item.roleRequired)) {
      return item.roleRequired.includes(user?.role);
    }
    return item.roleRequired === user?.role;
  });

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.path;
    const isExpanded = expandedItems[item.name];

    return (
      <div key={item.name}>
        {item.hasDropdown ? (
          <>
            <Button
              size="xl"
              variant="outline"
              onClick={() => toggleExpand(item.name)}
              className={`w-full mb-5  flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors
                ${
                  isActive || isExpanded
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <div className="flex items-center">
                <div
                  className={`${
                    isActive ? "text-teal-500" : "text-gray-500"
                  } mr-3`}
                >
                  {item.icon}
                </div>
                <span
                  className={`font-medium text-sm ${
                    isActive
                      ? "text-teal-500"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {item.name}
                </span>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </Button>

            {isExpanded && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => {
                  const isChildActive = location.pathname === child.path;
                  return (
                    <Link
                      key={child.name}
                      to={child.path}
                      className={`flex items-center mb-4 px-4 py-2 rounded-lg transition-colors ${
                        isChildActive
                          ? "bg-teal-500 text-white"
                          : "text-gray-600 border border-gray-300 dark:border-gray-700 hover:bg-teal-100 dark:text-gray-900 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div
                        className={`${
                          isChildActive ? "text-white" : "text-gray-500"
                        } mr-3`}
                      >
                        {child.icon}
                      </div>
                      <span
                        className={`font-medium text-sm ${
                          isChildActive
                            ? "text-white"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {child.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.path}
            className={`flex border items-center mb-5 px-4 py-2.5 rounded-lg transition-colors ${
              isActive
                ? "bg-teal-500 text-white"
                : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <div
              className={`${isActive ? "text-white" : "text-gray-500"} mr-3`}
            >
              {item.icon}
            </div>
            <span
              className={`font-medium text-sm ${
                isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {item.name}
            </span>
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Nav */}
      <nav className="sticky  top-0 z-20 w-full border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white ">
        <div className="px-4 sm:px-6 container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <span className="text-2xl font-bold">
                  <span className="font-bold text-blue-900 dark:text-white">
                    tibe
                  </span>
                  <span className="text-rose-500 font-bold">rbu</span>
                </span>
              </div>
              <Button
                variant="ghost"
                // size="icon"
                onClick={toggleSidebar}
                className=""
              >
                <Menu />
              </Button>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-5">
              {/* Cart */}
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors relative bg-gray-50 dark:bg-gray-800 p-2 rounded-full">
                <ShoppingCart size={20} />
              </button>

              {/* Notification */}
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors relative bg-gray-50 dark:bg-gray-800 p-2 rounded-full">
                <Bell size={20} />
                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span> */}
              </button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full"
              >
                {darkMode ? (
                  <Sun className="text-yellow-400" />
                ) : (
                  <Moon size={20} />
                )}
              </Button>

              {/* Avatar */}
              <div className="flex items-center">
                <Link
                  to="/dashboard/profile"
                  className="flex items-center space-x-2 p-0.9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
                    <AvatarImage
                      src={user?.photoUrl || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>
                      {user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dark overlay when sidebar is open */}
      {/* <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      /> */}

      {/* Sidebar */}
      <aside
        className={`h-screen w-64 bg-gray-100 dark:bg-gray-950 fixed top-0 left-0 z-30 transform transition-transform duration-300 ease-in-out overflow-y-auto 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x -0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-950">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold cursor-pointer">
              <span className="font-bold text-blue-900 dark:text-white">
                tibe
              </span>
              <span className="text-rose-500 font-bold">rbu</span>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className=""
          >
            <X size={24} />
          </Button>
        </div>

        {/* Nav Items */}
        <div className="mt-6 px-4">
          <nav className="space-y-1">
            {filteredNavItems.map(renderNavItem)}

            {/* Logout Button */}
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 rounded-lg transition-colors mt-8"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm">Log Out</span>
            </Button>
          </nav>
        </div>
      </aside>

      {/* Spacer for content when sidebar is open */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0"></div>
    </>
  );
};

export default DashNav;
