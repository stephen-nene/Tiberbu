import React, { useState } from "react";
import { useUserStore } from "../../../store/useUserStore";

import { toast } from "sonner";
import { Eye, EyeOff, Mail, Key } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


import { SideImg } from "./Reset";
import LoginImg from "../../../assets/images/auth/Login.png";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/shadcn/alert";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loggedIn, login } = useUserStore();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        setServerError("");
        const res = await login(formData, navigate);
      } catch (error) {
        console.error("Caught error is", error.response?.data);
        setServerError(error.response?.data?.detail);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fix the errors in the form.", 2);
    }
  };

  const handleDummyLogin = async () => {
    try {
      setLoading(true);
      setServerError("");

      // Dummy credentials
      const dummyCredentials = {
        email: "stevekid705@gmail.com",
        password: "mnbvcxzMNBVCXZ",
      };

      // console.log("Attempting dummy login...");

      // Perform the login
      const res = await login(dummyCredentials, navigate);
      if (res) {
        toast.success("Logged in successfully!", { duration: 2000 });
      }
    } catch (error) {
      // console.error("Dummy login failed:", error.response?.data);
      setServerError(error.response?.data?.detail || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="font-[sans-serif] min-h-screen flex items-center justify-center max-w-screen sm:px-4 lg:px-20">
      {/* Error alert */}
      <div className="w-full border-0  grid lg:grid-cols-2 items-center overflow-hidden">
        <CardContent className="p-6 w-full">
          <form onSubmit={handleSubmit} noValidate>
            <div className="">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-gray-800 text-4xl font-extrabold">
                  Tender<span className="text-green-500">-Hub</span>
                </CardTitle>
                <CardTitle className="text-gray-800 text-2xl">
                  Welcome Back
                </CardTitle>
                {loggedIn && (
                  <CardDescription className="text-green-600">
                    {user.name || user.email}
                  </CardDescription>
                )}
              </CardHeader>
            </div>

            {serverError && (
              <Alert variant="error">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* Email Input */}
            <div className="space-y-2 my-4">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className={`${
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  } pl-10`}
                />
                {/* <Mail className="w-[18px] h-[18px] absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" /> */}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="***********"
                  className={`${
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  } pl-10 pr-10`}
                />
                {/* <Key className="w-[18px] h-[18px] absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" /> */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between my-8">
              <div className="flex items-center space-x-2">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 shrink-0 text-green-600 focus:ring-green-500 border-gray-300 rounded-md"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot"
                className="text-green-600 font-semibold text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            {/* Submit Button */}
            <Button
              className="w-full text-xl mb-6"
              variant="devMode"
              loading={loading}
              onClick={() => handleDummyLogin()}
            >
              Dev Mode
            </Button>

            <Button
              // size="lg"
              type="submit"
              className="w-full  text-xl "
              variant="default"
              loading={loading}
            >
              Login
            </Button>

            {/* Register Link */}
            <p className="text-sm mt-4 text-gray-800 text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-green-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>

        {/* Left Side - Image */}
        <SideImg height="full" img={LoginImg} className="hidden  lg:block" />
      </div>
    </div>
  );
}
