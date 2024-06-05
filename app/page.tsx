import NavBar from "@/components/NavBar/NavBar";

import HomeDetails from "@/components/HomeDetails";
import { Separator } from "@/components/ui/separator";
import ProjectSuggestor from "@/components/SuggestAi";

export default function Home() {
  return (
    <>
      <div
        id="NavBar"
        className="bg-slate-200 m-1 border-1 rounded-full shadow-2xl shadow-gray-600 "
      >
        <NavBar />
      </div>

      <div id="typewriter" className="absolute top-[25%] left-[25%]">
  
        <HomeDetails />
      </div>
    </>
  );
}
