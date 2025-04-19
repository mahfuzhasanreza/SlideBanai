import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
} from "@/components/ui/form";


// Authentication methods
const METHODS = {
  EMAIL_PASSWORD: "email-password",
} as const;

// Authentication stages
const STAGES = {
  SELECT_METHOD: "select-method",
  LOGIN: "login",
  REGISTER: "register",
} as const;



  // Renders the appropriate authentication UI based on stage and method
  const renderAuthContent = () => {
    // Initial method selection screen
    if (authStage === STAGES.SELECT_METHOD) {
      return (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold text-center mb-6">Sign in with</h3>
            <div className="grid gap-4">
              <GoogleSignInButton 
                variant="default"
                onSuccess={() => navigate("/")}
              />
              
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 h-12"
                onClick={() => {
                  setAuthMethod(METHODS.EMAIL_PASSWORD);
                  setAuthStage(STAGES.LOGIN);
                }}
              >
                <Mail className="h-4 w-4" />
                <span>Email & Password</span>
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 h-12"
                onClick={() => {
                  setAuthStage(STAGES.REGISTER);
                }}
              >
                <span>Create New Account</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Email + Password login
    else if (
      authStage === STAGES.LOGIN &&
      authMethod === METHODS.EMAIL_PASSWORD
    ) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-8 w-8 mr-2"
                onClick={handleBack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <h3 className="text-xl font-bold">Sign in with Email</h3>
            </div>

            <Form {...emailLoginForm}>
              <form
                onSubmit={emailLoginForm.handleSubmit(onEmailLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={emailLoginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={emailLoginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      );
    }

    // Registration
    else if (authStage === STAGES.REGISTER) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-8 w-8 mr-2"
                onClick={handleBack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <h3 className="text-xl font-bold">Create Account</h3>
            </div>

            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-slate-900">
      {/* Left section - Authentication Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Logo size="lg" />
            <h1 className="text-2xl font-bold">SlideCraft AI</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Sign in to create beautiful presentations with AI
            </p>
          </div>

          {renderAuthContent()}
        </div>
      </div>

      {/* Right section - Hero Area */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 px-4 py-8 bg-primary-100 dark:bg-slate-800">
        <div className="max-w-lg space-y-6">
          <h2 className="text-3xl font-bold text-center">
            Transform Your Presentation Experience
          </h2>
          <p className="text-lg text-center">
            SlideCraft AI helps you create stunning presentations in minutes,
            not hours. Leverage AI to generate professional slides from your
            content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">AI-Powered Content</h3>
              <p>Generate professional slides with just a few clicks</p>
            </div>
            <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Beautiful Designs</h3>
              <p>Choose from a variety of professionally designed templates</p>
            </div>
            <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Real-time Collaboration</h3>
              <p>Work together with your team seamlessly</p>
            </div>
            <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Presentation Coach</h3>
              <p>Get feedback to improve your presentation skills</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}