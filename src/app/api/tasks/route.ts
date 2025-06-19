// Import the PrismaClient class from the generated Prisma client package
import { PrismaClient } from '@prisma/client'

// Instantiate a new PrismaClient to access your database
const prisma = new PrismaClient()

// GET handler for /api/tasks — retrieves all tasks
export async function GET() {
  try {
    // Fetch all tasks from the database and include the related user data
    const tasks = await prisma.task.findMany({
      include: { user: true }, // joins each task with its associated user (optional)
    })

    // Return the fetched tasks as a JSON response
    return new Response(JSON.stringify(tasks), {
      status: 200, // OK
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Log any error that occurs during the fetch
    console.error('Error fetching tasks:', error)

    // Return an internal server error response
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST handler for /api/tasks — creates a new task
export async function POST(request: Request) {
  try {
    // Parse the incoming request body as JSON
    const body = await request.json()
    
    // Destructure task details from the request body
    const { title, description, status, userId } = body

    // Validate that all required fields are present
    if (!title || !description || !status || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, // Bad Request
        headers: { "Content-Type": "application/json" },
      })
    }

    // Create a new task record in the database
    const task = await prisma.task.create({
      data: {
        title,        // required
        description,  // optional but validated
        status,       // should be a valid TaskStatus enum
        userId,       // must match an existing user ID
      },
    })

    // Return the newly created task
    return new Response(JSON.stringify(task), {
      status: 201, // Created
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    // Log any error that occurs during task creation
    console.error("Error creating task:", error)

    // Return an internal server error response
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
