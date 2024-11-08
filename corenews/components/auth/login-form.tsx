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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/login",
        data: {
          email: values.email,
          password: values.password,
        },
      });

      if (response.status === 200) {
        // response.data.access_token
        const token = response.data.access_token;
        localStorage.setItem("corenews-access-token", token);
        Cookies.set("corenews-access-token", token, { expires: 1, secure: true, sameSite: "strict" });

        toast.success("User logged in successfully.");
        setIsLoading(false);
        router.refresh();
        router.push("/dashboard");
        return;
      }
    } catch (error: any) {
      console.log("[LOGIN ERROR]", error);
      setErrorMessage(error.response.data.error);
      toast.error(errorMessage || "Something went wrong.");
      setIsLoading(false);
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
    <div className="p-8">
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
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
