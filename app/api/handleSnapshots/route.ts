import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import axios from "axios";
import FormData from "form-data";
import { auth } from "@/auth";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const isUserAuthenticated = await auth();
    if (!isUserAuthenticated) {
      return NextResponse.json(
        { message: "User is not authenticated", success: false },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No files received or incorrect file type." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    const dirPath = path.join(process.cwd(), "public/assets/");
    const filePath = path.join(dirPath, filename);

    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, buffer);
    console.log(`File saved at ${filePath}`);

    const form = new FormData();
    form.append("photo", fs.createReadStream(filePath));

    const headers = {
      token: process.env.LUXAND_CLOUD_API,
      ...form.getHeaders(),
    };

    const response = await axios.post(
      "https://api.luxand.cloud/photo/detect",
      form,
      { headers }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("Error occurred", error);
    return NextResponse.json(
      { message: "Failed", error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
