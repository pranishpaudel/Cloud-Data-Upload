import prisma from "./db/db.config";

interface igetUserProjects {
  email: string;
}

export const getUserProjects = async ({ email }: igetUserProjects) => {
  const userProjects = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      project: true,
    },
  });

  return userProjects?.project || [];
};
