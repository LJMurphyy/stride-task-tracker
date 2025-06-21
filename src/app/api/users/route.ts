import { PrismaClient } from '@prisma/client'
import { isTechLead } from '@/app/utilities/checkRole'

const prisma = new PrismaClient()

// =======================
// GET — open to everyone
// =======================
export async function GET() {
  try {
    const users = await prisma.user.findMany()

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error fetching users:', error)

    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// ==========================
// POST — TECH_LEAD only
// ==========================
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, role, userId } = body

    if (!name || !email || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, email, and userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!(await isTechLead(userId))) {
      return new Response(JSON.stringify({ error: "Only TECH_LEADs can create users" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    const user = await prisma.user.create({
      data: { name, email, role },
    })

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    console.error("Error creating user:", error)

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// ==========================
// PUT — TECH_LEAD only
// ==========================
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, email, role, userId } = body

    if (!id || !userId) {
      return new Response(JSON.stringify({ error: "User ID and acting userId are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!(await isTechLead(userId))) {
      return new Response(JSON.stringify({ error: "Only TECH_LEADs can update users" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
      },
    })

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    console.error("Error updating user:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// ==========================
// DELETE — TECH_LEAD only
// ==========================
export async function DELETE(request: Request) {
  try {
    const { id, userId } = await request.json()

    if (!id || !userId) {
      return new Response(JSON.stringify({ error: "User ID and acting userId are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!(await isTechLead(userId))) {
      return new Response(JSON.stringify({ error: "Only TECH_LEADs can delete users" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    await prisma.user.delete({ where: { id } })

    return new Response(JSON.stringify({ message: "User deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
  