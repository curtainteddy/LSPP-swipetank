import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PUBLISHED";
    const take = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("offset") || "0");

    const projects = await prisma.project.findMany({
      where: {
        status: status as any,
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
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      status = "DRAFT",
      tags = [],
      images = [],
    } = body;

    // Ensure we have a corresponding app user with proper Clerk profile data
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      const clerk = await currentUser();
      if (!clerk) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      user = await ensureUser({
        id: clerk.id,
        emailAddresses: clerk.emailAddresses ?? [],
        firstName: clerk.firstName,
        lastName: clerk.lastName,
        imageUrl: clerk.imageUrl,
      });
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        price: price ? parseFloat(price) : null,
        status,
        inventorId: user.id,
        images: {
          create: images.map((image: any, index: number) => ({
            url: image.url,
            isPrimary: index === 0,
            order: index,
          })),
        },
      },
    });

    // Handle tags
    if (tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        let tag = await prisma.tag.findUnique({
          where: { name: tagName },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName },
          });
        }

        // Connect tag to project
        await prisma.projectTag.create({
          data: {
            projectId: project.id,
            tagId: tag.id,
          },
        });
      }
    }

    // Fetch the complete project with relations
    const completeProject = await prisma.project.findUnique({
      where: { id: project.id },
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
      },
    });

    return NextResponse.json({ project: completeProject }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
