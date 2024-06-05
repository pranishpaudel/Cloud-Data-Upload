"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const GetSession = () => {
  const { data: session, status } = useSession();

  if (session) {
    return true;
  } else {
    return false;
  }
};
export default GetSession;
