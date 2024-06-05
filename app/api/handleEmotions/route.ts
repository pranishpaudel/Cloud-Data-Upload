import { NextResponse } from "next/server";
import path from "path";
import { mkdir } from "fs/promises";
import axios from "axios";
import FormData from "form-data";
import { auth } from "@/auth";
import fs from "fs";
import https from "https";
import { NextApiRequest, NextApiResponse } from "next";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const isUserAuthenticated = await auth();
    if (!isUserAuthenticated) {
      return NextResponse.json(
        { message: "User is not authenticated", success: false },
        { status: 400 }
      );
    }

    const { imageUrl }: { imageUrl: string } = await req.json();

    const filename: string = imageUrl.split("/").pop()!;
    const dirPath: string = path.join(process.cwd(), "public/tempUserImages/");
    const filePath: string = path.join(dirPath, filename);

    await mkdir(dirPath, { recursive: true });

    const fileWriteStream = fs.createWriteStream(filePath);
    const response = await axios.get(imageUrl, { responseType: "stream" });

    response.data.pipe(fileWriteStream);

    await new Promise((resolve, reject) => {
      fileWriteStream.on("finish", resolve);
      fileWriteStream.on("error", reject);
    });

    console.log(`File downloaded and saved at ${filePath}`);

    const form = new FormData();
    form.append("photo", fs.createReadStream(filePath));

    const headers = {
      token: process.env.LUXAND_CLOUD_API!,
      ...form.getHeaders(),
    };

    const luxandResponse = await axios.post(
      "https://api.luxand.cloud/photo/emotions",
      form,
      { headers }
    );

    return NextResponse.json(luxandResponse.data, { status: 201 });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json(
      { message: "Failed", error: error },
      { status: 500 }
    );
  }
};
