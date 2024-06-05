"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import CameraComponent from "@/components/CameraComponent";
import { Loader2 } from "lucide-react";
import {
  imageToRenderInMixAtom,
  skeltonPhotoDimensions,
  imageMixLoaderAtom,
} from "@/helpers/state";
import { useAtom } from "jotai";
import { Skeleton } from "@/components/ui/skeleton";

interface PageParams {
  apiType: string;
}

export default function Page({ params }: { params: PageParams }) {
  const [textContent, setTextContent] = useState<string>("");
  const [clientImageUrl, setClientImageUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useAtom(skeltonPhotoDimensions);
  const [imageToRender, setImagetoRender] = useAtom(imageToRenderInMixAtom);
  const [loader, setLoader] = useAtom(imageMixLoaderAtom);
  const [loaderForFormdata, setLoaderForFormdata] = useState<boolean>(false);
  const apiType = params.apiType;

  const generateButtonHandler = async () => {
    try {
      setLoader(true);

      const res = await axios.post("/api/handleImageMixByUrl", {
        textPrompt: textContent,
        clientImageUrl,
        apiType,
      });
      const data = res.data;
      setImagetoRender(data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoader(false);
    }
  };

  const generateButtonHandlerByFormData = async () => {
    setLoaderForFormdata(true);
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    if (textContent) {
      formData.append("textPrompt", textContent);
    }
    formData.append("apiType", apiType);

    try {
      const response = await fetch("/api/handleImageMixByFormData", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setImagetoRender(result.imageUrl);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoaderForFormdata(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setClientImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div className="relative flex justify-center items-center overflow-hidden mx-auto">
          {loader || loaderForFormdata ? (
            <>
              <div className="flex items-center space-x-4 ">
                <Skeleton className={`h-[512px] w-[512px] bg-slate-600 `} />
              </div>
            </>
          ) : (
            <>
              {" "}
              <Image
                src={imageToRender}
                alt="Example Image"
                width={512}
                height={512}
                className="object-cover rounded-lg shadow-lg"
              />
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 grid gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Generate Image</h2>
            <p className="text-gray-500 mb-4">
              Enter an image URL or upload an image to generate the
              AI-equivalent.
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter image URL"
                className="flex-1"
                onChange={(e) => setClientImageUrl(e.target.value)}
              />
              <Button onClick={generateButtonHandler}>
                {loader ? <Loader2 className="animate-spin" /> : <>Generate</>}
              </Button>
            </div>
          </div>
          {apiType === "image-editor" && (
            <div>
              <h2 className="text-xl font-bold mb-2">Text Prompt</h2>
              <Textarea
                id="text-prompt"
                rows={3}
                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a text prompt..."
                onChange={(e) => setTextContent(e.target.value)}
              />
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold mb-2">Upload Image</h2>
            <p className="text-gray-500 mb-4">
              Upload an image from your device to generate the AI-equivalent.
            </p>
            <div className="flex gap-2">
              <Input type="file" onChange={handleFileChange} />
              <Button onClick={generateButtonHandlerByFormData}>
                {" "}
                {loaderForFormdata ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>Upload</>
                )}
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Capture Image</h2>
            <p className="text-gray-500 mb-4">
              Use your camera to capture an image and generate the
              AI-equivalent.
            </p>
            <div className="mt-4 aspect-video bg-gray-200 rounded-lg">
              <CameraComponent
                textPrompt={
                  apiType === "image-editor" ? textContent : undefined
                }
                apiType={apiType}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
