import React, { useState, useEffect } from "react";
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
  Plus,
  User,
  Clock,
  MapPin,
  Briefcase
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
import { staffStore } from "@/store/staffStore";
import { useNavigate } from "react-router-dom";

export default function DoctorsPage() {
  const filters = {
    role: "clinician",
    // status: "active",
    // gender: "female",
    // blood_group: "O+",
  };
  
  const navigate = useNavigate();

  const fetchUsers = staffStore((state) => state.fetchUsers);
  const doctors = staffStore((state) => state.doctors);

  useEffect(() => {
    if (doctors.length === 0) {
      fetchUsers(filters);
    }
  }, [fetchUsers, doctors.length]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.profile?.specializations?.some(spec => 
        spec.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "suspended":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getFullName = (doctor) => {
    if (doctor.first_name && doctor.last_name) {
      return `Dr. ${doctor.first_name} ${doctor.last_name}`;
    } else if (doctor.first_name) {
      return `Dr. ${doctor.first_name}`;
    } else if (doctor.username) {
      return doctor.username;
    }
    return "Doctor";
  };

  return (
    <div className="r mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Doctors Directory
        </h1>
        <Button
          onClick={() => navigate("/dashboard/staff/doctors/new")}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
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

      {filteredDoctors.length === 0 && (
        <div className="flex flex-col items-center mx-auto gap-4 text-center py-8">
          <p className="text-gray-500">No doctors found matching your criteria</p>
          <Button
            onClick={() => navigate("/dashboard/staff/doctors/new")}
            variant="outline"
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Doctor
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-start">
                {doctor.profile_image ? (
                  <img
                    src={doctor.profile_image}
                    alt={getFullName(doctor)}
                    className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-blue-100"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <User size={24} className="text-blue-600 dark:text-blue-300" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {getFullName(doctor)}
                  </h3>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {doctor?.profile?.specializations?.length > 0 ? (
                      doctor.profile.specializations.slice(0, 2).map((spec) => (
                        <Badge key={spec.id} variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                          {spec.name}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                        General Practitioner
                      </Badge>
                    )}
                    
                    {doctor?.profile?.specializations?.length > 2 && (
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        +{doctor.profile.specializations.length - 2} more
                      </Badge>
                    )}
                  </div>

                  {doctor?.profile?.rating && (
                    <div className="flex items-center mt-1 text-amber-500">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {doctor.profile.rating}
                      </span>
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        ({Math.floor(Math.random() * 100) + 50} reviews)
                      </span>
                    </div>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
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

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {/* Experience */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Briefcase size={14} className="mr-2" />
                  <span>{doctor?.profile?.experience || "New"} {doctor?.profile?.experience === 1 ? "year" : "years"}</span>
                </div>

                {/* Gender */}
                {doctor?.gender && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <User size={14} className="mr-2" />
                    <span className="capitalize">{doctor.gender}</span>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock size={14} className="mr-2" />
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(doctor?.status)}`}>
                    {doctor?.status || "Unknown"}
                  </span>
                </div>

                {/* Department */}
                {doctor?.profile?.specializations?.length > 0 && doctor.profile.specializations[0].department && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="mr-2" />
                    <span>{doctor.profile.specializations[0].department}</span>
                  </div>
                )}
              </div>

              {/* Availability Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {doctor?.profile?.is_available !== undefined && (
                  <Badge variant={doctor.profile.is_available ? "success" : "destructive"} className="font-normal">
                    {doctor.profile.is_available ? "Available" : "Not Available"}
                  </Badge>
                )}
                
                {doctor?.profile?.accepting_new_patients !== undefined && (
                  <Badge variant={doctor.profile.accepting_new_patients ? "success" : "destructive"} className="font-normal">
                    {doctor.profile.accepting_new_patients ? "Accepting Patients" : "Not Accepting Patients"}
                  </Badge>
                )}
                
                {doctor?.profile?.emergency_availability && (
                  <Badge variant="warning" className="font-normal">
                    Emergency Available
                  </Badge>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Phone size={14} className="mr-1" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Mail size={14} className="mr-1" />
                  Email
                </Button>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                >
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
            disabled={filteredDoctors.length === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600"
            disabled={filteredDoctors.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}