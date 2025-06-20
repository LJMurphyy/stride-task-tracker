import { PrismaClient, TaskStatus } from '@prisma/client'

const prisma = new PrismaClient()

// GET handler — retrieves all tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: true },
    })

    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST handler — creates a new task
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, status, userId } = body

    if (!title || !description || !status || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId,
      },
    })

    return new Response(JSON.stringify(task), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    console.error("Error creating task:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// PUT handler — updates a task by ID
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, status, dueDate } = body

    if (!id) {
      return new Response(JSON.stringify({ error: "Task ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const updateData: {
      title?: string
      description?: string
      status?: TaskStatus
      dueDate?: Date
    } = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate)

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    })

    return new Response(JSON.stringify(updatedTask), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    console.error("Error updating task:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
