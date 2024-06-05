import { auth } from "@/auth";
import prisma from "@/lib/db/db.config";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const { projectId, userId } = await reqBody;
  const authUser = await auth();
  if (!authUser) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }
  const tempUser = authUser.user.id;

  if (tempUser != userId) {
    return NextResponse.json(
      { message: "User not authorized" },
      { status: 401 }
    );
  }
  const projectByUserId = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });
  if (!projectByUserId) {
    return NextResponse.json(
      { message: "User not authorized for this project" },
      { status: 404 }
    );
  }
  return NextResponse.json({ message: projectByUserId }, { status: 200 });
}
