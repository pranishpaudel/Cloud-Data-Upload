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
import { Input } from "@/components/ui/input"; // Make sure this component exists in your project
import { Button } from "@/components/ui/button"; // Make sure this component exists in your project
import { Loader2, Copy, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateShowProjectState, updateShowFolderState } from "@/helpers/state";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";

interface iDeleteObjectProps {
  objectId?: string;
  objectName: string;
  deleteObjectType: string;
  projectIdFromFolder?: string;
  projectNameFromFolder?: string;
}

const DeleteObject = ({
  objectId,
  objectName,
  deleteObjectType,
  projectIdFromFolder,
  projectNameFromFolder,
}: iDeleteObjectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [textCopied, settextCopied] = useState(false);
  const [showProject, setShowProject] = useAtom(updateShowProjectState);
  const [showFolder, setShowFolder] = useAtom(updateShowFolderState);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const userId = session?.user.id;
  const deletionSchema = z.object({
    confirmDeletionString: z.string().min(1),
  });
  const form = useForm<z.infer<typeof deletionSchema>>({
    resolver: zodResolver(deletionSchema),
    defaultValues: {
      confirmDeletionString: "",
    },
  });

  async function onSubmit(values: z.infer<typeof deletionSchema>) {
    try {
      setisLoading(true);
      const deletionString = values.confirmDeletionString;
      if (deleteObjectType === "Project") {
        var response = await axios.post("/api/deleteS3Object", {
          userId,
          projectName: objectName,
          projectId: objectId,
          confirmDeletionString: values.confirmDeletionString,
          deleteObjectType: "Project",
        });
      } else if (deleteObjectType === "Folder") {
        var response = await axios.post("/api/deleteS3Object", {
          userId,
          projectId: projectIdFromFolder,
          projectName: projectNameFromFolder,
          folderName: objectName,
          confirmDeletionString: values.confirmDeletionString,
          deleteObjectType: "Folder",
        });
      }
      const data = await response.data;
      toast({
        title: `${deleteObjectType} and its data deleted successfully`,
        description: data?.message,
      });

      return;
    } catch (error) {
      toast({
        title: `${deleteObjectType} deletion failed`,
        description: error?.response.data.message,
        variant: "destructive",
      });
      return;
    } finally {
      setisLoading(false);
      setIsOpen(false);
      if (deleteObjectType === "Project") {
        setShowProject(!showProject);
      } else {
        setShowFolder(!showFolder);
      }
      return;
    } // Close the dialog after submission
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          className="mr-4 h-10 px-4 py-2 bg-white border text-red-600 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-red-600 hover:text-white hover:border hover:border-black"
          onClick={() => setIsOpen(true)}
        >
          Delete
        </DialogTrigger>
        <DialogContent className="bg-black text-white">
          <DialogHeader>
            <DialogTitle>Delete {deleteObjectType}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="confirmDeletionString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex">
                      Confirm Deletion? Enter:{" "}
                      <div className="flex justify-start">
                        <span className="bg-slate-200 text-black p-[4px] rounded-md text-md border-[0.1px] ml-[5px] mb-[5px]">
                          <span
                            id="updateOnCopy"
                            className={textCopied ? "bg-blue-200" : ""}
                          >
                            {objectName}
                          </span>
                        </span>
                        {textCopied ? (
                          <>
                            <Check
                              onClick={() => {
                                settextCopied(true);
                                navigator.clipboard.writeText(objectName);
                                setTimeout(() => settextCopied(false), 3000);
                              }}
                              className="text-white h-[20px] w-[20px] hover:brightness-50 ml-2"
                            />
                          </>
                        ) : (
                          <>
                            <Copy
                              onClick={() => {
                                settextCopied(true);
                                navigator.clipboard.writeText(objectName);
                                setTimeout(() => settextCopied(false), 3000);
                              }}
                              className="text-white h-[20px] w-[20px] hover:brightness-50 ml-2"
                            />
                          </>
                        )}
                      </div>
                    </FormLabel>
                    <FormControl className="text-black">
                      <Input
                        placeholder={`Please enter ${objectName} to confirm deletion`}
                        {...field}
                        className="mt-[10px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className=" hover:scale-105 transition-transform duration-200 hover:bg-red-400 text-red-600"
                size="sm"
                variant="outline"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteObject;
