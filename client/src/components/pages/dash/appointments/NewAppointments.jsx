import React, { useEffect, useState } from 'react'

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/alert'

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Switch } from "@/components/shadcn/switch";
import { Textarea } from "@/components/shadcn/textarea";
import { Calendar } from "@/components/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";

import { toast } from 'sonner'
import { CalendarIcon } from "lucide-react";

import { useUserStore } from "@/store/useUserStore";
import { staffStore } from "@/store/staffStore";
import { manageStore } from "@/store/manageStore";

// Define AppointmentStatus enum to match your Django model
const AppointmentStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
  IN_PROGRESS: "IN_PROGRESS",
  choices: [
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "NO_SHOW", label: "No Show" },
    { value: "IN_PROGRESS", label: "In Progress" },
  ]
};

export default function NewAppointments() {
  const user = useUserStore((state) => state.user);

  const fetchUsers = staffStore((state) => state.fetchUsers);
  const doctors = staffStore((state) => state.doctors);
  const patients = staffStore((state) => state.patients);
  const createAppointment = manageStore((state) => state.createAvailability);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClinicianUser, setIsClinicianUser] = useState(false);
  const [isPatientUser, setIsPatientUser] = useState(false);

  useEffect(() => {
    if (doctors.length === 0) {
      fetchUsers({
        role: "clinician",
      });
    }

    if (patients.length === 0) {
      fetchUsers({
        role: "patient"
      });
    }

    // Check if current user is a clinician
    if (user && user.role === "clinician") {
      setIsClinicianUser(true);
    }
    // check if current user is a patient
    if (user && user.role === "patient") {
      setIsPatientUser(true);
    }
  }, [fetchUsers, doctors.length, patients.length, user]);

  function formatDateToISO(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // months are 0-indexed
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // Create schema with Zod
  const formSchema = z.object({
    patient: z.string({
      required_error: "Please select a patient",
    }),
    doctor: z.string().optional(),
    scheduled_date: z.date({
      required_error: "Please select a date",
    }).refine(date => date >= new Date(), {
      message: "Date must be in the future",
    }),
    start_time: z.string({
      required_error: "Please select a start time",
    }),
    end_time: z.string({
      required_error: "Please select an end time",
    }).refine((end_time, data) => {
      if (!data.start_time) return true;
      return end_time > data.start_time;
    }, {
      message: "End time must be after start time",
    }),
    is_admin_override: z.boolean().default(false),
    status: z.string().default(AppointmentStatus.SCHEDULED),
    chief_complaint: z.string().optional(),
    notes: z.string().optional(),
    priority: z.coerce.number().int().min(1).max(5).default(3),
  });

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: isPatientUser && user ? user.id : "",
      doctor: isClinicianUser && user ? user.id : "",
      scheduled_date: new Date(),
      start_time: "",
      end_time: "",
      is_admin_override: false,
      status: AppointmentStatus.SCHEDULED,
      chief_complaint: "",
      notes: "",
      priority: 3,
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Format date and time for API
      const formattedData = {
        ...data,
        scheduled_date: formatDateToISO(data.scheduled_date),
      };

      console.log("Submitting appointment:", formattedData);

      // Call your API
      await createAppointment(formattedData);

      toast.success("Appointment created successfully");
      form.reset();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(doctors, patients)

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule New Appointment</CardTitle>
        <CardDescription>Create a new clinical appointment for a patient</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Selection */}
            <FormField
              control={form.control}
              name="patient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select
                    disabled={isPatientUser}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.username + " - " + patient.email || `Patient ${patient.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Doctor Selection */}
            <FormField
              control={form.control}
              name="doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select
                    disabled={isClinicianUser}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* <SelectItem value="">Unassigned</SelectItem> */}
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.username + " - " + doctor.email || `Doctor ${doctor.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    A doctor can be assigned later if needed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Selection */}
            <FormField
              control={form.control}
              name="scheduled_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            formatDateToISO(field.value)
                            // format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Chief Complaint */}
            <FormField
              control={form.control}
              name="chief_complaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the main reason for the appointment"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional information"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status - only for admin/staff */}
            {!isPatientUser && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AppointmentStatus.choices.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority (1-5)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Highest</SelectItem>
                      <SelectItem value="2">2 - High</SelectItem>
                      <SelectItem value="3">3 - Normal</SelectItem>
                      <SelectItem value="4">4 - Low</SelectItem>
                      <SelectItem value="5">5 - Lowest</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the urgency level of this appointment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Admin Override - only for admin/staff */}
            {!isPatientUser && (
              <FormField
                control={form.control}
                name="is_admin_override"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Administrative Override
                      </FormLabel>
                      <FormDescription>
                        Override scheduling restrictions (such as doctor availability)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => form.reset()}>
          Cancel
        </Button>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Appointment"}
        </Button>
      </CardFooter>
    </Card>
  );
}