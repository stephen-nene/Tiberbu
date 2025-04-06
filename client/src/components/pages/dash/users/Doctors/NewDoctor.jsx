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
import { Card, CardContent, CardFooter } from "@/components/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import { Badge } from "@/components/shadcn/badge";
import { toast } from "sonner";

import { staffStore } from "@/store/staffStore";

import { PlusCircle, X, User } from "lucide-react";

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
  date_of_birth: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  profile_image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    })
    .optional(),
  gender: z.string().optional(),
  blood_group: z.string().optional(),
  address: addressSchema,
});



const clinicianInfoSchema = z.object({
  specializations: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        department: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .min(1, { message: "At least one specialization is required" }),
  license_number: z.string().optional(),
  medical_license: z.string().optional(),
  license_jurisdiction: z.string().optional(),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuing_body: z.string(),
        issued_date: z.string(),
      })
    )
    .default([]),
  accepting_new_patients: z.boolean().default(true),
  emergency_availability: z.boolean().default(true),
  experience: z.number().default(1),
  bio: z.string().optional(),
  rating: z.number().default(2),
  is_available: z.boolean().default(true),
  fees: z.number().default(1000),
});




const formSchema = z.object({
  basicInfo: basicInfoSchema,
  clinician_profile: clinicianInfoSchema,
});

