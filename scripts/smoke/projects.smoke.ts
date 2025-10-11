import { PrismaClient, ProjectStatus } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("Running projects smoke test...");

    // Health check
    const nowRes = await prisma.$queryRawUnsafe<{ now: Date }[]>(
      "SELECT NOW() as now"
    );
    console.log("DB time:", nowRes?.[0]?.now ?? null);

    // Ensure we have a known user (from seed)
    const user = await prisma.user.findUnique({
      where: { email: "demo@swipetank.com" },
    });
    if (!user) {
      throw new Error("Seed user not found. Run pnpm run db:seed first.");
    }

    // Create a unique project (similar to POST /api/projects)
    const title = `Smoke Test Project ${new Date().toISOString()}`;
    const project = await prisma.project.create({
      data: {
        title,
        description: "Smoke test description for backend create.",
        price: null,
        status: "DRAFT",
        inventorId: user.id,
        images: {
          create: [
            { url: "/placeholder.jpg", isPrimary: true, order: 0 },
            { url: "/placeholder.svg", isPrimary: false, order: 1 },
          ],
        },
      },
    });
    console.log("Created project:", project.id);

    // Create/attach tags like the API does
    const tagNames = ["Smoke", "Test", "Automation"];
    for (const name of tagNames) {
      let tag = await prisma.tag.findUnique({ where: { name } });
      if (!tag) tag = await prisma.tag.create({ data: { name } });
      await prisma.projectTag.create({
        data: { projectId: project.id, tagId: tag.id },
      });
    }

    // Update status to PUBLISHED (similar to PUT)
    const published = await prisma.project.update({
      where: { id: project.id },
      data: { status: "PUBLISHED" as ProjectStatus },
      include: {
        images: true,
        tags: { include: { tag: true } },
        _count: { select: { likes: true, investments: true } },
      },
    });
    console.log("Updated to:", published.status);

    // Fetch public projects (similar to GET /api/projects)
    const publicProjects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      include: {
        images: { orderBy: { order: "asc" } as any },
        tags: { include: { tag: true } },
        _count: { select: { likes: true, investments: true } },
        inventor: {
          select: { id: true, name: true, email: true, profileImage: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    console.log("Public projects sample count:", publicProjects.length);

    // Fetch my projects (similar to GET /api/projects/my)
    const myProjects = await prisma.project.findMany({
      where: { inventorId: user.id },
      include: {
        images: true,
        tags: { include: { tag: true } },
        _count: { select: { likes: true, investments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    console.log("My projects sample count:", myProjects.length);

    // Cleanup: delete the smoke project to keep DB tidy
    await prisma.project.delete({ where: { id: project.id } });
    console.log("Cleanup done (deleted smoke project).");

    console.log("Smoke test PASSED ✅");
  } catch (err) {
    console.error("Smoke test FAILED ❌\n", err);
    process.exitCode = 1;
  }
}

main().finally(() => process.exit());
