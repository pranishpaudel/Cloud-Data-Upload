import prisma from "@/lib/db/db.config";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import loginSchema from "@/schema/LoginSchema";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const { email, password } = await reqBody;
  try {
    const validaton = loginSchema.parse({ email, password });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid json data provided " },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }
  const isUserVerified = user.isVerified;
  if (!isUserVerified) {
    return NextResponse.json(
      { message: "User is not verified" },
      { status: 401 }
    );
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  } else {
    return NextResponse.json(
      { message: "User logged in successfully" },
      { status: 200 }
    );
  }
}
