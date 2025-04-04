import React, { useState } from "react";
import { PencilLine, Upload, Save, Loader, LogOut } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const { logOut } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // console.log(user);

  // Default profile with fallbacks to backend data or N/A
  const [profile, setProfile] = useState({
    fullName: user?.name || "N/A",
    email: user?.email || "N/A",
    phone: "+254756982543", // Not in backend data
    address: "Westlands, Ojijo road, Kenrailit", // Not in backend data
    gender: user?.gender||"N/A", // Not in backend data
    role: user?.role || "IT & Telecommunication", // Not in backend data
    photo: "/src/assets/Paul.png", // Placeholder image
  });

  // Store original profile data to enable cancel functionality
  const [originalProfile, setOriginalProfile] = useState({ ...profile });

  // Get the initials for avatar fallback
  const getInitials = (name) => {
    if (!name || name === "N/A") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    toast.error("Are you sure you want to logout?", {
      action: {
        label: "Confirm",
        onClick: () => {
          // toast.success("Logged out successfully");
          logOut(navigate);
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
      duration: Infinity,
    });
  };

  const handleEdit = () => {
    setOriginalProfile({ ...profile });
    setIsEditing(true);
    toast.info("You are now in edit mode");
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
    toast.info("Changes have been discarded");
  };

  const handleSave = () => {
    setIsSaving(true);

    const saveProfile = new Promise((resolve) => {
      setTimeout(() => {
        console.log("Updated profile data:", profile);
        setIsEditing(false);
        setOriginalProfile({ ...profile });
        resolve();
      }, 500);
    });

    toast.promise(saveProfile, {
      loading: "Saving profile changes...",
      success: "Profile updated successfully!",
      error: "Failed to update profile",
    });

    saveProfile.finally(() => setIsSaving(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center p-6 dark:bg-gray-900"
      style={{ backgroundImage: "url('/src/assets/images/image.jpeg/')" }}
    >
      <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold dark:text-gray-100">
            {isEditing ? "Edit Profile" : "Profile Details"}
          </CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleEdit}
              className="dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <PencilLine size={18} />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.photo} alt="Profile" />
                <AvatarFallback className="text-lg">
                  {getInitials(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                className="dark:text-gray-300 dark:hover:bg-gray-600"
                disabled={!isEditing}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload New Photo
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            At least 800 x 800 px recommended. JPG or PNG is allowed.
          </p>

          <Card className="mt-6 bg-white dark:bg-gray-800 shadow-inner">
            <CardHeader>
              <CardTitle className="text-lg font-semibold dark:text-gray-100">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-semibold dark:text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold dark:text-gray-300">
                    Email
                  </Label>
                  <Input
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold dark:text-gray-300">
                    Phone
                  </Label>
                  <Input
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold dark:text-gray-300">
                    Address
                  </Label>
                  <Input
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold dark:text-gray-300">
                    Gender
                  </Label>
                  <Input
                    name="kra"
                    value={profile.gender}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold dark:text-gray-300">
                    Role
                  </Label>
                  <Input
                    name="industry"
                    value={profile.role}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    disabled={true}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    className="dark:text-gray-300 dark:hover:bg-gray-600"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
                    loading={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-fu flex items-center px-4 py-2.5 rounded-lg transition-colors mt-8"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="font-medium text-sm">Log Out</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
