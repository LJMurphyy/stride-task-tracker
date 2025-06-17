import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Jasper",
      email: "jasperdoe@example.com",
      role: "TECH_LEAD"
    },
  });

  const task = await prisma.task.create({
    data: {
      title: "Build the backend",
      description: "Set up API and database",
      status: "IN_PROGRESS",
      userId: user.id,
    },
  });

  const event = await prisma.event.create({
    data: {
      title: "Weekly Planning Session",
      description: "Zoom sync with team",
      startTime: new Date("2025-06-24T10:00:00"),
      endTime: new Date("2025-06-24T11:00:00"),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
