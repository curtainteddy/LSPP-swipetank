import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch messages for a specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Check if user is part of this conversation
    if (
      conversation.investorId !== user.id &&
      conversation.inventorId !== user.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Transform messages for frontend
    const transformedMessages = conversation.messages.map((message) => ({
      id: message.id,
      senderId: message.senderId,
      senderName: message.sender.name,
      senderAvatar:
        message.sender.profileImage || "/placeholder.svg?height=32&width=32",
      content: message.content,
      timestamp: message.createdAt,
      type: message.type.toLowerCase(),
      isCurrentUser: message.senderId === user.id,
    }));

    return NextResponse.json({
      messages: transformedMessages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST: Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;
    const body = await request.json();
    const { message, type = "TEXT" } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
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

    // Verify the user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Check if user is part of this conversation
    if (
      conversation.investorId !== user.id &&
      conversation.inventorId !== user.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        content: message.trim(),
        type: type as any, // TypeScript will validate this against the enum
        senderId: user.id,
        conversationId: conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    // Update conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Transform message for frontend
    const transformedMessage = {
      id: newMessage.id,
      senderId: newMessage.senderId,
      senderName: newMessage.sender.name,
      senderAvatar:
        newMessage.sender.profileImage || "/placeholder.svg?height=32&width=32",
      content: newMessage.content,
      timestamp: newMessage.createdAt,
      type: newMessage.type.toLowerCase(),
      isCurrentUser: true,
    };

    return NextResponse.json({
      message: transformedMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
