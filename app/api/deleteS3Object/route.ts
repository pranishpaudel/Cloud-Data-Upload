import { NextResponse, NextRequest } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import prisma from "@/lib/db/db.config";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const {
    userId,
    projectName,
    projectId,
    folderName,
    fileName,
    confirmDeletionString,
    deleteObjectType,
  } = reqBody;

  const isUserAuthenticated = await auth();
  if (!isUserAuthenticated) {
    return NextResponse.json(
      { message: "User is not authenticated", success: false },
      { status: 400 }
    );
  }
  if (userId !== isUserAuthenticated.user.id) {
    return NextResponse.json(
      { message: "User is not authorized", success: false },
      { status: 401 }
    );
  }

  const isProjectOwner = await prisma.project.findFirst({
    where: {
      id: projectId as string,
      userId,
    },
  });
  if (!isProjectOwner) {
    return NextResponse.json(
      { message: "User not authorized to delete other's data", success: false },
      { status: 400 }
    );
  }

  let pathToDelete = "";

  if (deleteObjectType === "Project") {
    if (isProjectOwner?.name !== confirmDeletionString) {
      return NextResponse.json(
        { message: "Confirmation string does not match", success: false },
        { status: 400 }
      );
    }
    await prisma.project.delete({
      where: {
        id: projectId as string,
      },
    });
    pathToDelete = `${userId}/${projectName}/`;
  } else if (deleteObjectType === "Folder") {
    if (folderName !== confirmDeletionString) {
      return NextResponse.json(
        { message: "Confirmation string does not match", success: false },
        { status: 400 }
      );
    }
    const folderToQuery = await prisma.folder.findFirst({
      where: {
        name: folderName as string,
        projectId: projectId as string,
      },
    });

    if (!folderToQuery) {
      return NextResponse.json(
        { message: "Folder already deleted", success: false },
        { status: 400 }
      );
    }

    await prisma.folder.delete({
      where: {
        id: folderToQuery.id,
      },
    });
    pathToDelete = `${userId}/${projectName}/${folderName}/`;
  } else if (deleteObjectType === "File") {
    const folderToQuery = await prisma.folder.findFirst({
      where: {
        name: folderName as string,
        projectId: projectId as string,
      },
    });
    const fileToQuery = await prisma.file.findFirst({
      where: {
        name: fileName as string,
        userId: userId,
        folderId: folderToQuery?.id,
      },
    });

    if (!fileToQuery) {
      return NextResponse.json(
        {
          message: "File already deleted or user not authorized",
          success: false,
        },
        { status: 400 }
      );
    }

    await prisma.file.delete({
      where: {
        id: fileToQuery.id,
      },
    });
    pathToDelete = `${userId}/${projectName}/${folderName}/${fileName}`;
  }

  const client = new S3Client({
    region: process.env.AWS_SDK_REGION,
    credentials: {
      accessKeyId: process.env.AWS_SDK_ID as string,
      secretAccessKey: process.env.AWS_SDK_SECRET as string,
    },
  });

  async function listObjects(bucket: string, prefix: string) {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });
    const response = await client.send(command);
    return response.Contents ? response.Contents.map((item) => item.Key) : [];
  }

  async function deleteObject(bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await client.send(command);
  }

  async function deleteAllObjects(bucket: string, prefix: string) {
    const objects = await listObjects(bucket, prefix);
    for (const objectKey of objects) {
      await deleteObject(bucket, objectKey);
    }
  }

  try {
    if (deleteObjectType === "Project" || deleteObjectType === "Folder") {
      await deleteAllObjects("pshow", pathToDelete);
    } else if (deleteObjectType === "File") {
      await deleteObject("pshow", pathToDelete);
    }

    return NextResponse.json({
      message: "Object deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting object", success: false },
      { status: 500 }
    );
  }
}
