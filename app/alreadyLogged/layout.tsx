import NavBar from "@/components/NavBar/NavBar";
import { ReactNode } from "react";

const authLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

export default authLayout;
