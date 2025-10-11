import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params =
      "params" in context
        ? context.params instanceof Promise
          ? await context.params
          : context.params
        : (context as any).params;

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        inventor: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        images: { orderBy: { order: "asc" } },
        tags: { include: { tag: true } },
        _count: { select: { likes: true, investments: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params =
      "params" in context
        ? context.params instanceof Promise
          ? await context.params
          : context.params
        : (context as any).params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, title, description, price, tags, images } = body as {
      status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      title?: string;
      description?: string;
      price?: number | string | null;
      tags?: string[]; // names
      images?: Array<{ url: string; isPrimary?: boolean }>; // new list
    };

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

    // Begin a transaction so tags/images replacements are consistent
    const updatedProject = await prisma.$transaction(async (tx) => {
      // Update basic fields first
      const base = await tx.project.update({
        where: { id: params.id },
        data: {
          ...(typeof status !== "undefined" ? { status } : {}),
          ...(typeof title !== "undefined" ? { title } : {}),
          ...(typeof description !== "undefined" ? { description } : {}),
          ...(typeof price !== "undefined"
            ? {
                price:
                  price === null
                    ? null
                    : price === undefined
                    ? undefined
                    : Number(price),
              }
            : {}),
        },
      });

      // Replace images if provided
      if (Array.isArray(images)) {
        await tx.projectImage.deleteMany({ where: { projectId: base.id } });
        if (images.length > 0) {
          await tx.projectImage.createMany({
            data: images.map((img, idx) => ({
              projectId: base.id,
              url: img.url,
              order: idx,
              isPrimary: img.isPrimary ?? idx === 0,
            })),
          });
        }
      }

      // Replace tags if provided
      if (Array.isArray(tags)) {
        await tx.projectTag.deleteMany({ where: { projectId: base.id } });
        for (const tagName of tags) {
          if (!tagName) continue;
          let tag = await tx.tag.findUnique({ where: { name: tagName } });
          if (!tag) {
            tag = await tx.tag.create({ data: { name: tagName } });
          }
          await tx.projectTag.create({
            data: { projectId: base.id, tagId: tag.id },
          });
        }
      }

      // Return full project with relations
      return tx.project.findUnique({
        where: { id: base.id },
        include: {
          inventor: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
          images: { orderBy: { order: "asc" } },
          tags: { include: { tag: true } },
          _count: { select: { likes: true, investments: true } },
        },
      });
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
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params =
      "params" in context
        ? context.params instanceof Promise
          ? await context.params
          : context.params
        : (context as any).params;
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
