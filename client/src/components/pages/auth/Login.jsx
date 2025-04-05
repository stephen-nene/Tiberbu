import React, { useState } from "react";
import { useUserStore } from "../../../store/useUserStore";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Key,
  User,
  Stethoscope,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SideImg } from "./Reset";
import LoginImg from "../../../assets/images/auth/Login.png";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/shadcn/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/shadcn/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Checkbox } from "@/components/shadcn/checkbox";

// Define login form schema with Zod
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devModeUserType, setDevModeUserType] = useState("admin");
  const navigate = useNavigate();
  const { user, loggedIn, login } = useUserStore();

  // Initialize form with Zod resolver
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = async (formData) => {
    setServerError("");
    setLoading(true);
    try {
      const res = await login(formData, navigate);
      if (res) {
        toast.success("Login successful!", {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Login error:", error?.response?.data);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        "Failed to login";
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDummyLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setServerError("");

      // Dummy credentials based on user type
      const credentials = {
        admin: {
          identifier: "admin@example.com",
          password: "mnbvcxzxcvbnm",
          role: "admin",
        },
        doctor: {
          identifier: "drsmith@example.com",
          password: "mnbvcxzxcvbnm",
          role: "doctor",
        },
        patient: {
          identifier: "janedoe@example.com",
          password: "mnbvcxzxcvbnm",
          role: "patient",
        },
      };

      const dummyCredentials = credentials[devModeUserType];

      const res = await login(dummyCredentials, navigate);
      if (res) {
        toast.success(`Logged in as ${devModeUserType} successfully!`, {
          duration: 2000,
          description: `You now have ${devModeUserType} level access`,
        });
      }
    } catch (error) {
      console.error("Dummy login failed:", error?.response);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to login";
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center w-full p-4 lg:p-0">
      <Card className="w-full max-w-screen-xl border shadow-lg rounded-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Side - Login Form */}
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <CardHeader className="px-0 pb-6">
              <CardTitle className="text-gray-800 text-4xl font-extrabold">
                tib<span className="text-rose-600">ER</span>bu HMS
              </CardTitle>
              <CardTitle className="text-gray-800 text-2xl mt-2">
                Staff & Patient Portal
              </CardTitle>
              {loggedIn && (
                <CardDescription className="text-green-600 mt-2">
                  {user?.name || user?.email}
                </CardDescription>
              )}
            </CardHeader>

            {serverError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
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
                            placeholder="Enter email"
                            className="pl-10"
                          />
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Input */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="***********"
                            className="pl-10 pr-10"
                          />
                          <Key className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Remember me</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Link
                    to="/forgot"
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Dev Mode Section */}
                <div className="space-y-2 pt-2">
                  <Label>Developer Mode</Label>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={devModeUserType}
                      onValueChange={setDevModeUserType}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="doctor">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Doctor
                          </div>
                        </SelectItem>
                        <SelectItem value="patient">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Patient
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      className="flex-1"
                      variant="outline"
                      disabled={loading}
                      onClick={handleDummyLogin}
                    >
                      {loading ? "Loading..." : "Quick Login"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Use this to quickly test different user roles
                  </p>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full"
                  variant="default"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                {/* Register Link */}
                <p className="text-sm text-gray-600 text-center pt-2">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >
                    Register Here
                  </Link>
                </p>
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
