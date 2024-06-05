import React from "react";
import { auth } from "@/auth";
import GetSession from "@/components/getSession";
import { getUserProjects } from "@/lib/getUserProjects";
import CreateProject from "@/components/CreateProject";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ShowProjectsComponent from "@/components/showProjectsComponent";
interface User {
  id: string;
  isVerified: boolean;
  isAdmin: boolean;
  email: string;
  name: string;
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

const Dashboard = async () => {
  const authy = await auth();
  const projects = await getUserProjects({ email: authy?.user?.email });

  return (
    <React.Fragment>
      <GetSession />
      <header className="bg-gray-100 dark:bg-gray-800 px-4 py-6 md:px-6 md:py-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {authy?.user?.name}!
            </h1>
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                placeholder="Search your projects..."
                className="pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div>
            <CreateProject />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {projects.length === 0 ? "No projects to show yet" : "Your Projects"}
        </h2>
        {projects.length > 0 && (
          <div
            id="projects"
            className="w-full flex justify-center items-center bg-white dark:bg-gray-700 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4"
          >
            <ShowProjectsComponent projects={projects} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
