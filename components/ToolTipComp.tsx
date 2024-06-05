import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface IToolTipInfo {
  toolTipInfo: string;
}

const ToolTipComp = ({ toolTipInfo }: IToolTipInfo) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info size={18} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{toolTipInfo}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default ToolTipComp;
