import React, { useState } from 'react';
import { Badge } from "@/components/shadcn/badge";
import { toast } from "sonner";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/shadcn/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/shadcn/select";

export default function NewSpecialization() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    is_surgical: false,
    is_primary_care: false,
    qualifications: '',
    average_consultation_fee: '',
    icd11_code: '',
    snomed_ct_id: '',
    display_order: 0,
    is_active: true
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to your backend
      // await api.createSpecialization(formData);
      
      toast.success("Specialization created successfully!");
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        department: '',
        is_surgical: false,
        is_primary_care: false,
        qualifications: '',
        average_consultation_fee: '',
        icd11_code: '',
        snomed_ct_id: '',
        display_order: 0,
        is_active: true
      });
    } catch (error) {
      toast.error("Failed to create specialization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Common departments for selection
  const departments = [
    'Internal Medicine',
    'Surgery',
    'Pediatrics',
    'Obstetrics & Gynecology',
    'Psychiatry',
    'Radiology',
    'Pathology',
    'Emergency Medicine',
    'Family Medicine',
    'Other'
  ];

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Clinical Specialty</CardTitle>
        <CardDescription>
          Fill out the form to create a new medical specialization. Fields marked with <span className="text-red-500">*</span> are required.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Specialty Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Cardiology, Neurology"
                required
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the specialty"
                rows={3}
              />
            </div>

            {/* Qualifications */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="Required qualifications for this specialty"
                rows={3}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_surgical"
                  checked={formData.is_surgical}
                  onCheckedChange={(checked) => handleCheckboxChange('is_surgical', checked)}
                />
                <Label htmlFor="is_surgical">Surgical Specialty</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_primary_care"
                  checked={formData.is_primary_care}
                  onCheckedChange={(checked) => handleCheckboxChange('is_primary_care', checked )}
                />
                <Label htmlFor="is_primary_care">Primary Care Specialty</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleCheckboxChange('is_active', checked )}
                />
                <Label htmlFor="is_active">Active (Visible in system)</Label>
              </div>
            </div>

            {/* Medical Codes and Fees */}
            <div className="space-y-2">
              <Label htmlFor="average_consultation_fee">Average Consultation Fee</Label>
              <Input
                id="average_consultation_fee"
                name="average_consultation_fee"
                type="number"
                value={formData.average_consultation_fee}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icd11_code">ICD-11 Code</Label>
              <Input
                id="icd11_code"
                name="icd11_code"
                value={formData.icd11_code}
                onChange={handleChange}
                placeholder="e.g., 8A00"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snomed_ct_id">SNOMED CT ID</Label>
              <Input
                id="snomed_ct_id"
                name="snomed_ct_id"
                value={formData.snomed_ct_id}
                onChange={handleChange}
                placeholder="e.g., 394589003"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                value={formData.display_order}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Specialty"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}