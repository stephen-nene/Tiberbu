import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
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

export default function NewPatients() {
  const [basicInfo, setBasicInfo] = useState({
    username: "",
    email: "",
    phone_number: "",
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
  });

  const [patientInfo, setPatientInfo] = useState({
    medical_history: "",
    known_allergies: [],
    permanent_medications: [],
    emergency_contacts: [],
    primary_insurance: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [newAttachment, setNewAttachment] = useState({
    file: null,
    document_type: "",
    caption: "",
    description: "",
    is_sensitive: false,
  });

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBasicInfo({
        ...basicInfo,
        [parent]: {
          ...basicInfo[parent],
          [child]: value,
        },
      });
    } else {
      setBasicInfo({
        ...basicInfo,
        [name]: value,
      });
    }
  };

  const handlePatientInfoChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo({
      ...patientInfo,
      [name]: value,
    });
  };

  const handleAttachmentChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setNewAttachment({
      ...newAttachment,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  const addAttachment = () => {
    if (newAttachment.file && newAttachment.document_type) {
      setAttachments([...attachments, { ...newAttachment, id: Date.now() }]);
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
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the form submission, perhaps with an API call
    console.log("Form submitted:", { basicInfo, patientInfo, attachments });
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Patient Registration</h1>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
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
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={basicInfo.username}
                      onChange={handleBasicInfoChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={basicInfo.email}
                      onChange={handleBasicInfoChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      value={basicInfo.phone_number}
                      onChange={handleBasicInfoChange}
                      placeholder="+1234567890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={basicInfo.full_name}
                      onChange={handleBasicInfoChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={basicInfo.date_of_birth}
                      onChange={handleBasicInfoChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      onValueChange={(value) =>
                        setBasicInfo({ ...basicInfo, gender: value })
                      }
                      value={basicInfo.gender}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blood_group">Blood Group</Label>
                    <Select
                      onValueChange={(value) =>
                        setBasicInfo({ ...basicInfo, blood_group: value })
                      }
                      value={basicInfo.blood_group}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroupOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address.street">Street</Label>
                      <Input
                        id="address.street"
                        name="address.street"
                        value={basicInfo.address.street}
                        onChange={handleBasicInfoChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address.city">City</Label>
                      <Input
                        id="address.city"
                        name="address.city"
                        value={basicInfo.address.city}
                        onChange={handleBasicInfoChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address.state">State/Province</Label>
                      <Input
                        id="address.state"
                        name="address.state"
                        value={basicInfo.address.state}
                        onChange={handleBasicInfoChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address.zip">ZIP/Postal Code</Label>
                      <Input
                        id="address.zip"
                        name="address.zip"
                        value={basicInfo.address.zip}
                        onChange={handleBasicInfoChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address.country">Country</Label>
                      <Input
                        id="address.country"
                        name="address.country"
                        value={basicInfo.address.country}
                        onChange={handleBasicInfoChange}
                      />
                    </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="medical_history">Medical History</Label>
                    <Textarea
                      id="medical_history"
                      name="medical_history"
                      value={patientInfo.medical_history}
                      onChange={handlePatientInfoChange}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="known_allergies">Known Allergies</Label>
                    <Textarea
                      id="known_allergies"
                      name="known_allergies"
                      value={patientInfo.known_allergies}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          known_allergies: e.target.value.split("\n"),
                        })
                      }
                      placeholder="List allergies, one per line"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500">
                      Enter each allergy on a new line
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permanent_medications">
                      Permanent Medications
                    </Label>
                    <Textarea
                      id="permanent_medications"
                      name="permanent_medications"
                      value={patientInfo.permanent_medications.join("\n")}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          permanent_medications: e.target.value.split("\n"),
                        })
                      }
                      placeholder="List medications, one per line"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500">
                      Enter each medication on a new line
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contacts">
                      Emergency Contacts
                    </Label>
                    <Textarea
                      id="emergency_contacts"
                      name="emergency_contacts"
                      value={patientInfo.emergency_contacts.join("\n")}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          emergency_contacts: e.target.value.split("\n"),
                        })
                      }
                      placeholder="Name, Relationship, Phone Number (one contact per line)"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500">
                      Format: Name, Relationship, Phone Number (one contact per
                      line)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primary_insurance">Primary Insurance</Label>
                    <Textarea
                      id="primary_insurance"
                      name="primary_insurance"
                      value={patientInfo.primary_insurance}
                      onChange={handlePatientInfoChange}
                      placeholder="Insurance provider, policy number, etc."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Attachments Tab */}
          <TabsContent value="attachments">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
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
                          className="pb-6"
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
                        <Label htmlFor="is_sensitive">Sensitive Document</Label>
                      </div>

                      <div className="flex items-end">
                        <Button type="button" onClick={addAttachment}>
                          Add Attachment
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Uploaded Attachments
                    </h3>
                    {attachments.length === 0 ? (
                      <p className="text-gray-500">
                        No attachments uploaded yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {attachments.map((attachment) => (
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
                              <p className="text-sm">{attachment.file?.name}</p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeAttachment(attachment.id)}
                            >
                              Remove
                            </Button>
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
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save Patient</Button>
        </div>
      </form>
    </div>
  );
}
