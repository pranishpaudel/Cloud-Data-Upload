import { auth } from "@/auth";
import prisma from "@/lib/db/db.config";
import projectSchema from "@/schema/ProjectSchema";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const { fileName, folderName, projectId, userId, fileSize } = await reqBody;
  const isUserAuthenticated = await auth();
  if (!isUserAuthenticated) {
    return NextResponse.json(
      { message: "User is not authenticated", success: false },
      { status: 400 }
    );
  }

  const folderToStoreFileIn = await prisma.folder.findFirst({
    where: {
      name: folderName,
      projectId,
    },
  });
  if (!folderToStoreFileIn) {
    return NextResponse.json(
      { message: "Folder does not exist to upload file", success: false },
      { status: 400 }
    );
  }

  const folderId = folderToStoreFileIn.id;
  const createFile = await prisma.file.create({
    data: {
      name: fileName,
      folderId,
      userId,
    },
  });

  if (!createFile) {
    return NextResponse.json(
      { message: "Failed to create file", success: false },
      { status: 400 }
    );
  }
  return NextResponse.json({
    message: "File created successfully",
    success: true,
  });
}
