import { auth } from "@/auth";
import prisma from "@/lib/db/db.config";
import projectSchema from "@/schema/ProjectSchema";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const { name, description, folder } = await reqBody;

  try {
    const validation = projectSchema.parse({ name, description, folder });
    const authUser = await auth();
    const userIdForQuery = authUser.user.id as string;
    if (!authUser) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    try {
      const checkProject = await prisma.project.findFirst({
        where: {
          name,
        },
      });
      if (checkProject) {
        return NextResponse.json(
          { message: "Project already exists" },
          { status: 400 }
        );
      }
      const newProject = await prisma.project.create({
        data: {
          name,
          description,
          userId: userIdForQuery,
          endpoint: "http://localhost:3000",
          // Add other fields as necessary
        },
      });

      const newFolder = await prisma.folder.create({
        data: {
          name: folder, // You can customize this as needed
          projectId: newProject.id,
        },
      });
      if (newProject && newFolder) {
        return NextResponse.json(
          {
            message: "Project created successfully",
            projectId: newProject.id,
            userId: newProject.userId,
          },
          { status: 200 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: "Prisma create error" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Zod validation failed" },
      { status: 400 }
    );
  }
}
