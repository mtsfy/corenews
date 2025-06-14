"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters long",
      })
      .max(50, {
        message: "Username cannot be longer that 50 characters",
      }),
    name: z.string().min(1, {
      message: "Name must be at least 1 character long",
    }),
    email: z
      .string()
      .email({
        message: "Email is invalid (e.g. john@email.com)",
      })
      .min(5, {
        message: "Email must be at least 5 characters long",
      }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passsword don't match",
    path: ["confirmPassword"],
  });

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/register",
        data: {
          username: values.username,
          name: values.name,
          email: values.email,
          password: values.password,
        },
      });

      if (response.status === 201) {
        toast.success("User registered successfully.");
        router.refresh();
        setIsLoading(false);
        router.push("/login");
        return;
      }
    } catch (error) {
      console.log("[REGISTER ERROR]", error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage((error.response.data as { error: string }).error);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      toast.error(errorMessage || "Something went wrong.");
      setIsLoading(false);
    }
  };
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  return (
    <div className="w-1/2">
      <div className="my-8">
        <h1 className="font-bold text-3xl text-sky-600">Create your free account</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" disabled={isLoading} {...field} />
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
                  <Input placeholder="Confirm Password" type="password" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="bg-sky-600 hover:opacity-80 hover:bg-sky-600 transition">
            Create account
          </Button>
        </form>
      </Form>
      <div className="mt-6">
        <p className="font-light">
          Already have an account?{" "}
          <Link href={"/login"} className="underline font-bold text-sky-600 hover:opacity-80 hover:text-sky-600 transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
