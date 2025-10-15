import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all investments for this user
    const investments = await prisma.investment.findMany({
      where: {
        investorId: user.id,
      },
      include: {
        project: {
          include: {
            inventor: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
            images: {
              where: {
                isPrimary: true,
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the frontend interface
    const transformedInvestments = investments.map((investment) => ({
      id: investment.id,
      projectName: investment.project.title,
      founderName: investment.project.inventor.name,
      founderAvatar:
        investment.project.inventor.profileImage ||
        "/placeholder.svg?height=40&width=40",
      industry: investment.project.tags[0]?.tag.name || "Other",
      investmentAmount: Number(investment.amount),
      investmentDate: investment.createdAt.toISOString().split("T")[0],
      currentValuation:
        Number(investment.project.price) || Number(investment.amount) * 10, // Mock current valuation
      initialValuation:
        Number(investment.project.price) || Number(investment.amount) * 8, // Mock initial valuation
      equityStake: 5, // Mock equity stake - you may want to add this to your schema
      status: "active" as const, // Mock status - you may want to add this to your schema
      lastUpdate: "Recently",
      notes: investment.message || "",
      performanceData: [
        // Mock performance data - you may want to create a separate table for this
        {
          month: "Jan",
          valuation:
            Number(investment.project.price) || Number(investment.amount) * 8,
        },
        {
          month: "Feb",
          valuation:
            Number(investment.project.price) || Number(investment.amount) * 8.2,
        },
        {
          month: "Mar",
          valuation:
            Number(investment.project.price) || Number(investment.amount) * 8.5,
        },
        {
          month: "Apr",
          valuation:
            Number(investment.project.price) || Number(investment.amount) * 9,
        },
        {
          month: "May",
          valuation:
            Number(investment.project.price) || Number(investment.amount) * 9.5,
        },
        {
          month: "Jun",
          valuation:
            Number(investment.project.price) || Number(investment.amount) * 10,
        },
      ],
      projectId: investment.project.id,
      projectDescription: investment.project.description,
      projectImage:
        investment.project.images[0]?.url ||
        "/placeholder.svg?height=200&width=300",
    }));

    return NextResponse.json({ investments: transformedInvestments });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
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
    const { projectId, amount, message } = body;

    if (!projectId || !amount) {
      return NextResponse.json(
        { error: "Project ID and amount are required" },
        { status: 400 }
      );
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create the investment
    const investment = await prisma.investment.create({
      data: {
        amount: parseFloat(amount),
        message: message || null,
        investorId: user.id,
        projectId: projectId,
      },
      include: {
        project: {
          include: {
            inventor: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ investment });
  } catch (error) {
    console.error("Error creating investment:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
