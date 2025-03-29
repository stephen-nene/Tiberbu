import React, { useState } from "react";
import {
  Truck,
  Map,
  Clock,
  Shield,
  Navigation,
  Route,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";

import {
  BarChart2,
  Check,
  Cpu,
  AlertTriangle,
  Calculator,
  FileText,
  Database,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const detailedFeatures = [
    {
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      title: "Patient Management",
      description:
        "Comprehensive patient information management with insurance tracking and medical history.",
      details: [
        "Easy patient registration",
        "Insurance information tracking",
        "Medical history management",
      ],
    },
    {
      icon: BarChart2,
      color: "text-green-600 dark:text-green-400",
      title: "Doctor Management",
      description:
        "Organize healthcare providers by specialization with detailed availability tracking.",
      details: [
        "Specialization categorization",
        "Availability slot management",
        "Contact information tracking",
      ],
    },
    {
      icon: Calculator,
      color: "text-yellow-600 dark:text-yellow-400",
      title: "Appointment Scheduling",
      description:
        "Seamless appointment booking with real-time availability and conflict prevention.",
      details: [
        "Real-time availability checking",
        "Appointment status tracking",
        "Automated confirmation emails",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Appointment Reminders",
      color: "text-red-600 dark:text-red-400",
      description:
        "Automatic notifications to reduce no-shows and keep patients informed.",
      details: [
        "Email reminders",
        "SMS notifications",
        "Customizable reminder timing",
      ],
    },
  ];

  const keyFeatures = [
    {
      icon: FileText,
      title: "Patient Records",
      description:
        "Easily manage patient information, medical history, and insurance details in one place.",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: BarChart2,
      title: "Doctor Scheduling",
      description:
        "Track doctor availability and specializations to optimize healthcare resource allocation.",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Calculator,
      color: "text-red-600 dark:text-red-400",
      title: "Appointment Booking",
      description:
        "Streamlined appointment creation with conflict prevention and status tracking.",
    },
    {
      icon: Cpu,
      title: "Automated Workflows",
      description:
        "Reduce administrative burden with automated confirmations, reminders, and reporting.",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Streamline Your{" "}
            <span className="text-green-600 dark:text-green-400">
              Healthcare
            </span>
            <br />
            Scheduling{" "}
            <span className="text-blue-600 dark:text-blue-400">System</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            A comprehensive solution for healthcare providers to manage
            patients, appointments, and medical staff – all in one intuitive
            platform.
          </p>
          <div className="flex space-x-4 justify-center lg:justify-start">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              Get Started
              <ChevronRight className="ml-2" size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-2 bg-green-400/10 dark:bg-blue-400/10 rounded-full blur-2xl"></div>
            <Database
              size={320}
              className="relative text-green-600 dark:text-blue-400 opacity-20"
            />
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Designed for{" "}
              <span className="text-green-600 dark:text-green-400">
                Healthcare Professionals
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A powerful tool that transforms how you manage appointments and
              patient information.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 cursor-pointer rounded-xl p-6 transform transition-all hover:scale-105 hover:shadow-lg"
              >
                <feature.icon size={40} className={`mb-4 ${feature.color}`} />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Deep Dive */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive{" "}
              <span className="text-green-600 dark:text-green-400">
                Healthcare Management
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Designed specifically for medical practices to streamline
              operations and improve patient care.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {detailedFeatures.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg cursor-pointer transition-all duration-300 group"
              >
                <CardHeader>
                  <feature.icon
                    size={40}
                    className={`mb-4 ${feature.color} group-hover:scale-110 transition-transform`}
                  />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-300">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center">
                        <Check size={14} className="mr-2 text-green-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            System{" "}
            <span className="text-green-600 dark:text-green-400">
              Components
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <Database
                size={40}
                className="text-blue-600 dark:text-blue-400 mb-4"
              />
              <h3 className="font-bold mb-2">Patient Management</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Personal Information</li>
                <li>Insurance Details</li>
                <li>Medical History</li>
                <li>Contact Information</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <Calculator
                size={40}
                className="text-green-600 dark:text-green-400 mb-4"
              />
              <h3 className="font-bold mb-2">Doctor Management</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Specialization Tracking</li>
                <li>Availability Management</li>
                <li>Contact Information</li>
                <li>Schedule Optimization</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <BarChart2
                size={40}
                className="text-indigo-600 dark:text-indigo-400 mb-4"
              />
              <h3 className="font-bold mb-2">Appointment System</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Easy Appointment Creation</li>
                <li>Status Tracking</li>
                <li>Conflict Prevention</li>
                <li>Automated Reminders</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <FileText
                size={40}
                className="text-orange-600 dark:text-orange-400 mb-4"
              />
              <h3 className="font-bold mb-2">Medical Records</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Detailed Patient History</li>
                <li>Treatment Records</li>
                <li>Prescription Tracking</li>
                <li>Secured Access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Transform Your Healthcare Practice
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join the future of healthcare management. Efficient, organized, and
            patient-focused scheduling starts here.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => setIsModalOpen(true)}
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Input Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>
              Get Started with Healthcare Scheduling System
            </DialogTitle>
          </DialogHeader>

          <DialogDescription id="dialog-description">
            Provide the following details to schedule a demo.
          </DialogDescription>

          <div className="space-y-4">
            <p>To learn more about our healthcare scheduling system:</p>
            {/* Basic input form would go here */}
            <div className="grid gap-4">
              <input
                placeholder="Practice Name"
                className="w-full p-2 border rounded"
              />
              <input
                placeholder="Your Name"
                className="w-full p-2 border rounded"
              />
              <input
                placeholder="Email Address"
                className="w-full p-2 border rounded"
              />
              <input
                placeholder="Phone Number"
                className="w-full p-2 border rounded"
              />
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Schedule Demo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

