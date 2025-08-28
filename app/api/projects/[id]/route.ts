import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, title, description } = body;

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project || project.inventorId !== user.id) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(title && { title }),
        ...(description && { description }),
      },
      include: {
        inventor: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        images: {
          orderBy: {
            order: "asc",
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            likes: true,
            investments: true,
          },
        },
      },
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project || project.inventorId !== user.id) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
