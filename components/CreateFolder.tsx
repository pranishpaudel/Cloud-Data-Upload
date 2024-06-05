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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { createFolderAtom } from "@/helpers/state";
import { useAtom } from "jotai";

interface iCreateFolderProps {
  userId: string;
  projectName: string;
  projectId: string;
}
const CreateFolder = ({
  userId,
  projectName,
  projectId,
}: iCreateFolderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [createFolderState, setcreateFolderState] = useAtom(createFolderAtom);
  const { toast } = useToast();

  const folderSchema = z.object({
    folderName: z.string().min(1),
  });
  const form = useForm<z.infer<typeof folderSchema>>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      folderName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof folderSchema>) {
    try {
      setisLoading(true);
      const responsePostData = {
        userId,
        projectName,
        projectId,
        defaultBoolean: false,
        folderPath: values.folderName,
      };
      const response = await axios.post(
        "/api/createS3Folder",
        responsePostData
      );
      const data = await response.data;
      setcreateFolderState(!createFolderState);
      toast({
        title: "Folder created",
        description: data?.message,
      });
      return;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Folder creation failed",
        description: axiosError?.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
      return;
    } finally {
      setisLoading(false);
      setIsOpen(false);
      return;
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          className="h-11 rounded-md px-8 inline-flex items-center justify-center whitespace-nowrap  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white"
          onClick={() => setIsOpen(true)}
        >
          Create New Folder
        </DialogTrigger>
        <DialogContent className="bg-black text-white">
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="folderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder Name</FormLabel>
                    <FormControl className="text-black">
                      <Input placeholder="Enter folder name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateFolder;
