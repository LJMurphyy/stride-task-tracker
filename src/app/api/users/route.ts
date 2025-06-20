// Import the PrismaClient constructor from the auto-generated client package
import { PrismaClient } from '@prisma/client'

// Instantiate a single Prisma Client instance to interact with the database
const prisma = new PrismaClient()

// Handle GET requests to /api/users
export async function GET() {
  try {
    // Retrieve all users from the database
    const users = await prisma.user.findMany()

    // Return a successful response with the user data in JSON format
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    // Log error to the server console for debugging
    console.error('Error fetching users:', error)

    // Return a 500 Internal Server Error response with an error message
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Handle POST requests to /api/users
export async function POST(request: Request) {
  try {
    // Parse the request body as JSON
    const body = await request.json()
    
    // Extract expected user fields from the request body
    const { name, email, role } = body

    // Validate required fields
    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields: name and email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Create a new user in the database with the provided data
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role, // optional — defaults to 'DEV' as specified in the Prisma schema if not provided
      },
    })

    // Return the newly created user with a 201 Created status
    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    // Log error to the server console for debugging
    console.error("Error creating user:", error)

    // Return a 500 Internal Server Error response if something goes wrong
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, role } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
      },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}