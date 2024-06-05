import Link from "next/link";
import { ImUpload } from "react-icons/im";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";
import { auth } from "@/auth";
import { SignOut } from "@/components/SignOut";
const NavBarItems = [
  {
    id: 1,
    name: "Dashboard",
    url: "dashboard",
    comment: "Redirects to UserDashboard",
  },
  {
    id: 2,
    name: "Image Manipulation",
    url: "imageManipulation/312312",
    comment: "Redirects to Image Manipulation",
  },
  {
    id: 3,
    name: "Register",
    url: "register",
    comment: "Register the User",
  },
  {
    id: 4,
    name: "Login",
    url: "login",
    comment: "Login the User",
  },
  {
    id: 5,
    name: "Logout",
    url: "logout",
    comment: "Logout the User",
  },
];

// export default function NavBar() {
//   return (
//     <header className="bg-gray-950 text-white px-4 py-3 flex justify-between rounded-md">

//     </header>
//   );
// }

async function Component() {
  const authy = await auth();
  const userName = authy?.user?.name || "";
  return (
    <div className="  px-4 py-3">
      <span>
        <ImUpload className=" h-[50px] w-[50px]  rounded-[50px] flex" />
      </span>

      <div className="flex justify-evenly">
        {NavBarItems.map((item) => (
          <div key={item?.id} className="hover:underline hover:text-[17px]">
            <Link
              className="font-semibold text-md absolute top-[30px]"
              href={`/${item.url}`}
            >
              {authy && item.name === "Logout" ? (
                <div>
                  <SignOut />
                </div>
              ) : authy &&
                (item.name === "Login" || item.name === "Register") ? null : (
                <>{item.id === 5 ? `${userName}` : item.name}</>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Component;
