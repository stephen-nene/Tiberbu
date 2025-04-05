import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SideImg } from "./Reset";
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

// Define forgot password schema with Zod
const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
});

export default function Forgot() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // Initialize form with Zod resolver
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const handleSubmit = async (formData) => {
    console.log(formData);
    setLoading(true);
    setServerError("");
    setSuccess(false);

    try {
      // Here you would make the API call to request password reset
      // For example: await api.post('/auth/forgot-password', formData);

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setSuccess(true);
    } catch (error) {
      setServerError(
        error?.response?.data?.detail ||
          error?.response?.data?.error ||
          "Failed to send reset link. Please try again."
      );
      console.error("Password reset request failed:", error);
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
                Reset Your Password
              </CardTitle>
              <CardDescription className="mt-4">
                Enter your email address below and we'll send you a link to
                reset your password.
              </CardDescription>
            </CardHeader>

            {serverError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert
                variant="success"
                className="mb-6 bg-green-50 text-green-800 border-green-200"
              >
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Password reset link has been sent to your email address.
                  Please check your inbox and follow the instructions.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* Email Input */}
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            disabled={loading || success}
                          />
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    ? "Sending..."
                    : success
                    ? "Email Sent"
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
