import React from "react";
import { Badge } from "@/components/shadcn/badge";
import { toast } from "sonner";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/shadcn/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { staffStore } from "@/store/staffStore";

import { useNavigate } from "react-router-dom";


// Define validation schema
const specializationSchema = z.object({
  name: z.string().min(1, "Specialty name is required"),
  description: z.string().min(1, "Description is required"),
  department: z.string().min(1, "Department is required"),
  is_surgical: z.boolean().default(false),
  is_primary_care: z.boolean().default(false),
  qualifications: z.string().min(1, "Qualifications are required"),
  average_consultation_fee: z.union([
    z.string().min(1, "Fee is required").transform((val) => parseFloat(val)),
    z.number(),
  ]),
  icd11_code: z
    .string()
    .min(1, "ICD-11 code is required")
    .max(10, "ICD-11 code must be 10 characters or less")
    .optional(),
  snomed_ct_id: z
    .string()
    .min(1, "SNOMED CT ID is required")
    .max(10, "SNOMED CT ID must be 10 characters or less")
    .optional(),
  // display_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
});

export default function NewSpecialization() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(specializationSchema),
    defaultValues: {
      name: "",
      description: "",
      department: "",
      is_surgical: false,
      is_primary_care: false,
      qualifications: "",
      average_consultation_fee: "",
      icd11_code: "",
      snomed_ct_id: "",
      // display_order: 0,
      is_active: true,
    },
  });
  const saveSpecialization = staffStore((state) => state.saveSpecialization);

const navigate  = useNavigate();
  const departments = [
    "Internal Medicine",
    "Surgery",
    
    "Obstetrics & Gynecology",
    "Psychiatry",
    "Radiology",
    "Pathology",
    "Emergency Medicine",
    "Family Medicine",
    "Cancer Center",
    "Cardiovascular",
    "Neurology & Neurosurgery",
    "Orthopedics",
    "Pediatrics",
    "Primary Care",
    "Respiratory Medicine",
    "Women's Health",
    "Other",
  ];

  const onSubmit = async (data) => {
    try {
      // console.log(data)
      // Here you would typically make an API call to your backend
      const res = await saveSpecialization(data);
      
      if (res === 201) {
        toast.success("Specialization created successfully!");
        reset();
        navigate("/dashboard/staff/specializations");
            }
      

    } catch (error) {
      toast.error("Failed to create specialization. Please try again.");
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-primary dark:text-primary-foreground">
          Add New Clinical Specialty
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Fill out the form to create a new medical specialization. Fields
          marked with <span className="text-red-500">*</span> are required.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Specialty Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                {...register("name")}
                placeholder="e.g., Cardiology, Neurology"
              />
              {errors.name && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-foreground">
                Department
              </Label>
              <Select
                onValueChange={(value) => setValue("department", value)}
                defaultValue={watch("department")}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {departments.map((dept) => (
                    <SelectItem
                      key={dept}
                      value={dept}
                      className="dark:hover:bg-gray-700"
                    >
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                {...register("description")}
                placeholder="Brief description of the specialty"
                rows={3}
              />
            </div>

            {/* Qualifications */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="qualifications" className="text-foreground">
                Qualifications
              </Label>
              <Textarea
                id="qualifications"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                {...register("qualifications")}
                placeholder="Required qualifications for this specialty"
                rows={3}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_surgical"
                  checked={watch("is_surgical")}
                  onCheckedChange={(checked) =>
                    setValue("is_surgical", checked)
                  }
                  className="dark:border-gray-600"
                />
                <Label htmlFor="is_surgical" className="text-foreground">
                  Surgical Specialty
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_primary_care"
                  checked={watch("is_primary_care")}
                  onCheckedChange={(checked) =>
                    setValue("is_primary_care", checked)
                  }
                  className="dark:border-gray-600"
                />
                <Label htmlFor="is_primary_care" className="text-foreground">
                  Primary Care Specialty
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={watch("is_active")}
                  onCheckedChange={(checked) => setValue("is_active", checked)}
                  className="dark:border-gray-600"
                />
                <Label htmlFor="is_active" className="text-foreground">
                  Active (Visible in system)
                </Label>
              </div>
            </div>

            {/* Medical Codes and Fees */}
            <div className="space-y-2">
              <Label
                htmlFor="average_consultation_fee"
                className="text-foreground"
              >
                Average Consultation Fee
              </Label>
              <Input
                id="average_consultation_fee"
                type="number"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                {...register("average_consultation_fee")}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.average_consultation_fee && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.average_consultation_fee.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icd11_code" className="text-foreground">
                ICD-11 Code
              </Label>
              <Input
                id="icd11_code"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                {...register("icd11_code")}
                placeholder="e.g., 8A00"
                maxLength={10}
              />
              {errors.icd11_code && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.icd11_code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="snomed_ct_id" className="text-foreground">
                SNOMED CT ID
              </Label>
              <Input
                id="snomed_ct_id"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                {...register("snomed_ct_id")}
                placeholder="e.g., 394589003"
                maxLength={10}
              />
              {errors.snomed_ct_id && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.snomed_ct_id.message}
                </p>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="display_order" className="text-foreground">
                Display Order
              </Label>
              <Input
                id="display_order"
                type="number"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                {...register("display_order", { valueAsNumber: true })}
                min="0"
              />
              {errors.display_order && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.display_order.message}
                </p>
              )}
            </div> */}

          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t px-6 py-4 dark:border-gray-700">
          <Button
            variant="destructive"
            type="button"
            onClick={() => window.history.back()}
            // className=""
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            // className=""
          >
            {isSubmitting ? "Creating..." : "Create Specialty"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
