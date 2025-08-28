import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

// Define our own interfaces based on the schema
export type UserType = "INVENTOR" | "INVESTOR";
export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  userType: UserType | null;
  profileImage: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  price: number | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  inventorId: string;
}

/**
 * Get the current user from Clerk auth and database
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  return user;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Require inventor user type - throws if not inventor
 */
export async function requireInventor(): Promise<User> {
  const user = await requireAuth();
  if (user.userType !== "INVENTOR") {
    throw new Error("Inventor access required");
  }
  return user;
}

/**
 * Require investor user type - throws if not investor
 */
export async function requireInvestor(): Promise<User> {
  const user = await requireAuth();
  if (user.userType !== "INVESTOR") {
    throw new Error("Investor access required");
  }
  return user;
}

/**
 * Check if user needs onboarding (no user type set)
 */
export async function needsOnboarding(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { userType: true },
  });

  return !user || user.userType === null;
}

/**
 * Create or update user from Clerk data
 */
export async function ensureUser(clerkUser: {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  if (existingUser) {
    // Update existing user with latest Clerk data
    return await prisma.user.update({
      where: { clerkUserId: clerkUser.id },
      data: {
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          "Anonymous",
        profileImage: clerkUser.imageUrl || null,
      },
    });
  }

  // Create new user with default values (userType will be null for onboarding)
  return await prisma.user.create({
    data: {
      clerkUserId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name:
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "Anonymous",
      profileImage: clerkUser.imageUrl || null,
      // userType is null by default - forces onboarding
    },
  });
}

/**
 * Update user type during onboarding
 */
export async function updateUserType(
  userId: string,
  userType: UserType
): Promise<User> {
  return await prisma.user.update({
    where: { clerkUserId: userId },
    data: { userType },
  });
}
