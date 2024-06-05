"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import VoiceRecorder from "./RecordingComponent";
import { useEffect, useState } from "react";
import { useSpeechRecognition } from "react-speech-recognition";
import { RotateCcw } from "lucide-react";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";

export default function Component() {
  const [isMounted, setIsMounted] = useState(false);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [textInput, setTextInput] = useState();
  const [imagePath, setImagePath] = useState();
  const [generatingImage, setGeneratingImage] = useState(false);
  useEffect(() => {
    setImagePath("");
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (listening) {
      setTextInput(transcript);
    }
  }, [transcript, listening]);

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    try {
      const response = await axios.post("/api/generateImage", {
        textPrompt: textInput,
      });
      const data = await response.data;
      setImagePath(data.imageUrl);
    } catch (error) {
      console.log(error);
      setImagePath("/defaultImage/default.jpeg" as any);
    } finally {
      setGeneratingImage(false);
    }
  };

  function GeneratingImagePlaceholder() {
    return (
      <div className="h-[512px] w-[512px] bg-gray-200 flex justify-center items-center relative overflow-hidden">
        <Skeleton className="h-[512px] w-[512px] bg-slate-600 absolute inset-0 animate-pulse" />

        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50 animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-12 px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Generate AI Images</h2>
          {isMounted ? (
            <p className="text-gray-600 text-lg">
              Enter a text prompt or use your voice to generate unique
              AI-powered images.
            </p>
          ) : null}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="text-prompt"
                className="block text-gray-700 font-medium mb-2"
              >
                Text Prompt
              </label>
              <Textarea
                id="text-prompt"
                rows={3}
                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a text prompt..."
                onChange={(e: any) => {
                  setTextInput(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Voice Prompt
              </label>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {isMounted ? (
                    <>
                      <VoiceRecorder />
                    </>
                  ) : (
                    <></>
                  )}
                </Button>

                <Textarea
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Speak to generate an image..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />

                <span className="relative w-[50px] flex justify-start items-start top-[-42px] text-gray-500 hover:text-gray-700 left-[15px]">
                  <RotateCcw onClick={resetTranscript} />
                </span>
              </div>
            </div>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md"
              onClick={handleGenerateImage}
            >
              {generatingImage ? "Generating" : "Generate Image"}
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-[512px] w-[512px] bg-gray-200 flex justify-center items-center">
              {generatingImage ? (
                <>
                  {" "}
                  <GeneratingImagePlaceholder />
                </>
              ) : (
                <>
                  <Image
                    src={imagePath || "/defaultImage/default.jpeg"}
                    alt="Example Image"
                    width={512}
                    height={512}
                    className="object-cover object-center"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Generated Image</h3>
              <p className="text-gray-600 text-lg">
                Your AI-generated image will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-6 px-6 md:px-10">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">&copy; 2024 Pshow. All rights reserved.</p>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-gray-400">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-400">
              Terms
            </a>
            <a href="#" className="hover:text-gray-400">
              Support
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ImageIcon(props) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MicIcon(props) {
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
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}
