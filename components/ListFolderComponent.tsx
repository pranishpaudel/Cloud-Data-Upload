"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import {
  isOpenFolderButtonClickedAtom,
  openFolderInfo,
  createFolderAtom,
  updateShowFolderState,
} from "@/helpers/state";
import { useAtom } from "jotai";
import DeleteObject from "./deleteObjectComponent";

interface iListProps {
  userId: string;
  projectName: string;
  projectId: string;
}

interface Folder {
  name: string;
  sharedUsers: string;
  objectSize: string;
  lastModified: string;
}

const ListFolderComponent = ({
  userId,
  projectName,
  projectId,
}: iListProps) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [openButtonClicked, setopenButtonClicked] = useAtom(
    isOpenFolderButtonClickedAtom
  );
  const [showFolder, setShowFolder] = useAtom(updateShowFolderState);
  const [createFolderState, setcreateFolderState] = useAtom(createFolderAtom);
  const [iopenFolderInfo, setiopenFolderInfo] = useAtom(openFolderInfo);
  const handleOpen = (folderName: string) => {
    setiopenFolderInfo({ projectId, projectName, folderName });
    setopenButtonClicked(true);
    return;
  };
  useEffect(() => {
    const listObjects = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/listS3Objects", {
          userId,
          objectType: "folder",
        });
        const data = await response.data.message;
        const folderMap = new Map();

        data.forEach((item: any) => {
          const parts = item.Key.split("/");
          const projectFolderName = parts[1];
          const folderName = parts[2];

          if (projectFolderName === projectName) {
            if (!folderMap.has(folderName)) {
              folderMap.set(folderName, {
                name: folderName,
                sharedUsers: "user1, user2",
                objectSize: 0,
                lastModified: item.LastModified,
              });
            }

            const currentFolder = folderMap.get(folderName);
            currentFolder.objectSize += item.Size;

            if (
              new Date(item.LastModified) > new Date(currentFolder.lastModified)
            ) {
              currentFolder.lastModified = item.LastModified;
            }
          }
        });

        const transformedData = Array.from(folderMap.values()).map(
          (folder) => ({
            ...folder,
            objectSize: `${(folder.objectSize / (1024 * 1024)).toFixed(2)} MB`,
            lastModified: new Date(folder.lastModified).toLocaleDateString(),
          })
        );

        setFolders(transformedData as any);
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setLoading(false);
      }
    };
    listObjects();
  }, [userId, projectName, createFolderState, showFolder]);

  return (
    <div className="w-full overflow-y-auto max-h-[300px]">
      <table className="min-w-full bg-gray-100 border border-gray-200 sticky top-0">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Shared Users</th>
            <th className="py-2 px-4 text-left">Folder Size</th>
            <th className="py-2 px-4 text-left">Last Modified</th>
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </td>
              </tr>
            ))
          ) : folders.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                No folders listing found
              </td>
            </tr>
          ) : (
            folders.map((obj, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{obj.name}</td>
                <td className="py-2 px-4">{obj.sharedUsers}</td>
                <td className="py-2 px-4">{obj.objectSize}</td>
                <td className="py-2 px-4">{obj.lastModified}</td>
                <td className="py-2 px-4">
                  <div className="flex justify-start gap-2">
                    <Button
                      className=" hover:scale-105 transition-transform duration-200"
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpen(obj.name)}
                    >
                      Open
                    </Button>
                    <DeleteObject
                      objectName={obj.name}
                      deleteObjectType="Folder"
                      projectIdFromFolder={projectId}
                      projectNameFromFolder={projectName}
                    />
                  </div>
                </td>
                <td className="py-2 px-4">
                  <Button
                    className=" hover:scale-105 transition-transform duration-200"
                    size="sm"
                    variant="outline"
                  >
                    Share
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListFolderComponent;
