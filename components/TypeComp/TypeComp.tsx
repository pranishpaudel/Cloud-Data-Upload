"use client";
import { TypewriterEffectSmooth } from "@/components/ui/TypeWriter";
import { GiEmptyMetalBucketHandle } from "react-icons/gi";
export default function CustomType() {
  const words = [
    {
      text: "A",
    },
    {
      text: `bucket 🪣`,
    },
    {
      text: "for",
    },
    {
      text: "your",
    },
    {
      text: "static",
    },
    {
      text: "assets",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center   ">
      <TypewriterEffectSmooth words={words} />
    </div>
  );
}
