import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import axios from "axios";
import FormData from "form-data";
import { auth } from "@/auth";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const isUserAuthenticated = await auth();
    if (!isUserAuthenticated) {
      return NextResponse.json(
        { message: "User is not authenticated", success: false },
        { status: 400 }
      );
    }
    const apiKey = process.env.DEEP_AI_API;
    if (!apiKey) {
      throw new Error("API key is not defined");
    }

    const formData = await req.formData();

    const file = formData.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Invalid file received." },
        { status: 400 }
      );
    }
    const apiType = formData.get("apiType");
    const textPrompt = formData.get("textPrompt") || "";
    console.log("API KO TYPE", apiType);
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    const dirPath = path.join(process.cwd(), "public/assets/");
    const filePath = path.join(dirPath, filename);

    await mkdir(dirPath, { recursive: true });

    await writeFile(filePath, buffer);
    console.log(`File saved at ${filePath}`);

    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));
    if (textPrompt) {
      form.append("text", textPrompt);
    }
    const resp = await axios.post(
      `https://api.deepai.org/api/${apiType}`,
      form,
      {
        headers: {
          "api-key": apiKey,
        },
      }
    );

    const data = await resp.data;
    const imageJpegLink = data?.output_url;

    const imageResp = await fetch(imageJpegLink);
    if (!imageResp.ok) {
      throw new Error(`Error fetching the image: ${imageResp.statusText}`);
    }

    const imageArrayBuffer = await imageResp.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    const uniqueFilename = `${uuidv4()}.jpeg`;
    const publicDir = path.join(process.cwd(), "public", "tempGeneratedImage");

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const imagePath = path.join(publicDir, uniqueFilename);
    fs.writeFileSync(imagePath, imageBuffer);

    return NextResponse.json(
      {
        success: true,
        imageUrl: `/tempGeneratedImage/${uniqueFilename}`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
