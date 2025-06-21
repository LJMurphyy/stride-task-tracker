import { PrismaClient } from '@prisma/client'
import { isTechLead } from '@/app/utilities/checkRole'

const prisma = new PrismaClient()

// GET — anyone can fetch events
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

// POST — TECH_LEAD only
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, startTime, endTime, userId } = body

    if (!title || !startTime || !endTime || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields: title, startTime, endTime, userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!(await isTechLead(userId))) {
      return new Response(JSON.stringify({ error: "Only TECH_LEADs can create events" }), {
        status: 403,
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

// PUT — TECH_LEAD only
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, startTime, endTime, userId } = body

    if (!id || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields: id, userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!(await isTechLead(userId))) {
      return new Response(JSON.stringify({ error: "Only TECH_LEADs can update events" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    const updateData: {
      title?: string
      description?: string
      startTime?: Date
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

// DELETE — TECH_LEAD only
export async function DELETE(request: Request) {
  try {
    const { id, userId } = await request.json()

    if (!id || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields: id and userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!(await isTechLead(userId))) {
      return new Response(JSON.stringify({ error: "Only TECH_LEADs can delete events" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    await prisma.event.delete({ where: { id } })

    return new Response(JSON.stringify({ message: "Event deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error deleting event:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
