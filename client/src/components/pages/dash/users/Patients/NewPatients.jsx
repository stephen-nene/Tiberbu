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

import { toast } from "sonner";

import { staffStore } from "@/store/staffStore";

import { PlusCircle, X } from "lucide-react";

// Define Zod schemas for form validation
const addressSchema = z.object({
  street: z.string().min(2, "Street is required"),
  city: z
    .string()
    .min(3, "City must be at least 3 characters")
    .optional()
    .nullable(),
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
  // full_name: z.string().min(2, "Name must be at least 2 characters"),
  date_of_birth: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  gender: z.string().optional(),
  blood_group: z.string().optional(),
  address: addressSchema,
});

const patientInfoSchema = z.object({
  medical_history: z.string().optional(),
  known_allergies: z
    .array(
      z.object({
        substance: z.string(),
        reaction: z.string(),
        severity: z.enum(["mild", "moderate", "severe"]).optional(),
      })
    )
    .optional()
    .default([]),

  permanent_medications: z
    .array(
      z.object({
        name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
      })
    )
    .optional()
    .default([]),

  emergency_contacts: z
    .array(
      z.object({
        name: z.string(),
        relationship: z.string(),
        phone: z.string(),
      })
    )
    .optional()
    .default([]),

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

  const savePatient = staffStore((state) => state.savePatient);
  const patchPatient = staffStore((state) => state.patchPatient);

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
        // full_name: "",
        date_of_birth: "",
        gender: "undisclosed",
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
      console.log(location.state);
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
            // full_name: patientData.get_full_name || "",
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
            medical_history: patientData?.profile?.medical_history || "",
            known_allergies: patientData?.profile?.known_allergies || [],
            permanent_medications:
              patientData?.profile?.permanent_medications || [],
            emergency_contacts: patientData?.profile?.emergency_contacts || [],
            primary_insurance: patientData?.profile?.primary_insurance || "",
          },
          attachments: patientData.attachments || [],
        });
      }
    }
  }, [location.state, form]);

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "patientInfo.permanent_medications",
  // });

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

  const processErrors = (errors, toastId) => {
    // Iterate over the error object and extract the first error message for each field
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        const fieldErrors = errors[field];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          // // Dismiss the loading toast as we're showing the error now
          // toast.dismiss(toastId);

          // Use the field name as the toast title and the first error message as the description
          toast.error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} Error`,
            {
              id: toastId,
              description: fieldErrors[0], // Show the first error for the field
            }
          );
          break; // Only show the first error for any field
        }
      }
    }
  };

  // Submit handler
  const onSubmit = async (data) => {

        const data2 = {
          ...data.basicInfo,
          id: location.state?.patientData?.id || '',
          password: "dummypassword", // You can remove this for actual submissions

          attachments: data.attachments,
          patient_profile: data.patientInfo,
        };
        console.log("✅ Form submitted:", data2);

    if (data2.id || mode === "edit") {
      // Update existing patient
      await updatePatient(data2);
    } else {
      // Create new patient
      await createPatient(data2);
    }
  };

  const updatePatient = async (data) => {
    // if user.id then this will be used instaed since the user is already created
    const toastId = toast.loading("updating patient...");
     try {
       // Simulate API call (replace with your actual API request)
       const response = await patchPatient(data);

       // // Dismiss the loading toast since the operation is complete
       // toast.dismiss(toastId);

       console.log("Response:", response);
       navigate("/dashboard/patients");

       // Show a success toast (you can customize the message as needed)
       toast.success("Patient saved successfully!", {
         id: toastId,
       });

     } catch (error) {
       if (error?.response?.data) {
         // Process the errors and display them as toast notifications
         processErrors(error?.response?.data, toastId);
       }
       console.error("Error saving patient:", error?.response);
     } finally {
      //  toast.dismiss(toastId);
     }
  };

  const createPatient = async (data) => {

    // Show a loading toast with an ID
    const toastId = toast.loading("Saving patient...");

    try {
      // Simulate API call (replace with your actual API request)
      const response = await savePatient(data);

      // // Dismiss the loading toast since the operation is complete
      // toast.dismiss(toastId);

      console.log("Response:", response);
      navigate("/dashboard/patients");

      // Show a success toast (you can customize the message as needed)
      toast.success("Patient saved successfully!", {
        id: toastId,
      });
    } catch (error) {
      if (error?.response?.data) {
        // Process the errors and display them as toast notifications
        processErrors(error?.response?.data, toastId);
      }
      console.error("Error saving patient:", error?.response);
    } finally {
      // Dismiss the loading toast in case of an error
      // toast.dismiss(toastId);
    }
  };

  const savePatient2 = async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          response: {
            data: {
              username: ["A user with that username already exists."],
              password: ["This field is required."],
            },
          },
        });
      }, 2000); // Simulate a 2-second delay
    });
  };

  const onError = (errors) => {
    console.error("❌ Validation errors:", errors);

    const firstMessage = getFirstErrorMessage(errors);

    if (firstMessage) {
      toast.error(firstMessage);
    }
  };

  // Helper to find the first error message (deep or flat)
  const getFirstErrorMessage = (errorObject) => {
    for (const key in errorObject) {
      const value = errorObject[key];

      if (value?.message) {
        return value.message;
      }

      if (typeof value === "object") {
        const nested = getFirstErrorMessage(value);
        if (nested) return nested;
      }
    }

    return null;
  };
  // Error handler
  const onError2 = (errors) => {
    console.error("❌ Validation errors:", errors);

    const flatErrors = flattenErrors(errors);

    // Show all validation errors (or just the first one if you prefer)
    flatErrors.forEach((msg) => {
      toast.error(msg);
    });
  };

  // Helper to flatten nested errors (like basicInfo.full_name)
  const flattenErrors = (errors) => {
    const messages = [];

    const extract = (errObj) => {
      Object.values(errObj).forEach((val) => {
        if (val?.message) {
          messages.push(val.message);
        } else if (typeof val === "object") {
          extract(val);
        }
      });
    };

    extract(errors);

    return messages;
  };

  // Handle form fields for array data (allergies, medications, contacts)
  const handleArrayFieldChange = (field, value) => {
    form.setValue(
      field,
      value.split("\n").filter((item) => item.trim() !== "")
    );
  };

  // Options for dropdowns
  // class Gender(models.TextChoices):
  //   MALE = 'male', 'Male'
  //   FEMALE = 'female', 'Female'
  //   NON_BINARY = 'non_binary', 'Non-binary'
  //   UNDISCLOSED = 'undisclosed', 'Prefer not to say'

  const genderOptions = ["male", "female", "non_binary", "undisclosed"];
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
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              {/* if atimetdata is null don't show */}
              <TabsTrigger value="patient">Patient Information</TabsTrigger>
              <TabsTrigger value="attachments">Medical Attachments</TabsTrigger>
              {/* {location?.state?.patientData?.id && (
                <>
                </>
              )} */}
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
                        <KnownAllergiesField
                          field={field}
                          form={form}
                          isDisabled={isDisabled}
                        />
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="patientInfo.permanent_medications"
                      render={({ field }) => (
                        <PermanentMedicationsField
                          field={field}
                          form={form}
                          isDisabled={isDisabled}
                        />
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="patientInfo.emergency_contacts"
                      render={({ field }) => (
                        <EmergencyContactsField
                          field={field}
                          form={form}
                          isDisabled={isDisabled}
                        />
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
                {location?.state?.patientData?.id ? (
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
                              <Label htmlFor="document_type">
                                Document Type
                              </Label>
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
                ) : (
                  <div className="flex p-6">
                    {/* message saying cannot add attachments while creating patient */}
                    <p className="text-gray-500">
                      Cannot add attachments while creating patient
                    </p>
                  </div>
                )}
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
                onClick={
                  () => setMode("edit")
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

// Known Allergies Field
const KnownAllergiesField = ({ field, form, isDisabled }) => {
  const [newAllergy, setNewAllergy] = useState({
    substance: "",
    reaction: "",
    severity: "mild",
  });

  const addAllergy = () => {
    if (newAllergy.substance && newAllergy.reaction) {
      const updatedAllergies = [...field.value, newAllergy];
      form.setValue("patientInfo.known_allergies", updatedAllergies);
      setNewAllergy({ substance: "", reaction: "", severity: "mild" });
    } else {
      toast.error("Please fill in all fields before adding an allergy.");
    }
  };

  const removeAllergy = (index) => {
    // toast.promise before removing thats ask a user to confimr
    toast.error("Are you sure you want to delete this allergy?", {
      action: {
        label: "Confirm",
        onClick: () => {
          const updatedAllergies = field.value.filter((_, i) => i !== index);
          form.setValue("patientInfo.known_allergies", updatedAllergies);
          toast.success("Allergy deleted successfully");
          // logOut(); // Your logout function
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
      duration: Infinity, // Stays until user acts
    });
  };

  return (
    <FormItem>
      <FormLabel>Known Allergies</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {field.value && field.value.length > 0 ? (
            <div className="space-y-4">
              {field.value.map((allergy, index) => (
                <Card
                  key={index}
                  className="relative p-4 border border-gray-200 shadow-sm"
                >
                  {/* Delete Button in top right corner */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-3 top-3 h-6 w-6 te0"
                    onClick={() => removeAllergy(index)}
                    disabled={isDisabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Allergy Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Substance</p>
                      <p className="text-sm font-medium">{allergy.substance}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reaction</p>
                      <p className="text-sm font-medium">{allergy.reaction}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Severity</p>
                      <p className="text-sm font-medium capitalize">
                        {allergy.severity || "mild"}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No allergies added
            </p>
          )}

          {!isDisabled && (
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Substance"
                  value={newAllergy.substance}
                  onChange={(e) =>
                    setNewAllergy({ ...newAllergy, substance: e.target.value })
                  }
                />
                <Input
                  placeholder="Reaction"
                  value={newAllergy.reaction}
                  onChange={(e) =>
                    setNewAllergy({ ...newAllergy, reaction: e.target.value })
                  }
                />
                <Select
                  value={newAllergy.severity}
                  onValueChange={(value) =>
                    setNewAllergy({ ...newAllergy, severity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={addAllergy}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Allergy
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>Add details for each allergy</FormDescription>
      <FormMessage />
    </FormItem>
  );
};

// Permanent Medications Field
const PermanentMedicationsField = ({ field, form, isDisabled }) => {
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
  });

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      const updatedMedications = [...field.value, newMedication];
      form.setValue("patientInfo.permanent_medications", updatedMedications);
      setNewMedication({ name: "", dosage: "", frequency: "" });
    }
  };

  const removeMedication = (index) => {
    toast.error("Are you sure you want to remove this medication?", {
      action: {
        label: "Confirm",
        onClick: () => {
          const updatedMedications = field.value.filter((_, i) => i !== index);
          form.setValue(
            "patientInfo.permanent_medications",
            updatedMedications
          );
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
      duration: Infinity,
    });
    // const updatedMedications = field.value.filter((_, i) => i !== index);
    // form.setValue("patientInfo.permanent_medications", updatedMedications);
  };

  return (
    <FormItem>
      <FormLabel>Permanent Medications</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {field.value && field.value.length > 0 ? (
            <div className="space-y-2">
              {field.value.map((medication, index) => (
                <Card key={index} className="p-3 relative pr-10">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => removeMedication(index)}
                    disabled={isDisabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm">{medication.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dosage</p>
                      <p className="text-sm">{medication.dosage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Frequency</p>
                      <p className="text-sm">{medication.frequency}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No medications added</p>
          )}

          {!isDisabled && (
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Medication Name"
                  value={newMedication.name}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Dosage"
                  value={newMedication.dosage}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      dosage: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Frequency"
                  value={newMedication.frequency}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      frequency: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                type="button"
                variant="info"
                size="sm"
                className="mt-3 w-full"
                onClick={addMedication}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>Add details for each medication</FormDescription>
      <FormMessage />
    </FormItem>
  );
};

// Emergency Contacts Field
const EmergencyContactsField = ({ field, form, isDisabled }) => {
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  });

  const addContact = () => {
    if (newContact.name && newContact.relationship && newContact.phone) {
      const updatedContacts = [...field.value, newContact];
      form.setValue("patientInfo.emergency_contacts", updatedContacts);
      setNewContact({ name: "", relationship: "", phone: "" });
    }
  };

  const removeContact = (index) => {
    const updatedContacts = field.value.filter((_, i) => i !== index);
    form.setValue("patientInfo.emergency_contacts", updatedContacts);
  };

  return (
    <FormItem>
      <FormLabel>Emergency Contacts</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {field.value && field.value.length > 0 ? (
            <div className="space-y-2">
              {field.value.map((contact, index) => (
                <Card key={index} className="p-3 relative pr-10">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => removeContact(index)}
                    disabled={isDisabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm">{contact.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Relationship</p>
                      <p className="text-sm">{contact.relationship}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm">{contact.phone}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No emergency contacts added
            </p>
          )}

          {!isDisabled && (
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Contact Name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Relationship"
                  value={newContact.relationship}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      relationship: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Phone Number"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={addContact}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>Add emergency contact details</FormDescription>
      <FormMessage />
    </FormItem>
  );
};
