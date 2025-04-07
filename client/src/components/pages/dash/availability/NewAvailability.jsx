import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { staffStore } from "@/store/staffStore";
import { manageStore } from "@/store/manageStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, Clock, Calendar, Save } from "lucide-react";

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

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Switch } from "@/components/shadcn/switch";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Textarea } from "@/components/shadcn/textarea";

const availabilitySchema = z.object({
  doctor: z.string({
    required_error: "Please select a doctor",
  }),
  weekday: z.string({
    required_error: "Please select a day of the week",
  }),
  start_time: z.string({
    required_error: "Please select a start time",
  }),
  end_time: z.string({
    required_error: "Please select an end time",
  }),
  is_available: z.boolean().default(true),
  is_recurring: z.boolean().default(true),
  override_reason: z.string().optional(),
});

export default function NewAvailability() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const filters = {
    role: "clinician",
  };

  const fetchUsers = staffStore((state) => state.fetchUsers);
  const doctors = staffStore((state) => state.doctors);
  const createAvailability = manageStore((state) => state.createAvailability);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClinicianUser, setIsClinicianUser] = useState(false);

  useEffect(() => {
    if (doctors.length === 0) {
      fetchUsers(filters);
    }

    // Check if current user is a clinician
    if (user && user.role === "clinician") {
      setIsClinicianUser(true);
    }
  }, [fetchUsers, doctors.length, user]);

  const weekdays = [
    { value: "0", label: "Monday" },
    { value: "1", label: "Tuesday" },
    { value: "2", label: "Wednesday" },
    { value: "3", label: "Thursday" },
    { value: "4", label: "Friday" },
    { value: "5", label: "Saturday" },
    { value: "6", label: "Sunday" },
  ];

  // Set up form with Zod validation
  const form = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      doctor: isClinicianUser && user?.id ? user.id : "",
      weekday: "",
      start_time: "09:00",
      end_time: "17:00",
      is_available: true,
      is_recurring: true,
      override_reason: "",
    },
  });

  // Update doctor field when user role is determined
  useEffect(() => {
    if (isClinicianUser && user?.id) {
      form.setValue("doctor", user.id);
    }
  }, [isClinicianUser, user, form]);
  // console.log(form.watch("is_available"));

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Convert weekday to number for backend
      const formattedData = {
        ...data,
        weekday: parseInt(data.weekday),
      };

      console.log("Submitting availability:", formattedData);
      await createAvailability(formattedData);
      navigate("/dashboard/availability");
    } catch (error) {
      console.error("Failed to create availability:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/availabilities")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Availabilities
        </Button>
        <h1 className="text-2xl font-bold">Create New Availability</h1>
        <p className="text-gray-500">
          Schedule when a doctor is available for appointments
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Availability Details</CardTitle>
          <CardDescription>
            Set the time slot when the doctor will be available for appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a doctor" />
                            {console.log(doctors)}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {`${doctor.username} - ${
                                doctor.email || doctor.id.substring(0, 8)
                              }`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isClinicianUser && (
                        <FormDescription>
                          You can only create availabilities for yourself
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Weekday Selection */}
                <FormField
                  control={form.control}
                  name="weekday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of Week</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {weekdays.map((day) => (
                            <SelectItem key={day.value} value={day.value}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
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

                {/* End Time */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Is Available */}
                <FormField
                  control={form.control}
                  name="is_available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Available</FormLabel>
                        <FormDescription>
                          Mark this time slot as available for appointments
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

                {/* Is Recurring */}
                <FormField
                  control={form.control}
                  name="is_recurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Recurring</FormLabel>
                        <FormDescription>
                          Repeat this availability weekly
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
              </div>

              {/* Override Reason */}
              {/* if is_available is false don show this */}
              {form.watch("is_available") === false && (
                <FormField
                  control={form.control}
                  name="override_reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Override Reason (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a note if this is an override of a regular schedule"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be visible to admin and other staff members
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/availabilities")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Availability
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
