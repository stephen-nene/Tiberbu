import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, Stethoscope } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleServerReset } from "../../../services/requests/auth";
import LoginImg from "../../../assets/images/auth/Login.png";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/shadcn/alert";

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
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    setServerError("");
    setSuccess(false);

    try {
      await handleServerReset(
        {
          ...values,
          otp: otp,
        },
        navigate
      );
      setSuccess(true);
    } catch (error) {
      setServerError(
        error?.response?.data?.detail ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center w-full p-4 lg:p-0">
      <Card className="w-full max-w-screen-xl border shadow-lg rounded-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Side - Form */}
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <CardHeader className="px-0 pb-6">
              <div className="mb-4">
                <Link
                  to="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
              <CardTitle className="text-gray-800 text-4xl font-extrabold">
                tib<span className="text-rose-600">ER</span>bu HMS
              </CardTitle>
              <CardTitle className="text-gray-800 text-2xl mt-2">
                Set New Password
              </CardTitle>
              <CardDescription className="mt-4">
                Create a new password for your account.
              </CardDescription>
            </CardHeader>

            {serverError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {serverError}{" "}
                  <Link to="/forgot" className="text-blue-500 underline">
                    Try again
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert
                variant="success"
                className="mb-6 bg-green-50 text-green-800 border-green-200"
              >
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your password has been updated successfully. You can now login
                  with your new password.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Password Input */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter new password"
                            className="pl-10"
                            disabled={loading || success}
                          />
                          <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Input */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm new password"
                            className="pl-10"
                            disabled={loading || success}
                          />
                          <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  variant="default"
                  disabled={loading || success}
                >
                  {loading
                    ? "Resetting..."
                    : success
                    ? "Password Updated"
                    : "Reset Password"}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 font-semibold hover:underline ml-1"
                    >
                      Back to Login
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Side - Image */}
          <SideImg height="full" img={LoginImg} className="hidden lg:block" />
        </div>
      </Card>
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
