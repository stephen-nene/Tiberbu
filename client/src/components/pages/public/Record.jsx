import React, { useState } from "react";
import {
  FileText,
  User,
  Stethoscope,
  Calendar,
  FileSearch,
  Download,
  Printer,
  Share2,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { toast } from "sonner";

export default function RecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Dummy medical records data
  const [records, setRecords] = useState([
    {
      id: "REC-1001",
      patient: "Sarah Johnson",
      doctor: "Dr. Amara Ibrahim",
      type: "Medical History",
      date: "2025-03-15",
      status: "Active",
      lastUpdated: "2025-03-15",
      attachments: 3,
    },
    {
      id: "REC-1002",
      patient: "Michael Chen",
      doctor: "Dr. Richard Wong",
      type: "Lab Results",
      date: "2025-03-18",
      status: "Active",
      lastUpdated: "2025-03-18",
      attachments: 5,
    },
    {
      id: "REC-1003",
      patient: "Emily Rodriguez",
      doctor: "Dr. Elena Rodriguez",
      type: "X-Ray Report",
      date: "2025-03-20",
      status: "Archived",
      lastUpdated: "2025-03-21",
      attachments: 2,
    },
    {
      id: "REC-1004",
      patient: "David Washington",
      doctor: "Dr. Samuel Okafor",
      type: "Prescription",
      date: "2025-03-22",
      status: "Active",
      lastUpdated: "2025-03-22",
      attachments: 1,
    },
    {
      id: "REC-1005",
      patient: "Fatima Al-Zahra",
      doctor: "Dr. Priya Sharma",
      type: "Allergy Test",
      date: "2025-03-25",
      status: "Active",
      lastUpdated: "2025-03-25",
      attachments: 4,
    },
    {
      id: "REC-1006",
      patient: "James Wilson",
      doctor: "Dr. James Wilson",
      type: "Therapy Notes",
      date: "2025-03-28",
      status: "Pending Review",
      lastUpdated: "2025-03-28",
      attachments: 3,
    },
  ]);

  const filteredRecords = records.filter((record) => {
    return (
      record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteRecord = (id) => {
    setRecords(records.filter((record) => record.id !== id));
    setDeleteDialogOpen(false);
    toast.error("Record deleted successfully", {
      description: "The medical record has been removed from the system.",
    });

  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge variant="success">{status}</Badge>;
      case "Archived":
        return <Badge variant="destructive">{status}</Badge>;
      case "Pending Review":
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRecordCountByType = (type) => {
    return records.filter((record) => record.type === type).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <Button
          onClick={() => toast.success("Feature coming in the next update")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </div>

      <Alert variant="purple" className="mb-6">
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          {records.filter((r) => r.status === "Pending Review").length} records
          require your review.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Records */}
        <Card className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-6 w-6 text-blue-400 dark:text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{records.length}</div>
          </CardContent>
        </Card>

        {/* Medical Histories */}
        <Card className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Medical Histories
            </CardTitle>
            <FileSearch className="h-6 w-6 text-green-400 dark:text-green-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {getRecordCountByType("Medical History")}
            </div>
          </CardContent>
        </Card>

        {/* Lab Results */}
        <Card className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
            <FileSearch className="h-6 w-6 text-yellow-400 dark:text-yellow-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {getRecordCountByType("Lab Results")}
            </div>
          </CardContent>
        </Card>

        {/* Pending Review */}
        <Card className="bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <AlertCircle className="h-6 w-6 text-red-400 dark:text-red-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {getRecordCountByType("Pending Review")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSearchTerm("")}>
              All Records
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm("Active")}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm("Archived")}>
              Archived
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm("Pending")}>
              Pending Review
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Record ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attachments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {record.patient}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      {record.doctor}
                    </div>
                  </TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {record.date}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {record.attachments} file
                      {record.attachments !== 1 ? "s" : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={deleteDialogOpen && recordToDelete === record.id}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              toast.info("Download initiated", {
                                description: `Preparing ${record.type} for download`,
                              })
                            }
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.info("Print initiated", {
                                description: `Preparing ${record.type} for printing`,
                              })
                            }
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.info("Share initiated", {
                                description: `Preparing ${record.type} for sharing`,
                              })
                            }
                          >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              setRecordToDelete(record.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to permanently delete this
                            medical record? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            Delete Record
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
