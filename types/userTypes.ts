import "next-auth";

declare module "next-auth" {
  interface User {
    userid: string;
    isVerified: boolean;
    isAdmin: boolean;
    projects: string[];
  }
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
      isAdmin: boolean;
      projects: string[];
      name: string;
      email: string | undefined;
    };
  }
}
