import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleProjects = [
  {
    title: "EcoTrack Mobile",
    description:
      "SaaS platform & mobile app providing real-time carbon footprint analytics for logistics fleets with AI anomaly detection.",
    status: "PUBLISHED",
    price: 150000,
    tags: ["Climate", "AI", "SaaS", "Analytics"],
    images: [
      {
        url: "https://zip.peshal.xyz/u/v8Be21.webp",
        isPrimary: true,
        order: 0,
      },
      {
        url: "https://zip.peshal.xyz/u/NY8ieT.webp",
        isPrimary: false,
        order: 1,
      },
      {
        url: "https://zip.peshal.xyz/u/OlsJIG.webp",
        isPrimary: false,
        order: 2,
      },
    ],
  },
  {
    title: "FinTech Dashboard",
    description:
      "Unified treasury & cashflow forecasting dashboard for SMEs, integrating bank feeds and predictive ML models.",
    status: "PUBLISHED",
    price: 210000,
    tags: ["FinTech", "ML", "SaaS"],
    images: [
      {
        url: "https://zip.peshal.xyz/u/8eHi5n.webp",
        isPrimary: true,
        order: 0,
      },
      {
        url: "https://zip.peshal.xyz/u/OI5M3e.webp",
        isPrimary: false,
        order: 1,
      },
    ],
  },
  {
    title: "AgroSense IoT",
    description:
      "LoRaWAN sensor mesh & edge analytics optimizing irrigation schedules and nutrient delivery for mid-size farms.",
    status: "DRAFT",
    price: 180000,
    tags: ["AgriTech", "IoT", "Edge", "Sustainability"],
    images: [
      {
        url: "https://zip.peshal.xyz/u/LIZKU2.webp",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    title: "MediScan Assist",
    description:
      "Diagnostic assistant applying vision transformers to triage radiology images and prioritize urgent findings.",
    status: "PUBLISHED",
    price: 320000,
    tags: ["HealthTech", "AI", "Imaging"],
    images: [
      {
        url: "https://zip.peshal.xyz/u/eptrOk.webp",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    title: "RetailFlow Optimize",
    description:
      "Demand sensing & dynamic pricing engine using real-time POS + weather + event data for multi-store retailers.",
    status: "PUBLISHED",
    price: 275000,
    tags: ["Retail", "ML", "Optimization"],
    images: [
      {
        url: "https://zip.peshal.xyz/u/jPm3XY.webp",
        isPrimary: true,
        order: 0,
      },
      {
        url: "https://zip.peshal.xyz/u/c8IR2M.webp",
        isPrimary: false,
        order: 1,
      },
      {
        url: "https://zip.peshal.xyz/u/S4yoDz.webp",
        isPrimary: false,
        order: 2,
      },
    ],
  },
  {
    title: "VoltShare Grid",
    description:
      "Peer-to-peer microgrid energy credit marketplace with on-chain settlement and smart meter reconciliation.",
    status: "DRAFT",
    price: 400000,
    tags: ["Energy", "Blockchain", "Marketplace"],
    images: [
      { url: "https://zip.peshal.xyz/u/p7PADI.png", isPrimary: true, order: 0 },
      {
        url: "https://zip.peshal.xyz/u/O6o91U.png",
        isPrimary: false,
        order: 1,
      },
    ],
  },
  {
    title: "NeuroLearn Tutor",
    description:
      "Adaptive learning engine tailoring micro-lessons using reinforcement learning and cognitive load metrics.",
    status: "PUBLISHED",
    price: 195000,
    tags: ["EdTech", "AI", "Personalization"],
    images: [
      {
        url: "https://zip.peshal.xyz/u/oWSvb7.webp",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    title: "SupplyLens Visibility",
    description:
      "End-to-end shipment visibility & risk scoring platform correlating carrier EDI, AIS, and satellite data.",
    status: "PUBLISHED",
    price: 260000,
    tags: ["Logistics", "Risk", "Analytics"],
    images: [
      {
        url: "https://zip.peshal.xyz/u/c1Q0uI.webp",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    title: "UrbanAir Insights",
    description:
      "High-resolution air quality mapping using mobile sensor swarms and geospatial interpolation models.",
    status: "DRAFT",
    price: 140000,
    tags: ["Climate", "IoT", "Geospatial"],
    images: [
      {
        url: "https://zip.peshal.xyz/u/yLCd6T.webp",
        isPrimary: true,
        order: 0,
      },
      {
        url: "https://zip.peshal.xyz/u/4fzQWh.webp",
        isPrimary: false,
        order: 1,
      },
      {
        url: "https://zip.peshal.xyz/u/2UxPEe.webp",
        isPrimary: false,
        order: 2,
      },
    ],
  },
  {
    title: "SecureCom Post-Quantum",
    description:
      "Post-quantum secure messaging SDK implementing hybrid Kyber + X25519 key exchange with forward secrecy.",
    status: "PUBLISHED",
    price: 350000,
    tags: ["Security", "PostQuantum", "SDK"],
    images: [
      {
        url: "https://zip.peshal.xyz/u/tE0sVg.webp",
        isPrimary: true,
        order: 0,
      },
      {
        url: "https://zip.peshal.xyz/u/XKdXcx.webp",
        isPrimary: false,
        order: 1,
      },
      {
        url: "https://zip.peshal.xyz/u/NTvaZJ.webp",
        isPrimary: false,
        order: 2,
      },
    ],
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a sample user first
  const user = await prisma.user.upsert({
    where: { email: "ujjwalpuri01@gmail.com" },
    update: {
      name: "Ujjwal Puri",
      userType: "INVENTOR",
      profileImage: "/placeholder-user.jpg",
      bio: "SwipeTank platform showcasing various innovative projects.",
    },
    create: {
      clerkUserId: "user_ujjwal_swipetank_123",
      email: "ujjwalpuri01@gmail.com",
      name: "Ujjwal Puri",
      userType: "INVENTOR",
      profileImage: "/placeholder-user.jpg",
      bio: "SwipeTank platform showcasing various innovative projects.",
    },
  });

  console.log(`✅ Created user: ${user.name}`);

  // Clear existing data in correct order (child records first, then parent records)
  console.log("🗑️  Clearing existing data...");

  // Delete child records first
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.projectLike.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.projectTag.deleteMany();
  await prisma.projectImage.deleteMany();

  // Then delete parent records
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();

  console.log("🗑️  Cleared existing projects and tags");

  // Create projects
  for (const projectData of sampleProjects) {
    const { tags, images, ...projectInfo } = projectData;

    const project = await prisma.project.create({
      data: {
        ...projectInfo,
        status: projectInfo.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        inventorId: user.id,
      },
    });

    console.log(`📋 Created project: ${project.title}`);

    // Create images
    for (const imageData of images) {
      await prisma.projectImage.create({
        data: {
          ...imageData,
          projectId: project.id,
        },
      });
    }

    // Create tags
    for (const tagName of tags) {
      let tag = await prisma.tag.findUnique({
        where: { name: tagName },
      });

      if (!tag) {
        tag = await prisma.tag.create({
          data: { name: tagName },
        });
      }

      await prisma.projectTag.create({
        data: {
          projectId: project.id,
          tagId: tag.id,
        },
      });
    }

    console.log(`🏷️  Added ${tags.length} tags to ${project.title}`);
  }

  console.log("🎉 Seed completed successfully!");
  console.log(
    `📊 Created ${sampleProjects.length} projects with images and tags`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
