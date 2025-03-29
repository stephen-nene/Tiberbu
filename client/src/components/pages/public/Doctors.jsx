import React, { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Calendar,
  Mail,
  Phone,
  Star,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Card, CardContent } from "@/components/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Badge } from "@/components/shadcn/badge";

export default function DoctorsPage() {
  // Dummy doctor data
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Amara Ibrahim",
      specialty: "Cardiology",
      experience: "15 years",
      availability: "Mon, Wed, Fri",
      contact: "202-555-0134",
      email: "a.ibrahim@tiberbu.com",
      status: "Available",
      rating: 4.8,
      image: "/placeholder/150/150",
    },
    {
      id: 2,
      name: "Dr. Richard Wong",
      specialty: "Neurology",
      experience: "12 years",
      availability: "Tue, Thu, Sat",
      contact: "202-555-0145",
      email: "r.wong@tiberbu.com",
      status: "Available",
      rating: 4.7,
      image: "/placeholder/150/150",
    },
    {
      id: 3,
      name: "Dr. Elena Rodriguez",
      specialty: "Pediatrics",
      experience: "10 years",
      availability: "Mon, Tue, Thu, Fri",
      contact: "202-555-0156",
      email: "e.rodriguez@tiberbu.com",
      status: "On Leave",
      rating: 4.9,
      image: "/placeholder/150/150",
    },
    {
      id: 4,
      name: "Dr. Samuel Okafor",
      specialty: "Orthopedics",
      experience: "18 years",
      availability: "Mon, Wed, Fri",
      contact: "202-555-0167",
      email: "s.okafor@tiberbu.com",
      status: "Available",
      rating: 4.6,
      image: "/placeholder/150/150",
    },
    {
      id: 5,
      name: "Dr. Priya Sharma",
      specialty: "Dermatology",
      experience: "8 years",
      availability: "Tue, Wed, Thu",
      contact: "202-555-0178",
      email: "p.sharma@tiberbu.com",
      status: "Available",
      rating: 4.8,
      image: "/placeholder/150/150",
    },
    {
      id: 6,
      name: "Dr. James Wilson",
      specialty: "Psychiatry",
      experience: "14 years",
      availability: "Mon, Tue, Thu",
      contact: "202-555-0189",
      email: "j.wilson@tiberbu.com",
      status: "Available",
      rating: 4.5,
      image: "/placeholder/150/150",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === "Available" ? "bg-green-500" : "bg-amber-500";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Doctors Directory
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
          <UserPlus size={16} className="mr-2" />
          Add New Doctor
        </Button>
      </div>

      <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={16}
              />
              <Input
                placeholder="Search doctors by name or specialty..."
                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center border-gray-300 dark:border-gray-600"
            >
              <Filter
                size={16}
                className="mr-2 text-gray-600 dark:text-gray-400"
              />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-start">
                <img
                  src={
                    
                    "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt={doctor.name}
                  className="h-16 w-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {doctor.name}
                  </h3>
                  <Badge className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {doctor.specialty}
                  </Badge>
                  <div className="flex items-center mt-1 text-amber-500">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 text-sm">{doctor.rating}</span>
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                      ({Math.floor(Math.random() * 100) + 50} reviews)
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                      <MoreVertical
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <Calendar size={14} className="mr-2" />
                      Schedule Appointment
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <Edit size={14} className="mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <Trash2 size={14} className="mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Badge variant="outline" className="mr-2">
                    Experience
                  </Badge>
                  {doctor.experience}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Badge variant="outline" className="mr-2">
                    Availability
                  </Badge>
                  {doctor.availability}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      doctor.status
                    )} text-white ml-auto`}
                  >
                    {doctor.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <Button
                  // variant="outline"
                  size="sm"
                  className=""
                >
                  <Phone size={14} className="mr-1" />
                  Call
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="flex items-center border-gray-300 dark:border-gray-600"
                >
                  <Mail size={14} className="mr-1" />
                  Email
                </Button>
                <Button className="flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white">
                  <Calendar size={14} className="mr-1" />
                  Book
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{filteredDoctors.length}</span>{" "}
          of <span className="font-medium">{doctors.length}</span> doctors
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
