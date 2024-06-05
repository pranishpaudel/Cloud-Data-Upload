"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import projectSchema from "@/schema/ProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { updateShowProjectState } from "@/helpers/state";
import { useAtom } from "jotai";

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

const CreateProject = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProject, setShowProject] = useAtom(updateShowProjectState);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      folder: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/createProject", values);
      const data = await response.data;
      console.log(data);
      toast({
        title: "Project created successfully",
        description: data?.message,
      });
      if (!data) return;
      const res2Post = {
        userId: data.userId,
        projectName: values.name,
        projectId: data.projectId,
        defaultBoolean: true,
        folderPath: values.folder,
      };

      const response2 = await axios.post("/api/createS3Folder", res2Post);
      const data2 = await response2.data;
      return;
    } catch (error) {
      toast({
        title: "Project creation failed",
        description: error?.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
      return;
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setShowProject(!showProject);
      return;
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2"
          >
            <span>Create New Project</span>
            <PlusIcon className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name of your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="folder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter folder path" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the folder where your project files will be saved.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter project description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is a brief description of your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProject;
