import React, { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Badge } from "@/components/shadcn/badge";

export default function Patients() {
  // Dummy patient data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      age: 42,
      gender: "Female",
      contact: "202-555-0189",
      lastVisit: "2025-03-22",
      status: "Active",
      condition: "Hypertension",
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 29,
      gender: "Male",
      contact: "202-555-0134",
      lastVisit: "2025-03-15",
      status: "Active",
      condition: "Diabetes Type 2",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      age: 35,
      gender: "Female",
      contact: "202-555-0178",
      lastVisit: "2025-03-18",
      status: "Inactive",
      condition: "Asthma",
    },
    {
      id: 4,
      name: "David Washington",
      age: 58,
      gender: "Male",
      contact: "202-555-0145",
      lastVisit: "2025-03-10",
      status: "Active",
      condition: "Arthritis",
    },
    {
      id: 5,
      name: "Fatima Al-Zahra",
      age: 32,
      gender: "Female",
      contact: "202-555-0123",
      lastVisit: "2025-03-25",
      status: "Active",
      condition: "Pregnancy",
    },
    {
      id: 6,
      name: "James Wilson",
      age: 67,
      gender: "Male",
      contact: "202-555-0198",
      lastVisit: "2025-03-12",
      status: "Active",
      condition: "Heart Disease",
    },
    {
      id: 7,
      name: "Sophia Park",
      age: 8,
      gender: "Female",
      contact: "202-555-0176",
      lastVisit: "2025-03-20",
      status: "Active",
      condition: "Tonsillitis",
    },
    {
      id: 8,
      name: "Robert Nguyen",
      age: 45,
      gender: "Male",
      contact: "202-555-0187",
      lastVisit: "2025-03-05",
      status: "Inactive",
      condition: "Depression",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === "Active" ? "bg-green-500" : "bg-gray-500";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Patient Management
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
          <UserPlus size={16} className="mr-2" />
          Add New Patient
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
                placeholder="Search patients by name or condition..."
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

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Patient
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Gender/Age
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Last Visit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Condition
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {patient.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: TB-{patient.id.toString().padStart(5, "0")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {patient.gender}, {patient.age} yrs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {patient.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className="border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400"
                    >
                      {patient.condition}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        patient.status
                      )} text-white`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
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
                          <FileText size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          <Edit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing{" "}
              <span className="font-medium">{filteredPatients.length}</span> of{" "}
              <span className="font-medium">{patients.length}</span> patients
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
      </div>
    </div>
  );
}
