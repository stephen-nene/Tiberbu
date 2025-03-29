import React, { useState } from "react";
import {
  Stethoscope,
  ClipboardList,
  CalendarCheck,
  UserPlus,
  Shield,
  Activity,
  Clock,
  Settings,
  FileText,
  Users,
  HeartPulse,
  Pill,
  Syringe,
  Bed,
  Microscope,
  Brain,
  Eye,
  Bone,
  Thermometer,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

export default function HealthcareSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const medicalFeatures = [
    {
      icon: ClipboardList,
      color: "text-rose-600 dark:text-rose-400",
      title: "Patient Records",
      description: "Comprehensive digital health records with instant access",
      details: [
        "Medical history tracking",
        "Allergy and medication lists",
        "Lab results integration",
      ],
    },
    {
      icon: CalendarCheck,
      color: "text-blue-600 dark:text-blue-400",
      title: "Appointment Management",
      description: "Streamlined scheduling for patients and providers",
      details: [
        "Automated reminders",
        "Waitlist management",
        "Specialty-specific scheduling",
      ],
    },
    {
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      title: "Staff Coordination",
      description: "Optimized workforce management for clinical teams",
      details: [
        "Role-based scheduling",
        "On-call rotations",
        "Credential tracking",
      ],
    },
    {
      icon: Activity,
      color: "text-amber-600 dark:text-amber-400",
      title: "Clinical Analytics",
      description: "Real-time insights into hospital operations",
      details: [
        "Patient flow metrics",
        "Resource utilization",
        "Performance dashboards",
      ],
    },
  ];

  const medicalBenefits = [
    {
      icon: HeartPulse,
      title: "Enhanced Patient Care",
      description: "Reduce patient wait times by 35% with optimized scheduling",
      color: "text-red-600 dark:text-red-400",
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "Automated documentation for healthcare standards",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Clock,
      title: "Time Efficiency",
      description: "Save 15+ hours weekly on administrative tasks",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Bed,
      title: "Bed Management",
      description: "Real-time inpatient bed tracking and allocation",
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  const medicalModules = [
    {
      icon: Stethoscope,
      title: "Outpatient Clinic",
      description: "Specialty clinic scheduling and management",
      color: "bg-rose-100 dark:bg-rose-900",
    },
    {
      icon: Microscope,
      title: "Laboratory",
      description: "Test ordering and results management",
      color: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: Pill,
      title: "Pharmacy",
      description: "Medication dispensing and inventory",
      color: "bg-purple-100 dark:bg-purple-900",
    },
    {
      icon: Syringe,
      title: "Vaccination",
      description: "Immunization scheduling and tracking",
      color: "bg-amber-100 dark:bg-amber-900",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            tib<span className="text-rose-600 dark:text-rose-400">ER</span>bu Ke
            <br />
            Management System
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
            Transform your healthcare delivery with our integrated clinical and
            administrative platform designed for modern medical facilities.
          </p>
          <div className="flex space-x-4 justify-center lg:justify-start">
            <Button
              size="lg"
              className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
            >
              Request Demo
              <ChevronRight className="ml-2" size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Clinical Features
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-2 bg-rose-400/10 dark:bg-blue-400/10 rounded-full blur-2xl"></div>
            <HeartPulse
              size={320}
              className="relative text-rose-600/20 dark:text-blue-400/20"
            />
          </div>
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="bg-white dark:bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-rose-600 dark:text-rose-400">Clinical</span>{" "}
              Advantages
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Designed by healthcare professionals to address real clinical
              challenges
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicalBenefits.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-100 dark:bg-slate-700 rounded-xl p-6 transition-all hover:shadow-lg"
              >
                <div
                  className={`p-3 rounded-full w-fit mb-4 }/10`}
                >
                  <feature.icon size={32} className={feature.color} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="bg-white dark:bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive{" "}
              <span className="text-rose-600 dark:text-rose-400">Clinical</span>{" "}
              Features
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              All the tools you need for efficient hospital management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicalFeatures.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 group border-slate-200 dark:border-slate-700"
              >
                <CardHeader>
                  <div
                    className={`p-3 rounded-full w-fit mb-4 `}
                  >
                    <feature.icon
                      size={32}
                      className={`${feature.color} group-hover:scale-110 transition-transform`}
                    />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-300">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle size={14} className="mr-2 text-rose-500" />
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

      {/* Specialty Modules */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Specialty{" "}
            <span className="text-rose-600 dark:text-rose-400">Modules</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicalModules.map((module, index) => (
              <div
                key={index}
                className={`${module.color} p-6 rounded-lg shadow-md`}
              >
                <module.icon
                  size={40}
                  className="text-slate-800 dark:text-slate-200 mb-4"
                />
                <h3 className="font-bold mb-2 text-slate-800 dark:text-slate-200">
                  {module.title}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {module.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical Outcomes */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Proven{" "}
            <span className="text-rose-600 dark:text-rose-400">
              Clinical Outcomes
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Measurable improvements for healthcare organizations
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-rose-600 dark:text-rose-400 mb-2">
              40%
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Reduction in Patient Wait Times
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Through optimized scheduling and resource allocation
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              99%
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Regulatory Compliance
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Automated documentation for healthcare standards
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              30%
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Staff Productivity Increase
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Reduced administrative burden on clinical staff
            </p>
          </div>
        </div>
      </div>

      {/* Implementation */}
      <div className="bg-white dark:bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Phased{" "}
              <span className="text-rose-600 dark:text-rose-400">
                Implementation
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Minimizing disruption to clinical operations
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-2">
                Phase 1
              </div>
              <h3 className="text-xl font-semibold mb-3">
                System Configuration
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 mt-1 text-rose-500" />
                  <span>EHR integration setup</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 mt-1 text-rose-500" />
                  <span>Clinical workflow mapping</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 mt-1 text-rose-500" />
                  <span>Staff access provisioning</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                Phase 2
              </div>
              <h3 className="text-xl font-semibold mb-3">Clinical Training</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 mt-1 text-rose-500" />
                  <span>Department-specific sessions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 mt-1 text-rose-500" />
                  <span>Clinical scenario testing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 mt-1 text-rose-500" />
                  <span>Super-user certification</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                Phase 3
              </div>
              <h3 className="text-xl font-semibold mb-3">Go-Live Support</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 mt-1 text-rose-500" />
                  <span>On-site clinical support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 mt-1 text-rose-500" />
                  <span>24/7 technical assistance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 mt-1 text-rose-500" />
                  <span>Performance optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-600 dark:to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Clinical Operations?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Our healthcare management system is designed by clinicians for
            clinicians, with proven results across multiple specialties.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-rose-600 hover:bg-gray-100"
            >
              Schedule Clinical Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => setIsModalOpen(true)}
            >
              Clinical Features PDF
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Request Clinical Demo
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Complete this form to schedule a personalized demonstration of our
            clinical management system.
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Healthcare Facility
              </label>
              <input
                type="text"
                placeholder="Hospital/Clinic Name"
                className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Dr. Smith"
                className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="contact@hospital.org"
                className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Clinical Specialty
              </label>
              <select className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700">
                <option>Select specialty</option>
                <option>Primary Care</option>
                <option>Cardiology</option>
                <option>Oncology</option>
                <option>Pediatrics</option>
                <option>Surgery</option>
                <option>Other</option>
              </select>
            </div>
            <Button className="w-full bg-rose-600 hover:bg-rose-700 mt-4">
              Request Clinical Demo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
