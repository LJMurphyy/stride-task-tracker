// Import the Prisma client to access the database
import { PrismaClient } from '@prisma/client'

// Instantiate a new Prisma client instance
const prisma = new PrismaClient()

// ======================
// GET /api/events
// ======================
export async function GET() {
  try {
    const events = await prisma.event.findMany()
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// ======================
// POST /api/events
// ======================
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, startTime, endTime } = body

    if (!title || !startTime || !endTime) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    })

    return new Response(JSON.stringify(event), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    console.error("Error creating event:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// ======================
// PUT /api/events
// ======================
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, startTime, endTime } = body

    if (!id) {
      return new Response(JSON.stringify({ error: "Event ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const updateData: {
      title?: string,
      description?: string,
      startTime?: Date,
      endTime?: Date
    } = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (startTime !== undefined) updateData.startTime = new Date(startTime)
    if (endTime !== undefined) updateData.endTime = new Date(endTime)

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
    })

    return new Response(JSON.stringify(updatedEvent), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    console.error("Error updating event:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
