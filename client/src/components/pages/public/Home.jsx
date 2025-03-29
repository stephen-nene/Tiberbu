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
      title: "Patient Data Management",
      description:
        "Centralized database for patient information, reducing administrative overhead and data entry errors.",
      details: [
        "Structured patient profiles",
        "Insurance validation automation",
        "Digital medical history access",
      ],
    },
    {
      icon: BarChart2,
      color: "text-green-600 dark:text-green-400",
      title: "Staff Scheduling & Optimization",
      description:
        "Maximize clinical staff utilization while preventing burnout through intelligent scheduling.",
      details: [
        "Specialization-based assignments",
        "Optimal staff distribution",
        "Reduced administrative overhead",
      ],
    },
    {
      icon: Calculator,
      color: "text-yellow-600 dark:text-yellow-400",
      title: "Resource Allocation",
      description:
        "Improve facility utilization and reduce wait times with data-driven resource allocation.",
      details: [
        "Room occupancy optimization",
        "Equipment usage tracking",
        "Staffing efficiency metrics",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Compliance & Reporting",
      color: "text-red-600 dark:text-red-400",
      description:
        "Maintain regulatory compliance with automated record-keeping and reporting functions.",
      details: [
        "Regulatory documentation",
        "Audit-ready reporting",
        "Compliance risk monitoring",
      ],
    },
  ];

  const keyFeatures = [
    {
      icon: FileText,
      title: "Administrative Efficiency",
      description:
        "Reduce administrative workload by 40% through automation of scheduling, record-keeping, and patient processing.",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: BarChart2,
      title: "Operational Analytics",
      description:
        "Gain actionable insights through comprehensive analytics on patient flow, staff utilization, and facility usage.",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Calculator,
      color: "text-red-600 dark:text-red-400",
      title: "Cost Reduction",
      description:
        "Lower operational costs through efficient staff scheduling, reduced no-shows, and optimized resource allocation.",
    },
    {
      icon: Cpu,
      title: "Seamless Integration",
      description:
        "Easily integrates with existing hospital systems including EHR, billing, and pharmacy management software.",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Tiberbu{" "}
            <span className="text-green-600 dark:text-green-400">
              Healthcare
            </span>
            <br />
            Management{" "}
            <span className="text-blue-600 dark:text-blue-400">Solution</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            Revolutionize your hospital's operational efficiency with our
            integrated scheduling and management system designed specifically
            for Tiberbu Hospital.
          </p>
          <div className="flex space-x-4 justify-center lg:justify-start">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              View Implementation Plan
              <ChevronRight className="ml-2" size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              System Architecture
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
                Hospital Administration
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Empowering your management team with data-driven tools to optimize
              operations and enhance care delivery.
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
              Operational{" "}
              <span className="text-green-600 dark:text-green-400">
                Excellence
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our system addresses the unique challenges faced by Tiberbu
              Hospital's administration.
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
            Technical{" "}
            <span className="text-green-600 dark:text-green-400">
              Implementation
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <Database
                size={40}
                className="text-blue-600 dark:text-blue-400 mb-4"
              />
              <h3 className="font-bold mb-2">Database Architecture</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Django ORM Integration</li>
                <li>Secure Data Storage</li>
                <li>Scalable Infrastructure</li>
                <li>Redundant Backups</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <Calculator
                size={40}
                className="text-green-600 dark:text-green-400 mb-4"
              />
              <h3 className="font-bold mb-2">System Performance</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>High-speed Query Processing</li>
                <li>Concurrent User Support</li>
                <li>Load Balancing</li>
                <li>99.9% Uptime Guarantee</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <BarChart2
                size={40}
                className="text-indigo-600 dark:text-indigo-400 mb-4"
              />
              <h3 className="font-bold mb-2">Analytics Dashboard</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Real-time Data Visualization</li>
                <li>Custom Report Generation</li>
                <li>Department-specific KPIs</li>
                <li>Trend Analysis</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <FileText
                size={40}
                className="text-orange-600 dark:text-orange-400 mb-4"
              />
              <h3 className="font-bold mb-2">Documentation & Training</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Comprehensive Admin Guide</li>
                <li>Staff Training Materials</li>
                <li>Technical Documentation</li>
                <li>Knowledge Base Access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Return on{" "}
            <span className="text-green-600 dark:text-green-400">
              Investment
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Quantifiable benefits Tiberbu Hospital can expect from implementing
            our system.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              30%
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Administrative Time Saved
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Reduction in time spent on scheduling, data entry, and patient
              processing
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              25%
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Reduction in No-shows
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Through automated reminders and efficient rescheduling
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              15%
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Increase in Facility Utilization
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Better resource allocation and scheduling optimization
            </p>
          </div>
        </div>
      </div>

      {/* Implementation Timeline */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Implementation{" "}
              <span className="text-blue-600 dark:text-blue-400">Timeline</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A strategic approach to system deployment with minimal disruption
              to hospital operations.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                Phase 1
              </div>
              <h3 className="text-xl font-semibold mb-3">
                System Setup & Configuration
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500" />
                  <span>Database implementation and configuration</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500" />
                  <span>Server infrastructure deployment</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500" />
                  <span>Admin user setup and access control</span>
                </li>
              </ul>
              <div className="mt-4 text-sm text-gray-500">
                Timeline: 2 weeks
              </div>
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                Phase 2
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Data Migration & Testing
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500" />
                  <span>Existing patient data migration</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500" />
                  <span>Doctor and staff onboarding</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500" />
                  <span>System integration testing</span>
                </li>
              </ul>
              <div className="mt-4 text-sm text-gray-500">
                Timeline: 3 weeks
              </div>
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                Phase 3
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Staff Training & Deployment
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500" />
                  <span>Department-specific training sessions</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500" />
                  <span>Phased go-live by department</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500" />
                  <span>Post-implementation support</span>
                </li>
              </ul>
              <div className="mt-4 text-sm text-gray-500">
                Timeline: 4 weeks
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Tiberbu Hospital's Operations?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Our healthcare management system provides the tools you need to
            optimize resources, reduce costs, and improve care delivery.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              View Full Proposal
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => setIsModalOpen(true)}
            >
              Technical Specifications
            </Button>
          </div>
        </div>
      </div>

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

