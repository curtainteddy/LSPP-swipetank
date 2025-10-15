import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

    // Get userType from query parameters or fall back to user's database type
    const { searchParams } = new URL(request.url);
    const requestedUserType = searchParams.get("userType");
    const effectiveUserType =
      requestedUserType === "inventor"
        ? "INVENTOR"
        : requestedUserType === "investor"
        ? "INVESTOR"
        : user.userType;

    // Get dashboard data based on effective user type
    if (effectiveUserType === "INVENTOR") {
      // Inventor dashboard data
      const [projects, analyses, conversations] = await Promise.all([
        // Get user's projects with counts
        prisma.project.findMany({
          where: { inventorId: user.id },
          include: {
            _count: {
              select: {
                investments: true,
                likes: true,
              },
            },
            investments: {
              include: {
                investor: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 5,
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),

        // Get user's project analyses
        prisma.analysis.findMany({
          where: {
            project: {
              inventorId: user.id,
            },
          },
          include: {
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        }),

        // Get conversations where user is inventor
        prisma.conversation.findMany({
          where: { inventorId: user.id },
          include: {
            investor: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            project: {
              select: {
                id: true,
                title: true,
              },
            },
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 5,
        }),
      ]);

      // Calculate stats
      const totalProjects = projects.length;
      const totalInvestments = projects.reduce(
        (sum, project) => sum + project._count.investments,
        0
      );
      const totalLikes = projects.reduce(
        (sum, project) => sum + project._count.likes,
        0
      );
      const activeAnalyses = analyses.length;

      // Get recent activity from investments and conversations
      const recentActivity = [
        ...projects.flatMap((project) =>
          project.investments.map((investment) => ({
            id: `investment-${investment.id}`,
            title: "New investment received",
            description: `${investment.investor.name} invested in ${project.title}`,
            time: investment.createdAt,
            type: "investment",
          }))
        ),
        ...conversations.map((conversation) => ({
          id: `message-${conversation.id}`,
          title: "New message",
          description: `${conversation.investor.name} sent a message about ${conversation.project.title}`,
          time: conversation.updatedAt,
          type: "message",
        })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

      return NextResponse.json({
        userType: "inventor",
        stats: [
          {
            title: "My Projects",
            value: totalProjects.toString(),
            icon: "BarChart3",
            color: "text-blue-500",
          },
          {
            title: "Total Investments Received",
            value: totalInvestments.toString(),
            icon: "DollarSign",
            color: "text-green-500",
          },
          {
            title: "Project Likes",
            value: totalLikes.toString(),
            icon: "Users",
            color: "text-purple-500",
          },
          {
            title: "Active Conversations",
            value: conversations.length.toString(),
            icon: "TrendingUp",
            color: "text-orange-500",
          },
        ],
        recentProjects: projects.slice(0, 3).map((project) => ({
          id: project.id,
          name: project.title,
          description:
            project.description?.split("\\n\\n")[1] ||
            project.description?.substring(0, 100) ||
            "",
          status: project.status.toLowerCase(),
          investments: project._count.investments,
          likes: project._count.likes,
          lastUpdated: project.updatedAt,
        })),
        recentActivity,
        analyses: analyses.map((analysis) => ({
          id: analysis.id,
          projectTitle: analysis.project.title,
          createdAt: analysis.createdAt,
          data: analysis.data,
        })),
      });
    } else {
      const [investments, conversations, availableProjects] = await Promise.all(
        [
          prisma.investment.findMany({
            where: { investorId: user.id },
            include: {
              project: {
                include: {
                  inventor: {
                    select: {
                      id: true,
                      name: true,
                      profileImage: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          }),

          // Get conversations where user is investor
          prisma.conversation.findMany({
            where: { investorId: user.id },
            include: {
              inventor: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
              project: {
                select: {
                  id: true,
                  title: true,
                },
              },
              messages: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
              },
            },
            orderBy: {
              updatedAt: "desc",
            },
            take: 5,
          }),

          // Get available projects to invest in
          prisma.project.findMany({
            where: {
              status: "PUBLISHED",
              inventorId: {
                not: user.id,
              },
            },
            include: {
              inventor: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
              _count: {
                select: {
                  investments: true,
                  likes: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          }),
        ]
      );

      // Calculate stats
      const totalInvestments = investments.length;
      const totalInvested = investments.reduce(
        (sum, inv) => sum + (Number(inv.amount) || 0),
        0
      );
      const activeConversations = conversations.length;
      const availableProjectsCount = availableProjects.length;

      // Get recent activity
      const recentActivity = [
        ...investments.map((investment) => ({
          id: `investment-${investment.id}`,
          title: "Investment made",
          description: `You invested in ${investment.project.title}`,
          time: investment.createdAt,
          type: "investment",
        })),
        ...conversations.map((conversation) => ({
          id: `message-${conversation.id}`,
          title: "New conversation",
          description: `Message with ${conversation.inventor.name} about ${conversation.project.title}`,
          time: conversation.updatedAt,
          type: "message",
        })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

      return NextResponse.json({
        userType: "investor",
        stats: [
          {
            title: "Total Investments",
            value: totalInvestments.toString(),
            icon: "DollarSign",
            color: "text-green-500",
          },
          {
            title: "Amount Invested",
            value: `$${totalInvested.toLocaleString()}`,
            icon: "TrendingUp",
            color: "text-blue-500",
          },
          {
            title: "Active Chats",
            value: activeConversations.toString(),
            icon: "Users",
            color: "text-purple-500",
          },
          {
            title: "Available Projects",
            value: availableProjectsCount.toString(),
            icon: "BarChart3",
            color: "text-orange-500",
          },
        ],
        recentProjects: investments.map((investment) => ({
          id: investment.project.id,
          name: investment.project.title,
          description:
            investment.project.description?.split("\\n\\n")[1] ||
            investment.project.description?.substring(0, 100) ||
            "",
          inventorName: investment.project.inventor.name,
          amount: investment.amount,
          investmentDate: investment.createdAt,
          lastUpdated: investment.createdAt,
        })),
        recentActivity,
        investments: investments.map((investment) => ({
          id: investment.id,
          projectTitle: investment.project.title,
          inventorName: investment.project.inventor.name,
          amount: investment.amount,
          createdAt: investment.createdAt,
        })),
      });
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