export default function NewUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState("create"); // 'create', 'edit', or 'view'
  const [activeTab, setActiveTab] = useState("basic");

  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  const savePatient = staffStore((state) => state.savePatient);
  const patchPatient = staffStore((state) => state.patchPatient);

  const specializations = staffStore((state) => state.specializations);

  const fetchSpecializations = staffStore(
    (state) => state.fetchSpecializations
  );
  const loading = staffStore((state) => state.loading);

  useEffect(() => {
    if (specializations.length === 0) {
      fetchSpecializations();
    }
  }, [fetchSpecializations]);

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
      clinician_profile: {
        specializations: [],
        license_number: "",
        medical_license: "",
        license_jurisdiction: "",
        certifications: [],
        accepting_new_patients: true,
        emergency_availability: true,
        experience: 1,
        bio: "",
        rating: 2,
        is_available: true,
        fees: 1000,
      },

    },
  });
  const selectedSpecializations =
    form.watch("clinician_profile.specializations") || [];


  // Initialize form data from location state if it exists
  useEffect(() => {
    if (location.state) {
      console.log(location.state);
      const { doctorData,patientData, formMode } = location.state;

      if (formMode && ["create", "edit", "view"].includes(formMode)) {
        setMode(formMode);
      }

if (doctorData) {
  form.reset({
    basicInfo: {
      username: doctorData.username || "",
      email: doctorData.email || "",
      phone_number: doctorData.phone_number || "",
      first_name: doctorData.first_name || "",
      last_name: doctorData.last_name || "",
      date_of_birth: doctorData.date_of_birth || "",
      gender: doctorData.gender || "",
      blood_group: doctorData.blood_group || "",
      address: doctorData.address || {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    },
    clinician_profile: {
      specializations: doctorData.clinician_profile?.specializations || [],
      license_number: doctorData.clinician_profile?.license_number || "",
      medical_license: doctorData.clinician_profile?.medical_license || "",
      license_jurisdiction:
        doctorData.clinician_profile?.license_jurisdiction || "",
      certifications: doctorData.clinician_profile?.certifications || [],
      accepting_new_patients:
        doctorData.clinician_profile?.accepting_new_patients ?? true,
      emergency_availability:
        doctorData.clinician_profile?.emergency_availability ?? true,
      experience: doctorData.clinician_profile?.experience ?? 1,
      bio: doctorData.clinician_profile?.bio || "",
      rating: doctorData.clinician_profile?.rating ?? 2,
      is_available: doctorData.clinician_profile?.is_available ?? true,
      fees: doctorData.clinician_profile?.fees ?? 1000,
    },
  });
}

    }
  }, [location.state, form]);


  const handleFileChange = (e) => {

    const file = e.target.files[0]; 
    if (file && file.type.startsWith("image/")) {

      setImagePreview(URL.createObjectURL(file)); 
      form.setValue("basicInfo.profile_image", file); 
    }
  };



  const handleSpecializationSelect = (selectedName) => {
    const specializationObj = specializations.find(
      (s) => s.name === selectedName
    );
    if (!specializationObj) return;
    // Prevent duplicates
    if (!selectedSpecializations.some((s) => s.id === specializationObj.id)) {
      form.setValue("clinician_profile.specializations", [
        ...selectedSpecializations,
        specializationObj,
      ]);
    }
  };

  const handleRemoveIndustry = (spec) => {
    form.setValue(
      "clinician_profile.specializations",
      selectedSpecializations.filter((s) => s.id !== spec.id)
    );
  };

  const processErrors = (errors, toastId) => {
    // Iterate over the error object and extract the first error message for each field
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        const fieldErrors = errors[field];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          toast.error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} Error`,
            {
              id: toastId,
              description: fieldErrors[0],
            }
          );
          break;
        }
      }
    }
  };

  
  const onSubmit = async (data) => {


    const data2 = {
      ...data.basicInfo,
      id: location.state?.patientData?.id || "",
      role: "clinician",
      password: "dummypassword",

      attachments: data.attachments,
      clinician_profile: data.clinician_profile,
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
    const toastId = toast.loading("updating patient...");
    try {
      const response = await patchPatient(data);



      console.log("Response:", response);
      // navigate("/dashboard/patients");

      toast.success("Patient saved successfully!", {
        id: toastId,
      });
    } catch (error) {
      if (error?.response?.data) {
        processErrors(error?.response?.data, toastId);
      }
      console.error("Error saving patient:", error?.response);
    } 
  };

  const createPatient = async (data) => {
    const toastId = toast.loading("Saving patient...");

    try {
      const response = await savePatient(data);

      console.log("Response:", response);
      // navigate("/dashboard/patients");

      toast.success("Patient saved successfully!", {
        id: toastId,
      });
    } catch (error) {
      if (error?.response?.data) {
        processErrors(error?.response?.data, toastId);
      }
      console.error("Error saving patient:", error?.response);
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





  const genderOptions = ["male", "female", "non_binary", "undisclosed"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];


  // Check if form should be disabled (view mode)
  const isDisabled = mode === "view";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {mode === "create"
          ? "New Doctor Registration"
          : mode === "edit"
          ? "Edit Doctor Information"
          : "Doctor Details"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="doctor">Doctor Information</TabsTrigger>
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

                    <FormField
                      control={form.control}
                      name="basicInfo.profile_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Image</FormLabel>
                          {isDisabled ? (
                            // View mode - show avatar
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage
                                  src={
                                    field.value
                                      ? URL.createObjectURL(field.value)
                                      : "/default-avatar.png"
                                  }
                                  alt="Profile"
                                />
                                <AvatarFallback>
                                  <User className="h-8 w-8" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-500">
                                {field.value?.name || "No image selected"}
                              </span>
                            </div>
                          ) : (
                            // Edit mode - show file input
                            <FormControl>
                              <div className="flex flex-col text-center">
                                {imagePreview && (
                                  <Avatar className="h-44 w-44  mx-a to">
                                    <AvatarImage
                                      src={imagePreview}
                                      alt="Preview"
                                      className="rounded -full object-cover"
                                    />
                                    <AvatarFallback>
                                      <User className="h-8 w-8" />
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="mt-4 hover:cursor-pointer file:text-sm file:font-medium"
                                  disabled={isDisabled}
                                />
                              </div>
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="text-sm text-gray-500">
                      Allowed formats: PDF, JPG, DCM
                    </p>
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
                {/* card footer */}
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => navigate(-1 || "/dashboard/staff/doctors")}
                  >
                    {isDisabled ? "Back" : "Cancel"}
                  </Button>
                  {/* onclick go the the second tab */}
                  <Button
                    type="button"
                    onClick={() => setActiveTab("doctor")}
                    disabled={isDisabled}
                  >
                    Doctor's Profile
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Patient Information Tab */}
            <TabsContent value="doctor">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="clinician_profile.specializations"
                      render={({ field, fieldState }) => {
                        const selectedSpecializations = field.value || [];
                        return (
                          <FormItem>
                            <FormLabel>
                              Specializations{" "}
                              <span className="text-muted-foreground text-xs">
                                (Select multiple)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <div className="relative">
                                  {/* <Building className="text-emerald-800 absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 z-10" /> */}
                                  <Select
                                    onValueChange={handleSpecializationSelect}
                                    value="" // Reset after selection
                                  >
                                    <SelectTrigger
                                      className={`${
                                        fieldState.error ? "border-red-500" : ""
                                      } `}
                                    >
                                      <SelectValue placeholder="Select specializations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>
                                          Specialization - department
                                          <br />
                                          Description
                                        </SelectLabel>
                                        {specializations.map((spec) => (
                                          <SelectItem
                                            key={spec.id}
                                            value={spec.name}
                                            // Disable already selected industries
                                            disabled={selectedSpecializations.some(
                                              (s) => spec.id === s.id
                                            )}
                                          >
                                            {spec.name} - {spec.department}
                                            <p className="text-xs font-extralight">
                                              {spec.description}
                                            </p>
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Selected Industries Tags */}
                                {selectedSpecializations.length > 0 && (
                                  <div className="flex flex-wrap gap-2 my-5">
                                    {selectedSpecializations.map((spec) => (
                                      <Badge
                                        key={spec.id}
                                        variant="secondary"
                                        size="md"
                                        shape="pill"
                                        shadow="sm"
                                        hoverable="true"
                                        className="flex items-center"
                                      >
                                        {spec.name}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveIndustry(spec)
                                          }
                                          className="ml-2 cursor-pointer text-rose-600 hover:text-rose-800"
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        );
                      }}
                    />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="clinician_profile.license_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your license number"
                                disabled={isDisabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* medical_license field*/}
                      <FormField
                        control={form.control}
                        name="clinician_profile.medical_license"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical License Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your medical license number"
                                disabled={isDisabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* license_jurisdiction */}
                      <FormField
                        control={form.control}
                        name="clinician_profile.license_jurisdiction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Jurisdiction</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter the Issuing authority for medical license"
                                disabled={isDisabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="clinician_profile.bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              placeholder="Enter your bio"
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="clinician_profile.accepting_new_patients"
                        render={({ field }) => (
                          <FormItem className="flex">
                            <FormControl>
                              <Checkbox
                                {...field}
                                disabled={isDisabled}
                                checked={field.value}
                              />
                            </FormControl>
                            <FormLabel>Accepting new patients</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="clinician_profile.is_available"
                        render={({ field }) => (
                          <FormItem className="flex">
                            <FormControl>
                              <Checkbox
                                {...field}
                                disabled={isDisabled}
                                checked={field.value}
                              />
                            </FormControl>
                            <FormLabel>Is Available</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="clinician_profile.emergency_availability"
                        render={({ field }) => (
                          <FormItem className="flex">
                            <FormControl>
                              <Checkbox
                                {...field}
                                disabled={isDisabled}
                                checked={field.value}
                              />
                            </FormControl>
                            <FormLabel>Available for emergencies</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-4 ">
                      <FormField
                        control={form.control}
                        name="clinician_profile.experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience</FormLabel>
                            <FormControl>
                              {/* number input for experience */}
                              <Input
                                {...field}
                                type="number"
                                placeholder="Enter your experience"
                                disabled={isDisabled}
                                max={70}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="clinician_profile.fees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>hourly/Fees</FormLabel>
                            <FormControl>
                              {/* number input for experience */}
                              <Input
                                {...field}
                                type="currency"
                                placeholder="Enter your hourly charges"
                                disabled={isDisabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clinician_profile.rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Enter doctors rating"
                                disabled={isDisabled}
                                max={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* certifications */}
                    <FormField
                      control={form.control}
                      name="clinician_profile.certifications"
                      render={({ field }) => (
                        <CertificationsField
                          field={field}
                          form={form}
                          isDisabled={isDisabled}
                        />
                      )}
                    />

                  </div>
                </CardContent>
                <CardFooter className="flex justify-between ">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => navigate(-1 || "/dashboard/staff/doctors")}
                  >
                    {isDisabled ? "Back" : "Cancel"}
                  </Button>
                  {!isDisabled && (
                    <Button type="submit">
                      {mode === "create" ? "Create Doctor" : "Update Doctor"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end space-x-4">
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
const CertificationsField = ({ field, form, isDisabled }) => {
  const [newCert, setNewCert] = useState({
    name: "",
    issuing_body: "",
    issued_date: "",
  });

  const addCertification = () => {
    if (newCert.name && newCert.issuing_body && newCert.issued_date) {
      const updatedCerts = [...field.value, newCert];
      form.setValue("clinician_profile.certifications", updatedCerts);
      setNewCert({ name: "", issuing_body: "", issued_date: "" });
    } else {
      toast.error("Please fill in all fields before adding a certification.");
    }
  };

  const removeCertification = (index) => {
    toast.error("Are you sure you want to delete this certification?", {
      action: {
        label: "Confirm",
        onClick: () => {
          const updated = field.value.filter((_, i) => i !== index);
          form.setValue("clinician_profile.certifications", updated);
          toast.success("Certification removed");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
      duration: Infinity,
    });
  };

  return (
    <FormItem>
      <FormLabel>Certifications</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {field.value && field.value.length > 0 ? (
            <div className="space-y-4">
              {field.value.map((cert, index) => (
                <Card
                  key={index}
                  className="relative p-4 border border-gray-200 shadow-sm"
                >
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-3 top-3 h-6 w-6"
                    onClick={() => removeCertification(index)}
                    disabled={isDisabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Certification
                      </p>
                      <p className="text-sm font-medium">{cert.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Issuing Body
                      </p>
                      <p className="text-sm font-medium">{cert.issuing_body}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Issued Date
                      </p>
                      <p className="text-sm font-medium">{cert.issued_date}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No certifications added
            </p>
          )}

          {!isDisabled && (
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Certification Name"
                  value={newCert.name}
                  onChange={(e) =>
                    setNewCert({ ...newCert, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Issuing Body"
                  value={newCert.issuing_body}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issuing_body: e.target.value })
                  }
                />
                <Input
                  type="date"
                  placeholder="Issued Date"
                  value={newCert.issued_date}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issued_date: e.target.value })
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={addCertification}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>
        Add board certifications and qualifications.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
};

