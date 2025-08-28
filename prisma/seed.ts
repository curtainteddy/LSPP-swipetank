import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleProjects = [
  {
    title: "EcoTrack Mobile",
    description:
      "Sustainable living app for carbon footprint tracking\n\nEcoTrack helps users monitor and reduce their environmental impact through personalized insights and actionable recommendations. Our AI-powered platform analyzes daily activities, transportation choices, and consumption patterns to provide real-time carbon footprint calculations.\n\nProblem: Climate change is accelerating, but individuals lack accessible tools to understand and reduce their environmental impact.\n\nSolution: A comprehensive mobile app that gamifies sustainability, making eco-friendly choices engaging and measurable.\n\nTarget Market: Environmentally conscious millennials and Gen Z consumers in urban areas.\n\nUse of Funds: Product development (40%), marketing (30%), team expansion (20%), operations (10%).\n\nTeam Size: 5\n\nKey Team Members: Sarah Chen (CEO), Michael Park (CTO), Lisa Wang (Lead Designer)",
    price: 250000,
    status: "PUBLISHED",
    tags: ["Sustainability", "Mobile App", "AI", "Climate Tech"],
    images: [
      { url: "/placeholder.jpg", isPrimary: true, order: 0 },
      { url: "/placeholder.svg", isPrimary: false, order: 1 },
    ],
  },
  {
    title: "FinTech Dashboard",
    description:
      "AI-powered personal finance management platform\n\nRevolutionary fintech platform that uses machine learning to provide personalized financial insights and automated investment strategies for retail investors.\n\nProblem: Traditional financial advisory services are expensive and inaccessible to most retail investors.\n\nSolution: An AI-driven platform that democratizes financial advice through automated portfolio management and personalized recommendations.\n\nTarget Market: Young professionals aged 25-40 with investable assets between $10K-$500K.\n\nUse of Funds: Technology infrastructure (50%), regulatory compliance (25%), marketing (15%), team growth (10%).\n\nTeam Size: 8\n\nKey Team Members: Marcus Rodriguez (CTO), Jennifer Kim (CPO), David Chen (Head of AI)",
    price: 500000,
    status: "PUBLISHED",
    tags: ["FinTech", "AI", "Investment", "SaaS"],
    images: [{ url: "/placeholder.svg", isPrimary: true, order: 0 }],
  },
  {
    title: "HealthCare AI Assistant",
    description:
      "Medical diagnosis assistance platform for healthcare professionals\n\nAdvanced AI platform that assists healthcare professionals with accurate diagnosis and treatment recommendations, reducing medical errors and improving patient outcomes.\n\nProblem: Medical diagnosis errors affect 12 million adults annually in the US, leading to delayed treatment and increased healthcare costs.\n\nSolution: An AI-powered diagnostic assistant that analyzes medical data, symptoms, and patient history to provide evidence-based recommendations.\n\nTarget Market: Hospitals, clinics, and independent healthcare practitioners globally.\n\nUse of Funds: R&D and clinical trials (60%), regulatory approval (20%), sales team (15%), infrastructure (5%).\n\nTeam Size: 12\n\nKey Team Members: Dr. Emily Watson (CMO), Alex Thompson (CEO), Dr. James Liu (Head of Research)",
    price: 1000000,
    status: "PUBLISHED",
    tags: ["HealthTech", "AI", "Medical", "B2B"],
    images: [{ url: "/placeholder.jpg", isPrimary: true, order: 0 }],
  },
  {
    title: "Smart Logistics Platform",
    description:
      "IoT-enabled supply chain optimization for e-commerce\n\nEnd-to-end logistics platform that uses IoT sensors and machine learning to optimize supply chain operations, reduce costs, and improve delivery times.\n\nProblem: E-commerce logistics costs have increased 15% year-over-year, while customer expectations for fast delivery continue to rise.\n\nSolution: Smart IoT platform that provides real-time visibility and predictive analytics for supply chain optimization.\n\nTarget Market: Mid-market e-commerce businesses with $10M-$500M annual revenue.\n\nUse of Funds: Product development (45%), hardware procurement (25%), market expansion (20%), team building (10%).\n\nTeam Size: 15\n\nKey Team Members: Robert Zhang (CEO), Maria Garcia (COO), Kevin Wu (Head of Engineering)",
    price: 750000,
    status: "PUBLISHED",
    tags: ["Logistics", "IoT", "E-commerce", "Supply Chain"],
    images: [{ url: "/placeholder.svg", isPrimary: true, order: 0 }],
  },
  {
    title: "EdTech VR Learning",
    description:
      "Virtual reality educational platform for K-12 students\n\nImmersive VR learning experiences that make complex subjects like science, history, and mathematics engaging and interactive for students.\n\nProblem: Traditional classroom methods struggle to engage digital-native students, leading to declining academic performance.\n\nSolution: VR-powered educational content that transforms abstract concepts into interactive 3D experiences.\n\nTarget Market: K-12 schools, educational institutions, and homeschooling families.\n\nUse of Funds: Content development (40%), technology platform (30%), partnerships (20%), marketing (10%).\n\nTeam Size: 10\n\nKey Team Members: Amanda Foster (CEO), Ryan Kumar (CTO), Dr. Susan Martinez (Head of Curriculum)",
    price: 400000,
    status: "PUBLISHED",
    tags: ["EdTech", "VR", "Education", "K-12"],
    images: [{ url: "/placeholder.jpg", isPrimary: true, order: 0 }],
  },
  {
    title: "Renewable Energy Marketplace",
    description:
      "P2P renewable energy trading platform\n\nBlockchain-based marketplace that enables homeowners with solar panels to sell excess energy directly to neighbors, creating a decentralized energy grid.\n\nProblem: Homeowners with solar installations often sell excess energy back to utilities at below-market rates.\n\nSolution: Peer-to-peer energy trading platform that maximizes returns for solar owners while providing clean energy at competitive prices.\n\nTarget Market: Residential solar owners and environmentally conscious consumers in deregulated energy markets.\n\nUse of Funds: Blockchain development (35%), regulatory compliance (25%), pilot programs (25%), team expansion (15%).\n\nTeam Size: 7\n\nKey Team Members: Carlos Rodriguez (CEO), Alice Chang (Blockchain Lead), Tom Wilson (Business Development)",
    price: 600000,
    status: "DRAFT",
    tags: ["Energy", "Blockchain", "Solar", "Marketplace"],
    images: [{ url: "/placeholder.svg", isPrimary: true, order: 0 }],
  },
  {
    title: "Mental Health App",
    description:
      "AI-powered mental wellness companion\n\nPersonalized mental health support through AI-driven therapy sessions, mood tracking, and crisis intervention features.\n\nProblem: Mental health services are expensive, have long wait times, and are stigmatized in many communities.\n\nSolution: Accessible, anonymous AI companion that provides 24/7 mental health support and connects users with professional help when needed.\n\nTarget Market: Young adults aged 18-35 experiencing anxiety, depression, or stress-related disorders.\n\nUse of Funds: AI development (40%), clinical validation (30%), user acquisition (20%), compliance (10%).\n\nTeam Size: 6\n\nKey Team Members: Dr. Rachel Adams (Clinical Director), Jake Morrison (CEO), Priya Patel (Head of AI)",
    price: 300000,
    status: "PUBLISHED",
    tags: ["HealthTech", "Mental Health", "AI", "Wellness"],
    images: [{ url: "/placeholder.jpg", isPrimary: true, order: 0 }],
  },
  {
    title: "Food Waste Reduction Platform",
    description:
      "AI-powered food waste management for restaurants\n\nSmart inventory management system that uses computer vision and predictive analytics to help restaurants reduce food waste by up to 40%.\n\nProblem: Restaurants waste 30% of food purchased, costing the industry $162 billion annually while contributing to environmental problems.\n\nSolution: AI platform that tracks inventory, predicts demand, and optimizes purchasing to minimize waste while maintaining food quality.\n\nTarget Market: Restaurant chains, independent restaurants, and food service companies.\n\nUse of Funds: AI development (50%), hardware manufacturing (25%), sales and marketing (20%), operations (5%).\n\nTeam Size: 9\n\nKey Team Members: Michelle Chen (CEO), David Park (CTO), Lisa Rodriguez (Head of Sales)",
    price: 450000,
    status: "PUBLISHED",
    tags: ["FoodTech", "AI", "Sustainability", "Computer Vision"],
    images: [{ url: "/placeholder.svg", isPrimary: true, order: 0 }],
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a sample user first
  const user = await prisma.user.upsert({
    where: { email: "demo@swipetank.com" },
    update: {},
    create: {
      clerkUserId: "demo_user_123",
      email: "demo@swipetank.com",
      name: "Demo User",
      userType: "INVENTOR",
      profileImage: "/placeholder-user.jpg",
      bio: "Demo user for SwipeTank platform showcasing various innovative projects.",
    },
  });

  console.log(`✅ Created user: ${user.name}`);

  // Clear existing projects (optional - remove if you want to keep existing data)
  await prisma.projectTag.deleteMany();
  await prisma.projectImage.deleteMany();
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
