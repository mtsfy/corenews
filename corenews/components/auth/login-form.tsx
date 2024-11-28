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
import Cookies from "js-cookie";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";

const loginSchema = z.object({
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
});

const LoginForm = () => {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/login",
        data: {
          email: values.email,
          password: values.password,
        },
      });

      if (response.status === 200) {
        const token = response.data.access_token;
        localStorage.setItem("corenews-access-token", token);
        Cookies.set("corenews-access-token", token, { expires: 1, secure: true, sameSite: "strict" });
        setUser(response.data.user);
        toast.success("User logged in successfully.");
        setIsLoading(false);
        router.refresh();
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      setIsLoading(false);
      // Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
      const errorMsg = (axios.isAxiosError(error) && error.response?.data?.error) || "Something went wrong.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.log("[LOGIN ERROR]", error);
    }
  };
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <div className="w-1/2">
      <div className="my-8">
        <h1 className="font-bold text-3xl text-sky-600">Log in to your account</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit" disabled={isLoading} className="bg-sky-600 hover:opacity-80 hover:bg-sky-600 transition">
            Log in
          </Button>
        </form>
      </Form>
      <div className=" text-red-500 my-6">{errorMessage}</div>
      <div className="mt-6">
        <p className="font-light">
          Don&apos;t have a CoreNews account?{" "}
          <Link href={"/register"} className="underline font-bold text-sky-600 hover:opacity-80 hover:text-sky-600 transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
