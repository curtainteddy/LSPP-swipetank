import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all conversations for the current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in our database
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      // Create user if doesn't exist - we need to get user info from Clerk
      // For now, create a minimal user record
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: "", // We'll update this later when we have more user info
          name: "User",
          profileImage: null,
        },
      });
    }

    // Get conversations where user is either investor or inventor
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ investorId: user.id }, { inventorId: user.id }],
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        investor: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        inventor: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Get the latest message for preview
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform the data for the frontend
    const transformedConversations = conversations.map((conversation) => {
      // Determine the other participant (not the current user)
      const isUserInvestor = conversation.investorId === user.id;
      const otherParticipant = isUserInvestor
        ? conversation.inventor
        : conversation.investor;

      const lastMessage = conversation.messages[0];

      return {
        id: conversation.id,
        conversationId: conversation.id,
        projectId: conversation.project.id,
        participantName: otherParticipant.name,
        participantAvatar:
          otherParticipant.profileImage ||
          "/placeholder.svg?height=40&width=40",
        participantRole: isUserInvestor ? "Inventor" : "Investor",
        projectName: conversation.project.title,
        lastMessage: lastMessage ? lastMessage.content : "No messages yet",
        lastMessageTime: lastMessage
          ? formatTimeAgo(lastMessage.createdAt)
          : "Just started",
        unreadCount: 0, // TODO: Implement unread count logic
        isOnline: false, // TODO: Implement online status
      };
    });

    return NextResponse.json({
      conversations: transformedConversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes} min ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hour${
      Math.floor(diffInHours) !== 1 ? "s" : ""
    } ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }
}
