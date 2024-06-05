"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { uploadAtom } from "@/helpers/state";
import { useSession } from "next-auth/react";

interface iUploadProps {
  folder: string;
  project: string;
  projectId: string;
}

function UploadComponent({ folder, project, projectId }: iUploadProps) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [uploadState, setuploadState] = useAtom(uploadAtom);
  const { data: session } = useSession();
  const userId = session?.user.id;

  const getFileExtension = (fileName: string) => {
    if (!fileName) return "";
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop() : "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const API_ENDPOINT = `http://localhost:3000/api/getSignedUrlForUpload?fileType=${getFileExtension(
    file?.name
  )}&folder=${folder}&project=${project}&fileName=${file?.name}`;

  const getPresignedUrl = async () => {
    const response = await axios.get(API_ENDPOINT);
    return response.data.message;
  };

  const uploadToPresignedUrl = async (presignedUrl) => {
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": "application/pdf",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      },
    });
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error("No file selected.");
        return;
      }
      const presignedUrl = await getPresignedUrl();
      await uploadToPresignedUrl(presignedUrl);
      setUploaded(true);
      setuploadState(!uploadState);
      const res = await axios.post("/api/createFile", {
        fileName: file.name,
        folderName: folder,
        projectId,
        userId,
      });
      console.log("File created successfully", res.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  useEffect(() => {
    if (uploaded) {
      const timer = setTimeout(() => {
        setUploaded(false);
        setFile(null);
        setProgress(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploaded]);

  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-white dark:bg-white">
      {!uploaded ? (
        <div
          className="flex flex-col items-center justify-center w-[400px] h-[300px] p-8 bg-white rounded-lg shadow-lg dark:bg-gray-900 dark:text-gray-200 dark:shadow-none"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <CloudUploadIcon className="w-12 h-12 mb-4 text-gray-500 dark:text-gray-400" />
          <p className="mb-4 text-lg font-medium">
            Drag and drop your file here
          </p>
          <p className="mb-8 text-gray-500 dark:text-gray-400">or</p>
          <label
            htmlFor="file-input"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-300"
          >
            Choose a file
            <input
              id="file-input"
              type="file"
              className="sr-only"
              onChange={handleFileSelect}
            />
          </label>
          {file && (
            <div className="w-full mt-8">
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className="h-full bg-gray-900 rounded-full dark:bg-gray-50"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Uploading {file.name} - {progress}%
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-[400px] h-[300px] p-8 bg-white rounded-lg shadow-lg dark:bg-gray-900 dark:text-gray-200 dark:shadow-none">
          <CircleCheckIcon className="w-12 h-12 mb-4 text-green-500" />
          <p className="mb-2 text-lg font-medium">Upload successful!</p>
          <p className="text-gray-500 dark:text-gray-400">
            Your file has been uploaded.
          </p>
        </div>
      )}
    </div>
  );
}

function CircleCheckIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CloudUploadIcon(props) {
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
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

export default UploadComponent;
