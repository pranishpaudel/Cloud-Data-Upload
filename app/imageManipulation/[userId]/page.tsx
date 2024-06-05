"use client";

import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Camera } from "lucide-react";
import FormData from "form-data";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import MicIcon from "@/components/imageManipulationComponent/MicIcon";
import { UserStats } from "@/components/imageManipulationComponent/UserStats";
import { snapShotDataAtom, reactFormDataAtom } from "@/helpers/state";
import { useAtom } from "jotai";
import UserEmotions from "@/components/imageManipulationComponent/UserEmotions";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: any }) => {
  const { data: session, status } = useSession();
  const userId = session?.user.id;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reactFormDataState, setReactFormDataState] =
    useAtom(reactFormDataAtom);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userSnapShotData, setUserSnapShotData] = useAtom(snapShotDataAtom);
  const [croppedFaceImage, setCroppedFaceImage] = useState("");
  const [isEmotionShown, setIsEmotionShown] = useState(false);
  const [switchEnabled, setSwitchEnabled] = useState(false);

  const router = useRouter();
  console.log(userId);

  const handleToggleSwitch = () => {
    setIsEmotionShown(!isEmotionShown);
  };

  const handleSelection = (value) => {
    setSelectedItem(value);
  };

  const handleExecutor = () => {
    console.log("ma execute vyae hai");
    console.log("Selected Item", selectedItem);
    if (selectedItem === "image-generator") {
      router.push("/ImageGeneration");
    } else {
      router.push(`/imageMixActions/${selectedItem}`);
    }
  };
  if (isEmotionShown) {
    console.log("Emotion dekhauni rey");
  }
  const startCamera = async () => {
    setSwitchEnabled(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    }
  };

  const takePhoto = async () => {
    setSwitchEnabled(false);
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas elements are not available.");
      return;
    }

    const context = canvasRef.current.getContext("2d");
    if (!context) {
      console.error("Unable to get canvas context.");
      return;
    }

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0);

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        console.error("Failed to convert canvas to blob.");
        return;
      }

      const file = new File([blob], "snapshot.png", {
        type: "image/png",
      });
      setReactFormDataState(file);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/handleSnapshots", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        setUserSnapShotData(data[0]);
        const response1 = await fetch("/api/croppedFace", {
          method: "POST",
          body: formData,
        });
        const data1 = await response1.json();
        console.log(data1[0].url);
        setCroppedFaceImage(data1[0].url);
        setSwitchEnabled(true);
      } catch (error) {
        console.error("Failed to upload photo:", error);
        setSwitchEnabled(false);
      }
    });

    canvasRef.current.classList.add("snapshot-effect");
    setTimeout(() => {
      canvasRef.current.classList.remove("snapshot-effect");
      canvasRef.current.style.display = "none";
    }, 300);
  };
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 px-6 md:px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Enter your prompt"
                className="flex-1 px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
              />
              <Button
                variant="ghost"
                size="icon"
                className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
              >
                <MicIcon className="h-6 w-6" />
                <span className="sr-only">Voice input</span>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Select onValueChange={setSelectedItem}>
                <SelectTrigger className="flex-1 px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white">
                  <SelectValue placeholder="Select AI tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image-generator">
                    AI Image Generator
                  </SelectItem>
                  <SelectItem value="image-editor">AI Image Editor</SelectItem>
                  <SelectItem value="colorizer">AI Image Colorizer</SelectItem>
                  <SelectItem value="background-remover">
                    AI Background Remover
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="px-6 py-3 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors hover:brightness-50"
                onClick={handleExecutor}
              >
                Execute Selector
              </Button>
            </div>
            {isEmotionShown ? (
              <div>
                <UserEmotions userImage={croppedFaceImage} />
              </div>
            ) : (
              <>
                <div id="userstats" className="relative top-10">
                  <UserStats />
                </div>
              </>
            )}
            {switchEnabled ? (
              <>
                {" "}
                <div className="flex items-center justify-center relative top-5">
                  <Switch
                    id="show-emotion"
                    onCheckedChange={handleToggleSwitch}
                    defaultChecked={isEmotionShown}
                  />
                  <Label htmlFor="show-emotion">Show emotion</Label>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden w-[800px] h-[600px]">
            <video
              ref={videoRef}
              width={800}
              height={600}
              className="w-full h-auto"
              autoPlay
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ display: "none" }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              {isCameraOn ? (
                <Button
                  onClick={stopCamera}
                  className="p-3 rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors"
                >
                  <VideoOff className="h-6 w-6" />
                </Button>
              ) : (
                <Button
                  onClick={startCamera}
                  className="p-3 rounded-full bg-green-600 text-white hover:bg-green-500 transition-colors"
                >
                  <Video className="h-6 w-6" />
                </Button>
              )}
              <Button
                onClick={() => {
                  takePhoto();
                  if (canvasRef.current)
                    canvasRef.current.style.display = "block";
                }}
                className="p-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              >
                <Camera />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-4 px-6 md:px-8">
        <div className="container mx-auto text-center text-sm">
          &copy; 2024 Pshow. All rights reserved.
        </div>
      </footer>
      <style jsx>{`
        .snapshot-effect {
          animation: snapshot 0.2s ease-in-out;
        }

        @keyframes snapshot {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
