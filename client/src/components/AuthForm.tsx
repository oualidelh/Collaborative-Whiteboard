"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login, signup } from "@/app/(auth)/actions";

import { z } from "zod";
import { LockIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type formType = "signUp" | "signIn";

const AuthForm = ({ type }: { type: formType }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    let errorMessage;

    if (type === "signUp") {
      errorMessage = await signup(formData);
    } else {
      errorMessage = await login(formData);
    }

    if (errorMessage) {
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold ">Welcome Back</h1>
          <p className="text-sage-600">Sign in to access your whiteboard</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h1 className="">{type === "signIn" ? "Sign In" : "Sign Up"}</h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel className="shad-form-label">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-500 h-4 w-4" />
                        <Input
                          className="pl-10"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel className="shad-form-label">Password</FormLabel>

                    <FormControl>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-500 h-4 w-4" />
                        <Input
                          className="pl-10"
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-sage-500 hover:bg-sage-600"
              type="submit"
            >
              {type === "signIn" ? "Sign In" : "Sign Up"}
            </Button>
            <div className="body-2 flex justify-center">
              <p className="text-light-100">
                {type === "signIn"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <Link
                href={type === "signIn" ? "/sign-up" : "/sign-in"}
                className="ml-1 font-medium text-brand"
              >
                {" "}
                {type === "signIn" ? "Sign Up" : "Sign In"}
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
