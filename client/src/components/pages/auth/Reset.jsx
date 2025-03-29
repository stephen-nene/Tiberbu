import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Stethoscope } from "lucide-react";
import { handleServerReset } from "../../../services/requests/auth";

// import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/shadcn/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import pic from "../../../assets/images/Hero.png";
import profile from "../../../assets/images/Learn.jpeg";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must include uppercase, lowercase, number, and special character",
        }
      ),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password!" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The two passwords do not match!",
    path: ["confirmPassword"],
  });

export default function PasswordResetForm() {
  const [loading, setLoading] = useState(false);
  const { otp } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const response = await handleServerReset(
        {
          ...values,
          otp: otp,
        },
        navigate
      );

      setMsg(response?.data?.info);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        "Failed to reset password. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial check - removed empty function call
    // as it seemed like a potential bug in the original
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 items-center gap-4 bg-white shadow-md rounded-md overflow-hidden w-full">
      {/* Right Side - Form */}
      <div className="p-6 sm:max-w-md w-full">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800">
            Procure<span className="text-green-500">365</span>
          </h3>
          <h3 className="text-2xl font-bold text-gray-800">
            Reset Your Password
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Enter your new password and confirm it below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit(e))} className="space-y-4">
            {msg && (
              <Alert
                variant="success"
                className="mb-4 bg-green-50 border-green-500 text-green-800"
              >
                <AlertDescription>{msg}</AlertDescription>
              </Alert>
            )}

            {error ? (
              <Alert variant="destructive" className="mb-8">
                <AlertDescription>
                  {error}{" "}
                  <Link to="/forgot" className="text-blue-500 underline">
                    here
                  </Link>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <Lock size={18} />
                          </span>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            className="pl-10 rounded-md"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <Lock size={18} />
                          </span>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="pl-10 rounded-md"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 text-sm tracking-wide rounded-md text-white bg-btnColor hover:bg-green-700 focus:outline-none"
                >
                  {loading ? "Processing..." : "Reset Password"}
                </Button>
              </>
            )}
          </form>
        </Form>

        {/* Additional Links */}
        <div className="flex justify-between mt-4">
          <Link to="/login" className="text-green-600 font-semibold text-sm">
            Back to Login
          </Link>
          <Link to="/register" className="text-green-600 font-semibold text-sm">
            Register here
          </Link>
        </div>
      </div>

      {/* Left Side - Image */}
      <SideImg height="full" />
    </div>
  );
}

export const SideImg = ({ height = "full", img, className }) => {
  return (
    <div
      className={`hidden md:block bg-contain bg-center h -${height} rounded-lg px-4 py-2 overflow-hidden relative ${className}`}
      style={{ backgroundImage: `url(${img})` }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Text Section */}
      <div className="relative z-10 my-4 text-white p-8">
        <h2 className="text-3xl my-16 font-bold">
          Excellence in Healthcare Management
        </h2>
        <div className="text-lg">
          Welcome to MedCare Hospital's management portal. Our integrated system
          connects healthcare professionals with patients, streamlining
          appointments, records, and hospital operations for better patient
          care.
        </div>
      </div>

      {/* Profile Section - Doctor Testimonial */}
      <div className="relative z-10 py-4 px-8 rounded-lg mt-[400px] text-white mx-auto bg-blue-600/90 backdrop-blur-sm max-w-md sm:mt-[300px]">
        <div className="flex items-center space-x-4 my-2">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold">Dr. Sarah Johnson</div>
            <p className="font-normal mt-1 text-sm">Chief of Cardiology</p>
          </div>
        </div>
        <p className="font-normal text-sm my-4">
          Our hospital management system has transformed how we deliver care.
          With streamlined appointments and instant access to patient records,
          we can focus more on what matters - our patients' health.
        </p>
      </div>
    </div>
  );
};
