import React, { useState } from 'react';
import { 
  CalendarRange, 
  Users, 
  UserCog, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  PlusCircle,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Layers,
  Activity
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Badge } from '@/components/shadcn/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';

export default function AdminDashboard() {

      const analyticsData = {
        totalAppointments: 42,
        completedAppointments: 31,
        canceledAppointments: 5,
        pendingAppointments: 6,
        totalPatients: 328,
        newPatientsThisMonth: 24,
        totalStaff: 45,
        activeStaff: 42,
        departments: 12,
        averageWaitTime: "18 mins",
        bedOccupancy: "78%",
        emergencyVisits: 15,
      };


  return (
      <>
                      <div>
                        <div className="mb-6">
                          <h2 className="text-lg font-medium">Hospital Analytics</h2>
                          <p className="text-sm text-gray-500">
                            Performance metrics and operational data
                          </p>
                        </div>
          
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Appointments
                                  </p>
                                  <p className="text-2xl font-bold mt-1">
                                    {analyticsData.totalAppointments}
                                  </p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                  <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                              </div>
                              <div className="mt-4 flex items-center text-sm">
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">12%</span>
                                <span className="text-gray-500 ml-1">
                                  from last month
                                </span>
                              </div>
                            </CardContent>
                          </Card>
          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Patients
                                  </p>
                                  <p className="text-2xl font-bold mt-1">
                                    {analyticsData.totalPatients}
                                  </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                  <User className="h-6 w-6 text-green-600" />
                                </div>
                              </div>
                              <div className="mt-4 flex items-center text-sm">
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">8%</span>
                                <span className="text-gray-500 ml-1">
                                  from last month
                                </span>
                              </div>
                            </CardContent>
                          </Card>
          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Wait Time
                                  </p>
                                  <p className="text-2xl font-bold mt-1">
                                    {analyticsData.averageWaitTime}
                                  </p>
                                </div>
                                <div className="bg-yellow-100 p-3 rounded-full">
                                  <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                              </div>
                              <div className="mt-4 flex items-center text-sm">
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">5%</span>
                                <span className="text-gray-500 ml-1">improvement</span>
                              </div>
                            </CardContent>
                          </Card>
          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Emergency
                                  </p>
                                  <p className="text-2xl font-bold mt-1">
                                    {analyticsData.emergencyVisits}
                                  </p>
                                </div>
                                <div className="bg-red-100 p-3 rounded-full">
                                  <Activity className="h-6 w-6 text-red-600" />
                                </div>
                              </div>
                              <div className="mt-4 flex items-center text-sm">
                                <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-500 font-medium">3%</span>
                                <span className="text-gray-500 ml-1">increase today</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
          
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Appointment Status</CardTitle>
                              <CardDescription>
                                Current appointment distribution
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-80 flex items-center justify-center">
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-sm">
                                      Completed ({analyticsData.completedAppointments})
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                    <span className="text-sm">
                                      Pending ({analyticsData.pendingAppointments})
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                    <span className="text-sm">
                                      Canceled ({analyticsData.canceledAppointments})
                                    </span>
                                  </div>
                                  <div className="mt-4 text-sm text-gray-500">
                                    Chart visualization would appear here
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
          
                          <Card>
                            <CardHeader>
                              <CardTitle>Department Performance</CardTitle>
                              <CardDescription>
                                Patient throughput by department
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">
                                      Cardiology
                                    </span>
                                    <span className="text-sm font-medium">85%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: "85%" }}
                                    ></div>
                                  </div>
                                </div>
          
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Neurology</span>
                                    <span className="text-sm font-medium">72%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: "72%" }}
                                    ></div>
                                  </div>
                                </div>
          
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">
                                      Pediatrics
                                    </span>
                                    <span className="text-sm font-medium">68%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: "68%" }}
                                    ></div>
                                  </div>
                                </div>
          
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">
                                      Orthopedics
                                    </span>
                                    <span className="text-sm font-medium">91%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: "91%" }}
                                    ></div>
                                  </div>
                                </div>
          
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">
                                      Dermatology
                                    </span>
                                    <span className="text-sm font-medium">65%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: "65%" }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
      </>
  );
}