import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Delete the cached analysis for this project
    await prisma.analysis.delete({
      where: { projectId },
    });

    return NextResponse.json({
      success: true,
      message: "Analysis cache cleared for project",
      projectId,
    });
  } catch (error) {
    console.error("Error clearing analysis cache:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear analysis cache",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
