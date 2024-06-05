import { NextResponse, NextRequest } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams?.get("folder");
  const project = searchParams?.get("project");
  const filename = searchParams?.get("fileName");
  const fileType = searchParams?.get("fileType") || "pdf";
  if (!project || !folder || !filename) {
    return NextResponse.json(
      { message: "Project not found", success: false },
      { status: 400 }
    );
  }
  const isUserAuthenticated = await auth();
  const fileName =
    searchParams?.get("fileName") ||
    `${isUserAuthenticated?.user.id}-${Date.now()}.${fileType}`;
  if (!isUserAuthenticated) {
    return NextResponse.json(
      { message: "User is not authenticated", success: false },
      { status: 400 }
    );
  }

  const client = new S3Client({
    region: process.env.AWS_SDK_REGION,
    credentials: {
      accessKeyId: process.env.AWS_SDK_ID as string,
      secretAccessKey: process.env.AWS_SDK_SECRET as string,
    },
  });

  async function putObject(filename: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: "pshow",
      Key: `${isUserAuthenticated?.user.id}/${project}/${folder}/${filename}`,
      ContentType: contentType,
    });
    const url = getSignedUrl(client, command, { expiresIn: 60 });
    return url;
  }
  const preSignedUrl = await putObject(fileName, "application/pdf");
  if (!preSignedUrl) {
    return NextResponse.json(
      { message: "Failed to get presigned url", success: false },
      { status: 400 }
    );
  }
  return NextResponse.json({ message: preSignedUrl, success: true });
}
