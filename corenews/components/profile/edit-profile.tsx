"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import LogoutButton from "../auth/logout-button";
import { MultiSelect } from "../multi-select";

import sourcesData from "@/sources.json";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

interface EditProfileProps {
  user: User;
}

const profileSchema = z.object({
  name: z.string().min(1, {
    message: "Name has to be at least 1 character",
  }),
  username: z.string().min(1, {
    message: "Username has to be at least 1 character",
  }),
  email: z.string().email({
    message: "Email is invalid (e.g. john@email.com)",
  }),
  topics: z.array(z.string().min(1)).min(1, {
    message: "Select at least 1 topic",
  }),
  sources: z.array(z.string().min(1)).min(1, {
    message: "Select at least 1 source",
  }),
  regions: z.array(z.string().min(1)).min(1, {
    message: "Select at least 1 region",
  }),
});

const EditProfile: React.FC<EditProfileProps> = ({ user }) => {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      username: user.username,
      topics: user.topics,
      sources: user.sources,
      regions: user.regions,
    },
  });

  const news_topics = [
    {
      label: "Business",
      value: "business",
    },
    {
      label: "Entertainment",
      value: "entertainment",
    },
    {
      label: "General",
      value: "general",
    },
    {
      label: "Health",
      value: "health",
    },
    {
      label: "Science",
      value: "science",
    },
    {
      label: "Sports",
      value: "sports",
    },
    {
      label: "Technology",
      value: "technology",
    },
    {
      label: "Politics",
      value: "politics",
    },
    {
      label: "Environment",
      value: "environment",
    },
  ];

  const news_sources = sourcesData.sources.map((source) => ({
    label: source.name,
    value: source.id,
  }));

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex flex-col gap-8 w-full">
          <div className="space-y-2">
            <Label className="font-bold text-lg">User ID: </Label>
            <h3>{user.id} </h3>
          </div>
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg">Name: </FormLabel>
                <FormControl>
                  <Input id="name" className="font-medium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg">Username: </FormLabel>
                <FormControl>
                  <Input id="username" className="font-medium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg">Email: </FormLabel>
                <FormControl>
                  <Input id="email" className="font-medium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Topics */}
          <FormField
            control={form.control}
            name="topics"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg">Topics: </FormLabel>
                <FormControl>
                  <MultiSelect
                    options={news_topics}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Select topics"
                    variant="default"
                    animation={2}
                    maxCount={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Sources */}
          <FormField
            control={form.control}
            name="sources"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg">Sources: </FormLabel>
                <FormControl>
                  <MultiSelect
                    options={news_sources}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Select sources"
                    variant="default"
                    animation={2}
                    maxCount={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="self-end flex gap-4">
            <Button className="bg-sky-600" type="submit">
              Update Profile
            </Button>
            <LogoutButton />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EditProfile;
