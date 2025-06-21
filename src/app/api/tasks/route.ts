import { PrismaClient, TaskStatus } from '@prisma/client'
import { isTechLead } from '@/app/utilities/checkRole'

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

// POST handler — creates a new task (TECH_LEAD only)
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

    if (!(await isTechLead(userId))) {
      return new Response(JSON.stringify({ error: "Only TECH_LEADs can create tasks" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    const task = await prisma.task.create({
      data: { title, description, status, userId },
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

// PUT handler — updates a task by ID (DEVs can only mark status as DONE)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, status, dueDate, userId } = body

    if (!id || !userId) {
      return new Response(JSON.stringify({ error: "Task ID and User ID are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const isLead = await isTechLead(userId)

    if (!isLead && status !== 'DONE') {
      return new Response(JSON.stringify({ error: "Only TECH_LEADs can update anything other than marking as DONE" }), {
        status: 403,
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

// DELETE handler — deletes a task (TECH_LEAD only)
export async function DELETE(request: Request) {
  try {
    const { id, userId } = await request.json()

    if (!id || !userId) {
      return new Response(JSON.stringify({ error: "Task ID and User ID are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!(await isTechLead(userId))) {
      return new Response(JSON.stringify({ error: "Only TECH_LEADs can delete tasks" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    await prisma.task.delete({ where: { id } })

    return new Response(JSON.stringify({ message: "Task deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error deleting task:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
