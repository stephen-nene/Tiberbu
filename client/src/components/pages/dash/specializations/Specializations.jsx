import React, { useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { staffStore } from "@/store/staffStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  MoreVertical,
  Plus,
  Edit,
  Trash,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/shadcn/badge";

export default function Specializations() {
  const navigate = useNavigate();
  const fetchSpecializations = staffStore(
    (state) => state.fetchSpecializations
  );
  const specializations = staffStore((state) => state.specializations);
  const loading = staffStore((state) => state.loading);

  useEffect(() => {
    fetchSpecializations();
  }, [fetchSpecializations]);

  const handleAddNew = () => {
    navigate("new");
    // You can also use: navigate('/admin/specializations/new');
  };

  const handleEdit = (id) => {
    navigate(`/admin/specializations/edit/${id}`);
    toast.info("Edit specialization form will be added later");
  };

  const handleView = (id) => {
    navigate(`/admin/specializations/${id}`);
    toast.info("View specialization details will be added later");
  };

  const handleDelete = (id, name) => {
    toast.error(`Delete functionality for "${name}" will be added later`);
  };

  const handleToggleStatus = (id, currentStatus, name) => {
    toast.success(`${currentStatus ? "Deactivated" : "Activated"} "${name}"`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">
              Medical Specializations
            </CardTitle>
            <CardDescription>
              Manage all medical specializations in the hospital
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Specialization
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : specializations && specializations.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Consultation Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specializations.map((spec) => (
                    <TableRow key={spec.id}>
                      <TableCell>
                        <div className="font-medium">{spec.name}</div>
                        <div className="text-xs text-gray-500">
                          {spec.description.substring(0, 40)}...
                        </div>
                      </TableCell>
                      <TableCell>{spec.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {spec.is_surgical && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              Surgical
                            </Badge>
                          )}
                          {spec.is_primary_care && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Primary Care
                            </Badge>
                          )}
                          {!spec.is_surgical && !spec.is_primary_care && (
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200"
                            >
                              Consultation
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(spec.average_consultation_fee)}
                      </TableCell>
                      <TableCell>
                        {spec.is_active ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical
                                size={16}
                                className="text-gray-500 dark:text-gray-400"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(spec.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(spec.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleStatus(
                                  spec.id,
                                  spec.is_active,
                                  spec.name
                                )
                              }
                            >
                              {spec.is_active ? (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-700"
                              onClick={() => handleDelete(spec.id, spec.name)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No specializations found</p>
              <Button onClick={handleAddNew} variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Specialization
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
