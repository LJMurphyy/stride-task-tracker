// app/api/users/route.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany()

    // Return a JSON response with the user data
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, role } = body

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields: name and email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role, // Optional; defaults to "DEV" if not provided
      },
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
