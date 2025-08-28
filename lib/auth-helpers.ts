import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

// Define types manually to avoid Prisma client issues
export enum UserType {
  INVENTOR = "INVENTOR",
  INVESTOR = "INVESTOR",
}

export enum ProjectStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

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

/**
 * Get the current user from Clerk auth and database
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    // Use any to bypass type checking for now
    const user = await (prisma as any).user.findUnique({
      where: { clerkUserId: userId },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
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
  if (user.userType !== UserType.INVENTOR) {
    throw new Error("Inventor access required");
  }
  return user;
}

/**
 * Require investor user type - throws if not investor
 */
export async function requireInvestor(): Promise<User> {
  const user = await requireAuth();
  if (user.userType !== UserType.INVESTOR) {
    throw new Error("Investor access required");
  }
  return user;
}

/**
 * Check if user needs onboarding (no user type set)
 */
export async function needsOnboarding(userId: string): Promise<boolean> {
  try {
    const user = await (prisma as any).user.findUnique({
      where: { clerkUserId: userId },
      select: { userType: true },
    });

    return !user || user.userType === null;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return true;
  }
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
  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const name =
    `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
    "Anonymous";
  const profileImage = clerkUser.imageUrl || null;

  try {
    const existingUser = await (prisma as any).user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (existingUser) {
      // Update existing user with latest Clerk data
      return await (prisma as any).user.update({
        where: { clerkUserId: clerkUser.id },
        data: {
          email,
          name,
          profileImage,
        },
      });
    }

    // Create new user with default values (userType will be null for onboarding)
    return await (prisma as any).user.create({
      data: {
        clerkUserId: clerkUser.id,
        email,
        name,
        profileImage,
        // userType is null by default - forces onboarding
      },
    });
  } catch (error) {
    console.error("Error ensuring user:", error);
    throw new Error("Failed to create or update user");
  }
}

/**
 * Update user type during onboarding
 */
export async function updateUserType(
  userId: string,
  userType: UserType
): Promise<User> {
  try {
    return await (prisma as any).user.update({
      where: { clerkUserId: userId },
      data: { userType },
    });
  } catch (error) {
    console.error("Error updating user type:", error);
    throw new Error("Failed to update user type");
  }
}
