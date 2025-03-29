import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, Clock, HelpCircle, Phone } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 pt-12 pb-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Tib
              <span className="text-rose-600 dark:text-rose-400">ER</span>bu
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Streamlining healthcare appointment scheduling for improved
              patient care. Efficiently manage patient registrations, doctor
              schedules, and appointment bookings with our comprehensive system.
            </p>
            <div className="flex space-x-3 mt-6">
              <Button
                size="icon"
                variant="outline"
                className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800 rounded-full h-9 w-9"
              >
                <Calendar size={18} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-800 rounded-full h-9 w-9"
              >
                <User size={18} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-gray-800 rounded-full h-9 w-9"
              >
                <Clock size={18} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-800 rounded-full h-9 w-9"
              >
                <Phone size={18} />
              </Button>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/appointments"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center"
                >
                  <Calendar size={14} className="mr-2" /> Schedule Appointments
                </Link>
              </li>
              <li>
                <Link
                  to="/doctors"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center"
                >
                  <User size={14} className="mr-2" /> Find a Doctor
                </Link>
              </li>
              <li>
                <Link
                  to="/patient-portal"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center"
                >
                  <Clock size={14} className="mr-2" /> Patient Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/emergency"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center"
                >
                  <HelpCircle size={14} className="mr-2" /> Emergency Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/health-guidelines"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Health Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/patient-support"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Patient Support
                </Link>
              </li>
              <li>
                <Link
                  to="/tutorials"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Portal Tutorials
                </Link>
              </li>
              <li>
                <Link
                  to="/insurance-info"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Insurance Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/support"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Support Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Feedback
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="grid">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                  Stay Updated
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get the latest updates on health services, hospital programs,
                  and medical tips.
                </p>
              </div>
              <div className="flex space-x-3 mt-4">
                <Button
                  size="icon"
                  className="bg-blue-500 hover:bg-blue-600 rounded-full h-8 w-8"
                >
                  <Facebook size={18} />
                </Button>
                <Button
                  size="icon"
                  className="bg-sky-400 hover:bg-sky-600 rounded-full h-8 w-8"
                >
                  <Twitter size={18} />
                </Button>
                <Button
                  size="icon"
                  className="bg-fuchsia-500 hover:bg-fuchsia-600 rounded-full h-8 w-8"
                >
                  <Instagram size={18} />
                </Button>
                <Button
                  size="icon"
                  className="bg-teal-500 hover:bg-teal-600 rounded-full h-8 w-8"
                >
                  <Linkedin size={18} />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-l-md focus:outline-none"
              />
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Tiberbu Ke Hospital. All rights
            reserved.
          </div>
          <div className="flex space-x-4 text-sm">
            <Link
              to="/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
            >
              Terms of Service
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
            >
              <ArrowUp size={14} className="mr-1" /> Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}