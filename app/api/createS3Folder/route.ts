import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import prisma from "@/lib/db/db.config";
export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const isUserAuthenticated = await auth();
  const { userId, projectName, projectId, defaultBoolean, folderPath } =
    await reqBody;
  if (!isUserAuthenticated) {
    return NextResponse.json(
      { message: "User is not authenticated", success: false },
      { status: 400 }
    );
  }
  if (isUserAuthenticated.user.id !== userId) {
    return NextResponse.json(
      { message: "User is not authorized", success: false },
      { status: 401 }
    );
  }

  const projectToQuery = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!projectToQuery || projectToQuery.userId !== userId) {
    return NextResponse.json(
      {
        message:
          "project does not exist or user is not authorized to create S3 folder",
        success: false,
      },
      { status: 400 }
    );
  }
  if (defaultBoolean) {
    if (!projectToQuery.s3Created) {
      var folderPathNew = `${userId}/${projectName}/${folderPath}/`;
    } else {
      return NextResponse.json(
        { message: "Default folder already created", success: false },
        { status: 400 }
      );
    }
  } else {
    var folderPathNew = `${userId}/${projectName}/${folderPath}/`;
  }

  const folderExists = await prisma.folder.findFirst({
    where: {
      projectId,
      name: folderPath as string,
    },
  });
  if (folderExists && !defaultBoolean) {
    return NextResponse.json(
      { message: "Folder already exists", success: false },
      { status: 400 }
    );
  }
  if (!folderExists) {
    const newFolder = await prisma.folder.create({
      data: {
        name: folderPath as string,
        projectId,
      },
    });
    if (!newFolder) {
      return NextResponse.json(
        { message: "Failed to create folder", success: false },
        { status: 400 }
      );
    }
  }

  const client = new S3Client({
    region: process.env.AWS_SDK_REGION,
    credentials: {
      accessKeyId: process.env.AWS_SDK_ID as string,
      secretAccessKey: process.env.AWS_SDK_SECRET as string,
    },
  });

  async function createFolder(bucket: string) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: folderPathNew, // Key with trailing slash
    });
    return await client.send(command);
  }

  const response = await createFolder("pshow");
  if (!response) {
    return NextResponse.json(
      { message: "Failed to create folder", success: false },
      { status: 400 }
    );
  } else {
    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        s3Created: true,
      },
    });
    return NextResponse.json({ message: "Folder created", success: true });
  }
}
