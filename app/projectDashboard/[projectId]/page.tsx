"use client";

import ListFolderComponent from "@/components/ListFolderComponent";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  isOpenFolderButtonClickedAtom,
  openFolderInfo,
  uploadAtom,
  updateShowFileState,
} from "@/helpers/state";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import ListFileComponent from "@/components/ListFileComponent";
import UploadComponent from "@/components/UploadComponent";
import CreateFolder from "@/components/CreateFolder";
interface Project {
  id: string;
  name: string;
}
const Page = ({ params }: any) => {
  const projectId = params.projectId;
  const { data: session, status } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [fileListings, setfileListings] = useState([]);
  const [showFile, setShowFile] = useAtom(updateShowFileState);
  const [openButtonOfListFolderClicked, setopenButtonOfListFolderClicked] =
    useAtom(isOpenFolderButtonClickedAtom);
  const [iopenFolderInfo, setiopenFolderInfo] = useAtom(openFolderInfo);
  const [uploadState, setuploadState] = useAtom(uploadAtom);
  const [userAuthorized, setuserAuthorized] = useState(false);
  const router = useRouter();
  const userId = session?.user.id;
  const backButtonHandler = (typeOfBack: string) => {
    setopenButtonOfListFolderClicked(false);
    setiopenFolderInfo({
      projectId: "",
      projectName: "",
      folderName: "",
    });
  };

  const backButtonHandlerToDashboard = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    const checkAuthorityForProject = async () => {
      try {
        const response = await axios.post("/api/compareProjectIdWithUserId", {
          projectId,
          userId,
        });
        const data = await response.data.message;
        if (data) {
          setuserAuthorized(true);
          setProject(data);
        } else {
          setuserAuthorized(false);
          router.push("/dashboard");
        }
      } catch (error) {
        setuserAuthorized(false);
        router.push("/dashboard");
      }
    };

    checkAuthorityForProject();
  }, [projectId, userId, router]);
  useEffect(() => {
    const executeListObjectsFunction = async () => {
      if (openButtonOfListFolderClicked) {
        var response = await axios.post("/api/listS3Objects", {
          userId,
          objectType: "file",
        });
        var data = await response.data.message;
        setfileListings(data);
      }
      return;
    };
    executeListObjectsFunction();
  }, [
    openButtonOfListFolderClicked,
    setopenButtonOfListFolderClicked,
    iopenFolderInfo,
    showFile,
    userId,
    uploadState,
  ]);

  return (
    <div id="parent">
      <div className=" text-2xl font-semibold text-black flex justify-center underline-offset-2  ">
        {" "}
        Project:{" "}
        <span className="text-blue-900">
          {" "}
          {openButtonOfListFolderClicked ? (
            <>
              {project?.name}/{iopenFolderInfo.folderName}
            </>
          ) : (
            <>{project?.name}</>
          )}
        </span>
      </div>
      {openButtonOfListFolderClicked ? (
        <>
          <div
            id="back button"
            className="flex justify-start text-black relative left-[150px] "
          >
            <ArrowLeft
              onClick={backButtonHandler as any}
              className="h-[50px] w-[50px] hover:brighness-50 hover:text-blue-600"
            />
          </div>
        </>
      ) : (
        <>
          {" "}
          <div
            id="back button"
            className="flex justify-start text-black relative left-[150px] "
          >
            <ArrowLeft
              onClick={backButtonHandlerToDashboard}
              className="h-[50px] w-[50px] hover:brighness-50 hover:text-blue-600"
            />
          </div>
        </>
      )}

      <div className="flex justify-center items-center text-black text-lg font-bold mt-[50px]">
        {openButtonOfListFolderClicked ? (
          <>Listing files</>
        ) : (
          <>Listing folders</>
        )}
      </div>
      <div id="parentListingDiv">
        <div id="listObjects">
          {" "}
          {openButtonOfListFolderClicked ? (
            <>
              <ListFileComponent
                files={fileListings}
                folderName={iopenFolderInfo.folderName}
              />
            </>
          ) : (
            <div className="h-[350px] w-[80vw] flex justify-center items-center  bg-gray-100 overflow-y-auto border ml-[140px] rounded-md ">
              <ListFolderComponent
                userId={userId as string}
                projectName={project?.name as string}
                projectId={projectId}
              />
            </div>
          )}
        </div>
        {!openButtonOfListFolderClicked ? (
          <>
            <div className="flex justify-center items-center border-0 mt-1">
              <CreateFolder
                userId={userId as string}
                projectName={project?.name as string}
                projectId={projectId}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {openButtonOfListFolderClicked ? (
        <>
          {" "}
          <div id="upload" className="border-0 mt-3">
            <UploadComponent
              folder={iopenFolderInfo.folderName}
              project={iopenFolderInfo.projectName}
              projectId={projectId}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Page;
