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
