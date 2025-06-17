// app/api/tasks/route.ts

import { PrismaClient } from '@prisma/client'

// Instantiate the Prisma client
const prisma = new PrismaClient()

// Export a GET handler (automatically maps to GET requests at /api/tasks)
export async function GET() {
  try {
    // Fetch all tasks from the database
    const tasks = await prisma.task.findMany({
      include: { user: true }, // optional: include user data
    })

    // Return a JSON response with the task data
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)

    // Return an error response if something goes wrong
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, status, userId } = body;

    if (!title || !description || !status || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const task = await prisma.task.create({
      data: { title, description, status, userId },
    });

    return new Response(JSON.stringify(task), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error creating task:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

