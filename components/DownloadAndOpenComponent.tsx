import { useCallback } from "react";
import { Button } from "./ui/button";
import axios from "axios";

interface iDownloadProps {
  userId: string;
  projectName: string;
  folderName: string;
  fileName: string;
  type: string;
}

const DownloadAndOpenComponent = ({
  userId,
  projectName,
  folderName,
  fileName,
  type,
}: iDownloadProps) => {
  const downloadFile = useCallback(async () => {
    try {
      const response = await axios.post("/api/gets3Object", {
        userId,
        projectName,
        folderName,
        fileName,
        type,
      });
      const data = response.data.url;
      if (data) {
        window.open(data, "_blank");
      } else {
        console.error("URL not found in the response.");
      }
    } catch (error) {
      console.error("An error occurred while fetching the URL:", error);
    }
  }, [userId, projectName, folderName, fileName, type]);

  return (
    <Button variant="outline" size="sm" onClick={downloadFile}>
      {type === "Open" ? (
        <>
          {" "}
          <EyeIcon className="h-4 w-4" />
        </>
      ) : (
        <>
          {" "}
          <DownloadIcon className="h-4 w-4" />
        </>
      )}
      {type}
    </Button>
  );
};

interface IconProps extends React.SVGProps<SVGSVGElement> {}

function DownloadIcon(props: IconProps) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function EyeIcon(props: IconProps) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default DownloadAndOpenComponent;
