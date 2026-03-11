import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be at most 30 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleToggleMode = () => {
    loginForm.reset();
    signupForm.reset();
    setIsLogin(!isLogin);
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      const user = await apiRequest("POST", "/api/auth/login", data);
      
      // Manually set user in cache to immediately update auth state
      queryClient.setQueryData(["/api/auth/user"], user);
      
      toast({
        title: "Welcome back",
      });
      
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    try {
      const user = await apiRequest("POST", "/api/auth/signup", data);
      
      // Manually set user in cache to immediately update auth state
      queryClient.setQueryData(["/api/auth/user"], user);
      
      toast({
        title: "You're in!",
      });
      
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {isLogin ? "Welcome Back" : "Join Commons"}
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin
              ? "Sign in to continue sharing with friends"
              : "Create an account to start sharing"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email/Password Form */}
          {isLogin ? (
            <Form {...loginForm} key="login-form">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          data-testid="input-login-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          data-testid="input-login-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={loginForm.formState.isSubmitting}
                  data-testid="button-login-submit"
                >
                  {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signupForm} key="signup-form">
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={signupForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            autoComplete="given-name"
                            data-testid="input-signup-firstname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            autoComplete="family-name"
                            data-testid="input-signup-lastname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          data-testid="input-signup-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          autoComplete="username"
                          data-testid="input-signup-username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          data-testid="input-signup-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={signupForm.formState.isSubmitting}
                  data-testid="button-signup-submit"
                >
                  {signupForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          )}

          {/* Toggle between Login/Signup */}
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-primary hover:underline"
              data-testid="button-toggle-auth-mode"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
