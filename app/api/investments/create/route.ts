import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

    // Check if user has already invested in this project
    const existingInvestment = await prisma.investment.findFirst({
      where: {
        investorId: user.id,
        projectId: projectId,
      },
    });

    if (existingInvestment) {
      return NextResponse.json(
        { error: "You have already invested in this project" },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      investment,
      message: "Investment created successfully",
    });
  } catch (error) {
    console.error("Error creating investment:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
