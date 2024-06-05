import { snapShotDataAtom } from "@/helpers/state";
import { useAtom } from "jotai";
import { useEffect } from "react";
import ToolTipComp from "../ToolTipComp";
import { useToast } from "@/components/ui/use-toast";

interface UserSnapshotData {
  age_group?: string;
  age?: string;
  gender?: { value: string };
  expression?: { value: string; probability: number }[];
}

export const UserStats = (): JSX.Element => {
  const [userSnapShotData, setUserSnapShotData] =
    useAtom<UserSnapshotData>(snapShotDataAtom);
  const { toast } = useToast();

  useEffect(() => {
    if (!userSnapShotData) {
      toast({
        title: "Retry Facial Analysis",
        description: "Please retry",
        variant: "destructive",
      });
    }
  }, [userSnapShotData, toast]);

  const checkSmile = (): boolean => {
    return (
      userSnapShotData?.expression?.some((obj) => obj?.value === "Smile") ??
      false
    );
  };

  const checkEyeOpen = (): boolean => {
    return (
      userSnapShotData?.expression?.some((obj) => obj?.value === "EyesOpen") ??
      false
    );
  };

  const getProbability = (index: number): string => {
    return (
      userSnapShotData?.expression?.[index]?.probability.toString() || "Unknown"
    );
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="font-medium">Age Group</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {userSnapShotData?.age_group || "Unknown"}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="font-medium">Exact Age</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {userSnapShotData?.age || "Unknown"}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <SmileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="font-medium">Facial Expression</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          <span className="flex gap-1">
            {checkSmile() ? <>Smiling</> : <>Not smiling</>}
            <ToolTipComp toolTipInfo={"Probability: " + getProbability(0)} />
          </span>
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <EqualIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="font-medium">Gender</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {userSnapShotData?.gender?.value || "Unknown"}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="font-medium">Eyes</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          <span className="flex gap-1">
            {checkEyeOpen() ? <>Open</> : <>Closed</>}
            <ToolTipComp toolTipInfo={"Probability: " + getProbability(1)} />
          </span>
        </p>
      </div>
    </div>
  );
};

const CalendarDaysIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const EqualIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="5" x2="19" y1="9" y2="9" />
    <line x1="5" x2="19" y1="15" y2="15" />
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

const SmileIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
