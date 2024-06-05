"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DeleteProject from "./deleteObjectComponent";
import {
  updateShowProjectState,
  createFolderAtom,
  isOpenFolderButtonClickedAtom,
  openFolderInfo,
} from "@/helpers/state";

interface iShowProjectsComponentProps {
  projects: { id: string; name: string; updatedAt: string }[];
}

const ShowProjectsComponent: React.FC<iShowProjectsComponentProps> = ({
  projects,
}) => {
  const router = useRouter();
  const [showProject, setShowProject] = useAtom(updateShowProjectState);
  const [createFolderState, setcreateFolderState] = useAtom(createFolderAtom);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [openButtonofListFolderClicked, setopenButtonofListFolderClicked] =
    useAtom(isOpenFolderButtonClickedAtom);
  const [iopenFolderInfo, setiopenFolderInfo] = useAtom(openFolderInfo);
  const [isOverflow, setIsOverflow] = useState(false);

  const handleOpenButtonClick = (projectId: string) => {
    setopenButtonofListFolderClicked(false);
    setiopenFolderInfo({ projectId: "", projectName: "", folderName: "" });
    setLoadingProjectId(projectId);
    router.push(`/projectDashboard/${projectId}`);
  };

  const refreshRouter = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    refreshRouter();
  }, [refreshRouter, showProject, createFolderState]);

  const toggleOverflow = () => {
    setIsOverflow(!isOverflow);
  };

  return (
    <div className="w-full max-w-[80vw] rounded-lg">
      <Button
        className="mb-2"
        size="sm"
        variant="outline"
        onClick={toggleOverflow}
      >
        {isOverflow ? "Show Less" : "Show More"}
      </Button>
      <div
        className={`${
          isOverflow ? "max-h-[400px] overflow-y-auto" : ""
        } transition-all duration-300`}
      >
        <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                Project
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                Last Updated
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors duration-300"
              >
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">
                  {project.name}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-400">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      className="hover:scale-105 transition-transform duration-200"
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenButtonClick(project.id)}
                    >
                      {loadingProjectId === project.id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <span>Open</span>
                      )}
                    </Button>
                    <DeleteProject
                      objectId={project.id}
                      objectName={project.name}
                      deleteObjectType="Project"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowProjectsComponent;
