import prisma from "@/lib/db/db.config";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const { email, userOtp } = await reqBody;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exists" },
        { status: 401 }
      );
    }

    if (user.otp !== userOtp) {
      return NextResponse.json({ message: "Invalid otp" }, { status: 401 });
    }
    const otpExpiryPresentInDb = user?.otpExpires || "";
    if (user.otp === userOtp && otpExpiryPresentInDb < new Date()) {
      return NextResponse.json(
        { message: "Otp has been expired" },
        { status: 401 }
      );
    }
    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    });
    return NextResponse.json({ message: "User verified successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error verifying user" },
      { status: 400 }
    );
  }
}
