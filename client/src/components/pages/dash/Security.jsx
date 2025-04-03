import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Badge } from "@/components/shadcn/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";

export default function Security() {
  return (
    <div className="py-4 r my-auto space- y-4">
      <Tabs defaultValue="general">
        <TabsList className="flex space-x-4">
          <TabsTrigger variant="upcoming" value="general">
            General Settings
          </TabsTrigger>
          <TabsTrigger value="appointments">Appointment Settings</TabsTrigger>
          <TabsTrigger variant="confirmed" value="userManagement">
            User Management
          </TabsTrigger>
          <TabsTrigger value="backup">Backup & Maintenance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic system configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Hospital Name</label>
                    <Input
                      defaultValue="Metropolitan Medical Center"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Administrator Email
                    </label>
                    <Input defaultValue="admin@hospital.com" className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Contact Phone</label>
                    <Input defaultValue="(555) 123-4567" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time Zone</label>
                    <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                      <option>Eastern Time (ET)</option>
                      <option>Central Time (CT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    defaultValue="123 Medical Plaza Dr., Healthville, CA 90210"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      Enable appointment reminders via email
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      Enable SMS notifications
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Settings</CardTitle>
              <CardDescription>Configure appointment behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Default Appointment Duration
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                    <option>15 minutes</option>
                    <option selected>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Schedule Start Time
                  </label>
                  <Input type="time" defaultValue="08:00" className="mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Schedule End Time
                  </label>
                  <Input type="time" defaultValue="17:00" className="mt-1" />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">Allow online booking</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      Require approval for new appointments
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="userManagement">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>User roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Default User Role
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                    <option>Administrator</option>
                    <option selected>Staff</option>
                    <option>Doctor</option>
                    <option>Nurse</option>
                    <option>Receptionist</option>
                    <option>Read-only</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Password Policy</label>
                  <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                    <option>Basic (8+ characters)</option>
                    <option selected>
                      Standard (8+ chars, 1 uppercase, 1 number)
                    </option>
                    <option>
                      Strong (12+ chars, uppercase, number, symbol)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Password Expiry</label>
                  <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                    <option>30 days</option>
                    <option selected>90 days</option>
                    <option>180 days</option>
                    <option>Never</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      Enable two-factor authentication
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      Auto-lock after inactivity (15 min)
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>System Backup & Maintenance</CardTitle>
              <CardDescription>
                Data protection and system updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Backup Frequency
                    </label>
                    <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                      <option>Every 6 hours</option>
                      <option selected>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Retention Period
                    </label>
                    <select className="w-full rounded-md border border-gray-300 p-2 mt-1">
                      <option>7 days</option>
                      <option selected>30 days</option>
                      <option>90 days</option>
                      <option>365 days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Backup Storage Location
                  </label>
                  <Input
                    defaultValue="secure-cloud-backup.hospital.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Last Successful Backup
                  </label>
                  <p className="text-sm mt-1">April 3, 2025 03:15 AM</p>
                </div>

                <div>
                  <label className="text-sm font-medium">System Version</label>
                  <p className="text-sm mt-1">MediAdmin v4.2.1</p>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      Automatic system updates
                    </span>
                  </label>
                </div>

                <div className="flex space-x-2">
                  <Button>Run Backup Now</Button>
                  <Button variant="outline">Restore from Backup</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications & Alerts</CardTitle>
              <CardDescription>System notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block">
                    Email Notifications
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      New patient registrations
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      Appointment cancellations
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">Staff schedule changes</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      System alerts and warnings
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block">
                    System Alerts
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">Low inventory warnings</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">Failed login attempts</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      Database connection issues
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm">
                      System performance alerts
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
