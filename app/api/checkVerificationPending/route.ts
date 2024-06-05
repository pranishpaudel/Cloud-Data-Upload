import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db/db.config";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const email = searchParams?.get("email") || "";
  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!findUser) {
    return NextResponse.json(
      { message: "User does not exists" },
      { status: 200 }
    );
  }
  if (findUser.isVerified) {
    return NextResponse.json(
      { message: "User is already verified" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "User is not verified" },
      { status: 200 }
    );
  }
}
