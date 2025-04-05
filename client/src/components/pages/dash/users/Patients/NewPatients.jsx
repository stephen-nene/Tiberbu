import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { Card, CardContent } from "@/components/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";

// Define Zod schemas for form validation
const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

const basicInfoSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone_number: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  date_of_birth: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  gender: z.string().optional(),
  blood_group: z.string().optional(),
  address: addressSchema,
});

const patientInfoSchema = z.object({
  medical_history: z.string().optional(),
  known_allergies: z.array(z.string()).optional().default([]),
  permanent_medications: z.array(z.string()).optional().default([]),
  emergency_contacts: z.array(z.string()).optional().default([]),
  primary_insurance: z.string().optional(),
});

const attachmentSchema = z.object({
  id: z.number(),
  file: z.any(),
  document_type: z.string().min(1, "Document type is required"),
  caption: z.string().optional(),
  description: z.string().optional(),
  is_sensitive: z.boolean().default(false),
});

const formSchema = z.object({
  basicInfo: basicInfoSchema,
  patientInfo: patientInfoSchema,
  attachments: z.array(attachmentSchema).optional().default([]),
});

export default function PatientForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState("create"); // 'create', 'edit', or 'view'
  const [activeTab, setActiveTab] = useState("basic");
  const [newAttachment, setNewAttachment] = useState({
    file: null,
    document_type: "",
    caption: "",
    description: "",
    is_sensitive: false,
  });

  // Initialize form with React Hook Form and Zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicInfo: {
        username: "",
        email: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        full_name: "",
        date_of_birth: "",
        gender: "",
        blood_group: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        },
      },
      patientInfo: {
        medical_history: "",
        known_allergies: [],
        permanent_medications: [],
        emergency_contacts: [],
        primary_insurance: "",
      },
      attachments: [],
    },
  });
  
  // Initialize form data from location state if it exists
  useEffect(() => {
    if (location.state) {
      console.log(location.state)
      const { patientData, formMode } = location.state;

      if (formMode && ["create", "edit", "view"].includes(formMode)) {
        setMode(formMode);
      }

      if (patientData) {
        // Reset form with patient data
        form.reset({
          basicInfo: {
            username: patientData.username || "",
            email: patientData.email || "",
            phone_number: patientData.phone_number || "",
            first_name: patientData.first_name || "",
            last_name: patientData.last_name || "",
            full_name: patientData.get_full_name || "",
            date_of_birth: patientData.date_of_birth || "",
            gender: patientData.gender || "",
            blood_group: patientData.blood_group || "",
            address: patientData.address || {
              street: "",
              city: "",
              state: "",
              zip: "",
              country: "",
            },
          },
          patientInfo: {
            medical_history: patientData.medical_history || "",
            known_allergies: patientData.known_allergies || [],
            permanent_medications: patientData.permanent_medications || [],
            emergency_contacts: patientData.emergency_contacts || [],
            primary_insurance: patientData.primary_insurance || "",
          },
          attachments: patientData.attachments || [],
        });
      }
    }
  }, [location.state, form]);

  const handleAttachmentChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setNewAttachment({
      ...newAttachment,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  const addAttachment = () => {
    if (newAttachment.file && newAttachment.document_type) {
      const currentAttachments = form.getValues("attachments") || [];
      form.setValue("attachments", [
        ...currentAttachments,
        { ...newAttachment, id: Date.now() },
      ]);

      setNewAttachment({
        file: null,
        document_type: "",
        caption: "",
        description: "",
        is_sensitive: false,
      });
    }
  };

  const removeAttachment = (id) => {
    const currentAttachments = form.getValues("attachments") || [];
    form.setValue(
      "attachments",
      currentAttachments.filter((attachment) => attachment.id !== id)
    );
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Here you would handle the API call to save the patient data
    // For example: savePatient(data, mode)

    // Navigate back to the patients list or detail view
    // navigate('/patients');
  };

  // Handle form fields for array data (allergies, medications, contacts)
  const handleArrayFieldChange = (field, value) => {
    form.setValue(
      field,
      value.split("\n").filter((item) => item.trim() !== "")
    );
  };

  // Options for dropdowns
  const genderOptions = ["MALE", "FEMALE", "OTHER", "UNDISCLOSED"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const documentTypeOptions = [
    "MEDICAL_RECORD",
    "LAB_RESULT",
    "IMAGING",
    "PRESCRIPTION",
    "CONSENT_FORM",
    "OTHER",
  ];

  // Check if form should be disabled (view mode)
  const isDisabled = mode === "view";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {mode === "create"
          ? "New Patient Registration"
          : mode === "edit"
          ? "Edit Patient Information"
          : "Patient Details"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="patient">Patient Information</TabsTrigger>
              <TabsTrigger value="attachments">Medical Attachments</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="basicInfo.username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isDisabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basicInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basicInfo.phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="+1234567890"
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basicInfo.first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isDisabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basicInfo.last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isDisabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                      

                    {/* <FormField
                      control={form.control}
                      name="basicInfo.full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isDisabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <FormField
                      control={form.control}
                      name="basicInfo.date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basicInfo.gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isDisabled}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genderOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basicInfo.blood_group"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isDisabled}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bloodGroupOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="basicInfo.address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDisabled} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="basicInfo.address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDisabled} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="basicInfo.address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDisabled} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="basicInfo.address.zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP/Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDisabled} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="basicInfo.address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDisabled} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Patient Information Tab */}
            <TabsContent value="patient">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="patientInfo.medical_history"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical History</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="patientInfo.known_allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Known Allergies</FormLabel>
                          <FormControl>
                            <Textarea
                              value={field.value.join("\n")}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "patientInfo.known_allergies",
                                  e.target.value
                                )
                              }
                              placeholder="List allergies, one per line"
                              rows={3}
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter each allergy on a new line
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="patientInfo.permanent_medications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Permanent Medications</FormLabel>
                          <FormControl>
                            <Textarea
                              value={field.value.join("\n")}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "patientInfo.permanent_medications",
                                  e.target.value
                                )
                              }
                              placeholder="List medications, one per line"
                              rows={3}
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter each medication on a new line
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="patientInfo.emergency_contacts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contacts</FormLabel>
                          <FormControl>
                            <Textarea
                              value={field.value.join("\n")}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "patientInfo.emergency_contacts",
                                  e.target.value
                                )
                              }
                              placeholder="Name, Relationship, Phone Number (one contact per line)"
                              rows={3}
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormDescription>
                            Format: Name, Relationship, Phone Number (one
                            contact per line)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="patientInfo.primary_insurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Insurance</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Insurance provider, policy number, etc."
                              rows={3}
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Attachments Tab */}
            <TabsContent value="attachments">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {!isDisabled && (
                      <div className="border p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-4">
                          Add New Attachment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="file">File</Label>
                            <Input
                              id="file"
                              name="file"
                              type="file"
                              onChange={handleAttachmentChange}
                              accept=".pdf,.jpg,.dcm"
                            />
                            <p className="text-sm text-gray-500">
                              Allowed formats: PDF, JPG, DCM
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="document_type">Document Type</Label>
                            <Select
                              onValueChange={(value) =>
                                setNewAttachment({
                                  ...newAttachment,
                                  document_type: value,
                                })
                              }
                              value={newAttachment.document_type}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                              <SelectContent>
                                {documentTypeOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option.replace("_", " ")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Input
                              id="caption"
                              name="caption"
                              value={newAttachment.caption}
                              onChange={handleAttachmentChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                              id="description"
                              name="description"
                              value={newAttachment.description}
                              onChange={handleAttachmentChange}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="is_sensitive"
                              name="is_sensitive"
                              checked={newAttachment.is_sensitive}
                              onCheckedChange={(checked) =>
                                setNewAttachment({
                                  ...newAttachment,
                                  is_sensitive: checked,
                                })
                              }
                            />
                            <Label htmlFor="is_sensitive">
                              Sensitive Document
                            </Label>
                          </div>

                          <div className="flex items-end">
                            <Button type="button" onClick={addAttachment}>
                              Add Attachment
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Uploaded Attachments
                      </h3>
                      {!form.getValues("attachments") ||
                      form.getValues("attachments").length === 0 ? (
                        <p className="text-gray-500">
                          No attachments uploaded yet.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {form.getValues("attachments").map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center justify-between border p-3 rounded-md"
                            >
                              <div>
                                <p className="font-medium">
                                  {attachment.caption || "Unnamed Document"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {attachment.document_type.replace("_", " ")}
                                </p>
                                <p className="text-sm">
                                  {attachment.file?.name}
                                </p>
                              </div>
                              {!isDisabled && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    removeAttachment(attachment.id)
                                  }
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              {isDisabled ? "Back" : "Cancel"}
            </Button>
            {!isDisabled && (
              <Button type="submit">
                {mode === "create" ? "Create Patient" : "Update Patient"}
              </Button>
            )}
            {isDisabled && (
              <Button
                type="button"
                onClick={() => setMode("edit")
                  // navigate(location.pathname, {
                  //   state: { patientData: form.getValues(), formMode: "edit" },
                  // })
                }
              >
                Edit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
