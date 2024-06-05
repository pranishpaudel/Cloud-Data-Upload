import prisma from "@/lib/db/db.config";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import signupSchema from "@/schema/SignUpSchema";
export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const { name, email, password } = await reqBody;
  try {
    const validaton = signupSchema.parse({ name, email, password });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid json data provided " },
      { status: 400 }
    );
  }

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (findUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 401 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating new user " },
      { status: 400 }
    );
  }
}
