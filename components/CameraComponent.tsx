import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Camera } from "lucide-react";
import {
  imageToRenderInMixAtom,
  skeltonPhotoDimensions,
  imageMixLoaderAtom,
} from "@/helpers/state";
import { useAtom } from "jotai";
interface ICameraProps {
  textPrompt?: string;
  apiType: string;
}

const CameraComponent = ({ textPrompt, apiType }: ICameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [loader, setLoader] = useAtom(imageMixLoaderAtom);
  const [imageDimensions, setImageDimensions] = useAtom(skeltonPhotoDimensions);
  const [imageToRender, setImagetoRender] = useAtom(imageToRenderInMixAtom);

  const startCamera = async () => {
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
    setLoader(true);
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas elements are not available.");
      return;
    }

    const context = canvasRef.current.getContext("2d");
    if (!context) {
      console.error("Unable to get canvas context.");
      return;
    }
    setImageDimensions({
      width: String(videoRef.current.videoWidth),
      height: String(videoRef.current.videoHeight),
    });
    console.log(imageDimensions);
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

      console.log(file);
      try {
        const formData = new FormData();
        formData.append("image", file);
        if (textPrompt) {
          formData.append("textPrompt", textPrompt);
        }
        formData.append("apiType", apiType);

        const response = await fetch("/api/handleImageMixByFormData", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setImagetoRender(data.imageUrl);
      } catch (error) {
        console.error("Failed to upload photo:", error);
      } finally {
        setLoader(false);
      }
    });

    canvasRef.current.classList.add("snapshot-effect");
    setTimeout(() => {
      canvasRef.current.classList.remove("snapshot-effect");
      canvasRef.current.style.display = "none";
    }, 300);
  };

  return (
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
            if (canvasRef.current) canvasRef.current.style.display = "block";
          }}
          className="p-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
        >
          <Camera />
        </Button>
      </div>
    </div>
  );
};

export default CameraComponent;
