import React from "react";
import { Link } from "react-router-dom";
import { Truck, Map, Clock, HelpCircle, SendHorizonal } from "lucide-react";
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
              Spotter Daily{" "}
              <span className="text-green-600 dark:text-green-400">
                Driver Log
              </span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Simplifying electronic logging and trip management for
              professional drivers. Stay compliant, track hours, and optimize
              your routes with ease.
            </p>
            <div className="flex space-x-3 mt-6">
              <Button
                size="icon"
                variant="outline"
                className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800 rounded-full h-9 w-9"
              >
                <Truck size={18} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-800 rounded-full h-9 w-9"
              >
                <Map size={18} />
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
                <SendHorizonal size={18} />
              </Button>
            </div>
          </div>

          {/* Column 2: Features */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Features
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/route-tracking"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 flex items-center"
                >
                  <Map size={14} className="mr-2" /> Route Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/hours-log"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 flex items-center"
                >
                  <Clock size={14} className="mr-2" /> Hours of Service Log
                </Link>
              </li>
              <li>
                <Link
                  to="/compliance"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 flex items-center"
                >
                  <Truck size={14} className="mr-2" /> Compliance Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/reporting"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 flex items-center"
                >
                  <HelpCircle size={14} className="mr-2" /> Reporting
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
                  to="/fmcsa-rules"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                >
                  FMCSA Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/driver-support"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                >
                  Driver Support
                </Link>
              </li>
              <li>
                <Link
                  to="/tutorials"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  to="/eld-guide"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                >
                  ELD Guide
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
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                >
                  Support Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                >
                  Feedback
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
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
                  Get the latest updates, compliance tips, and industry
                  insights.
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
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Spotter Daily Driver Log. All rights
            reserved.
          </div>
          <div className="flex space-x-4 text-sm">
            <Link
              to="/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
            >
              Terms of Service
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
            >
              <ArrowUp size={14} className="mr-1" /> Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
