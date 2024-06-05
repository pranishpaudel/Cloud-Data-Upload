import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { reactFormDataAtom } from "@/helpers/state";
import { useAtom } from "jotai";

interface iEmotionProps {
  userImage: string;
}

interface EmotionData {
  faces: {
    dominant_emotion: string;
    emotion: { [key: string]: number };
  }[];
}

export default function UserEmotions({ userImage }: iEmotionProps) {
  const [reactFormDataState, setReactFormDataState] =
    useAtom(reactFormDataAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/handleEmotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: userImage }),
      });
      const data: EmotionData = await response.json();

      setEmotionData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setIsLoading(false);
    }
  }, [userImage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dominantEmotion =
    emotionData?.faces?.[0]?.dominant_emotion || "No emotions detected";
  const emotions = emotionData?.faces?.[0]?.emotion || {};
  const roundedEmotions: [string, number][] = [];
  for (const [key, value] of Object.entries(emotions)) {
    const roundedValue = parseFloat(value.toFixed(3));
    roundedEmotions.push([key, roundedValue]);
  }

  function getEmotionIcon(emotionName: string) {
    switch (emotionName.toLowerCase()) {
      case "happy":
        return <SmileIcon className="w-6 h-6 text-primary" />;
      case "sad":
        return <FrownIcon className="w-6 h-6 text-red-500" />;
      case "angry":
        return <AngryIcon className="w-6 h-6 text-orange-500" />;
      case "fear":
        return <GhostIcon className="w-6 h-6 text-purple-500" />;
      case "disgust":
        return <DisgustIcon className="w-6 h-6 text-green-500" />;
      case "surprise":
        return <SurpriseIcon className="w-6 h-6 text-yellow-500" />;
      case "neutral":
        return <NeutralIcon className="w-6 h-6 text-gray-500" />;
      default:
        return null;
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="bg-gray-100 dark:bg-gray-800 p-6 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-gray-100 dark:bg-gray-800 p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <Image
                src={userImage}
                alt="User Avatar"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">User</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Emotion Analysis
              </p>
            </div>
          </div>
          <SmileIcon className="w-8 h-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-6 grid gap-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold">{dominantEmotion}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Dominant Emotion
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {roundedEmotions.map(([emotion, percentage], index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center">
                {getEmotionIcon(emotion)}
              </div>
              <p className="text-sm font-medium capitalize">{emotion}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {percentage.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
function SurpriseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  );
}

function DisgustIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 12c-1.5 0-2 2-4 2s-2.5-2-4-2" />
      <path d="M7 8v2" />
      <path d="M17 8v2" />
    </svg>
  );
}

function AngryIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <path d="M7.5 8 10 9" />
      <path d="m14 9 2.5-1" />
      <line x1="9" y1="10" x2="9.01" y2="10" />
      <line x1="15" y1="10" x2="15.01" y2="10" />
    </svg>
  );
}

function FrownIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

function NeutralIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="8" y1="15" x2="16" y2="15" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

function GhostIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
    </svg>
  );
}

function SmileIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}
