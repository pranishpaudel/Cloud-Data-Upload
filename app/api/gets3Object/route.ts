import { NextResponse, NextRequest } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@/lib/db/db.config";
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { userId, projectName, folderName, fileName, type } = await reqBody;
    var expiresInSec = 60;
    if (!userId || !projectName || !folderName) {
      return NextResponse.json(
        { message: "Please provide all the required fields", success: false },
        { status: 400 }
      );
    }
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
    const queryifProjectOfUser = await prisma.project.findFirst({
      where: {
        name: projectName,
        userId,
      },
    });
    if (!queryifProjectOfUser) {
      return NextResponse.json(
        { message: "Project not found or user not authorized", success: false },
        { status: 404 }
      );
    }
    const client = new S3Client({
      region: process.env.AWS_SDK_REGION,
      credentials: {
        accessKeyId: process.env.AWS_SDK_ID as string,
        secretAccessKey: process.env.AWS_SDK_SECRET as string,
      },
    });

    const getObject = async (key: string) => {
      if (type === "Download") {
        expiresInSec = 120;
        var command = new GetObjectCommand({
          Bucket: "pshow",
          Key: key,
          ResponseContentDisposition: `attachment; filename="${fileName}"`,
        });
      } else if (type === "Open") {
        expiresInSec = 86400;
        var command = new GetObjectCommand({
          Bucket: "pshow",
          Key: key,
        });
      }
      const url = getSignedUrl(client, command, { expiresIn: expiresInSec });
      return url;
    };

    const getObjRes = await getObject(
      `${userId}/${projectName}/${folderName}/${fileName}`
    );
    if (!getObjRes) {
      return NextResponse.json(
        { message: "No such file found", success: false },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "File found", success: true, url: getObjRes },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    });
  }
}
