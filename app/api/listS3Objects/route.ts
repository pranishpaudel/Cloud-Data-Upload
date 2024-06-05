import { NextResponse, NextRequest } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { auth } from "@/auth";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const isUserAuthenticated = await auth();
  const { userId, objectType } = reqBody;

  function isValidFileName(filename: string) {
    const imageRegex = /^[a-zA-Z0-9 _-]+\.(png|jpg|jpeg|pdf|doc|docx)$/i;
    return imageRegex.test(filename);
  }

  if (!isUserAuthenticated) {
    return NextResponse.json(
      { message: "User is not authenticated", success: false },
      { status: 400 }
    );
  }

  if ((isUserAuthenticated.user.id as string) !== userId) {
    return NextResponse.json(
      { message: "User is not authorized", success: false },
      { status: 401 }
    );
  }

  const client = new S3Client({
    region: process.env.AWS_SDK_REGION,
    credentials: {
      accessKeyId: process.env.AWS_SDK_ID as string,
      secretAccessKey: process.env.AWS_SDK_SECRET as string,
    },
  });

  async function listObjects() {
    const command = new ListObjectsV2Command({
      Bucket: "pshow",
      Prefix: `${userId}/`,
    });
    const result = await client.send(command);
    return result;
  }

  const allObjectsRaw = await listObjects();
  const allObjects = allObjectsRaw.Contents as any[];
  const newObjectsAfterFilter = allObjects.filter((obj) => {
    const splitArray = obj.Key.split("/");

    if (objectType === "file") {
      return (
        splitArray[0] === userId &&
        splitArray.length === 4 &&
        isValidFileName(splitArray[3])
      );
    } else {
      return (
        splitArray[0] === userId &&
        splitArray.length >= 3 &&
        splitArray[2] !== ""
      );
    }
  });
  const newObjectsAfterMap = newObjectsAfterFilter.map(
    ({ StorageClass, ETag, ...rest }) => rest
  );

  return NextResponse.json({ message: newObjectsAfterMap, success: true });
}
