import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { textPrompt, clientImageUrl, apiType } = reqBody;
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

    let JSONbody = "";

    if (apiType !== "image-editor") {
      JSONbody = JSON.stringify({
        image: clientImageUrl,
      });
    } else {
      JSONbody = JSON.stringify({
        image: clientImageUrl,
        text: textPrompt,
      });
    }
    const resp = await fetch(`https://api.deepai.org/api/${apiType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSONbody,
    });

    if (!resp.ok) {
      throw new Error(`Error from API: ${resp.statusText}`);
    }

    const data = await resp.json();
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
    return NextResponse.json(
      { message: "Something went wrong", success: false, error: error.message },
      { status: 500 }
    );
  }
}
