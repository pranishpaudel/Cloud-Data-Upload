import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DownloadAndOpenComponent from "./DownloadAndOpenComponent";
import { useSession } from "next-auth/react";
import { openFolderInfo, updateShowFileState } from "@/helpers/state";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";

interface iListProps {
  files: any[];
  folderName: string;
}

interface iFileDeleteProps {
  userId: string;
  projectName: string;
  projectId: string;
  folderName: string;
  fileName: string;
  deleteObjectType: string;
}

const ListFileComponent = ({ files, folderName }: iListProps) => {
  const { data: session } = useSession();
  const userId = session?.user.id as string;
  const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
  const [iopenFolderInfo] = useAtom(openFolderInfo);
  const [loadingFileKey, setLoadingFileKey] = useState<string | null>(null);
  const [showFile, setShowFile] = useAtom(updateShowFileState);
  const { toast } = useToast();

  useEffect(() => {
    const filteredFiles = files.filter((file) => {
      const parts = file.Key.split("/");
      const fileFolderName = parts[parts.length - 2];
      return fileFolderName === folderName;
    });
    setFilteredFiles(filteredFiles);
  }, [showFile, files, folderName]);

  const handleDeleteFile = async ({
    userId,
    projectId,
    projectName,
    folderName,
    fileName,
    deleteObjectType,
  }: iFileDeleteProps) => {
    const fileKey = `${projectName}/${folderName}/${fileName}`;
    try {
      setLoadingFileKey(fileKey);
      const response = await axios.post("/api/deleteS3Object", {
        userId,
        projectName,
        projectId,
        folderName,
        fileName,
        deleteObjectType,
      });
      const data = response.data;
      if (data.success) {
        setShowFile(!showFile);
        toast({
          title: `${fileName} deleted successfully`,
          description: data?.message,
        });
      }
    } catch (error: any) {
      toast({
        title: `Delete action failed`,
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoadingFileKey(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredFiles.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-2xl">
          No files found in the specified folder.
        </div>
      ) : (
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Folder</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file, index) => {
                  const parts = file.Key.split("/");
                  const fileName = parts[parts.length - 1];
                  const fileFolderName = parts[parts.length - 2];
                  const projectName = parts[parts.length - 3];
                  const objectSize = file.Size;
                  const newObjectSize = `${(objectSize / (1024 * 1024)).toFixed(
                    2
                  )} MB`;
                  const fileKey = `${projectName}/${fileFolderName}/${fileName}`;

                  return (
                    <TableRow key={index}>
                      <TableCell>{projectName}</TableCell>
                      <TableCell>{fileFolderName}</TableCell>
                      <TableCell>
                        <Link href="#" className="font-medium" prefetch={false}>
                          {fileName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {new Date(file.LastModified).toLocaleString()}
                      </TableCell>
                      <TableCell>{newObjectSize}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <DownloadAndOpenComponent
                            userId={userId}
                            projectName={projectName}
                            folderName={fileFolderName}
                            fileName={fileName}
                            type="Open"
                          />
                          <DownloadAndOpenComponent
                            userId={userId}
                            projectName={projectName}
                            folderName={fileFolderName}
                            fileName={fileName}
                            type="Download"
                          />
                          <Button
                            onClick={() =>
                              handleDeleteFile({
                                userId: session?.user.id as string,
                                projectName,
                                projectId: iopenFolderInfo.projectId,
                                folderName: fileFolderName,
                                fileName,
                                deleteObjectType: "File",
                              })
                            }
                            variant="outline"
                            size="sm"
                            color="red"
                          >
                            {loadingFileKey === fileKey ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <TrashIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListFileComponent;

interface TrashIconProps extends React.SVGProps<SVGSVGElement> {}

const TrashIcon: React.FC<TrashIconProps> = (props) => {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
};
