"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CustomType from "@/components/TypeComp/TypeComp";
const props = [
  {
    id: 1,
    name: "Clean UI",
  },
  {
    id: 2,
    name: "Lighting Response",
  },
  {
    id: 3,
    name: "Feels like AI",
  },
];

const HomeDetails = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  return (
    <>
      <main className="w-full">
        <div className="flex justify-center items-center">
          {" "}
          {mounted && <CustomType />}{" "}
        </div>
        <div className="flex justify-center items-center text-gray-600 text-[20px] font-semibold">
          A diverse set of tools to help you get taste of AWS and AI
        </div>
        <div className="flex justify-evenly text-[25px] font-extrabold relative top-10">
          {props.map((item) => (
            <span
              key={item?.id}
              className="border-1 shadow-lg p-[15px] rounded-full"
            >
              {item.name}
            </span>
          ))}
        </div>
      </main>
    </>
  );
};

export default HomeDetails;
