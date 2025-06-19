// Import the Prisma client to access the database
import { PrismaClient } from '@prisma/client'

// Instantiate a new Prisma client instance
const prisma = new PrismaClient()

// GET handler for /api/events — retrieves all event entries
export async function GET() {
  try {
    // Query the database for all events
    const events = await prisma.event.findMany()

    // Return the events as JSON with a 200 OK status
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Log any error that occurs during fetching
    console.error('Error fetching events:', error)

    // Return a 500 error if something goes wrong
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST handler for /api/events — adds a new event to the database
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const body = await request.json()
    const { title, description, startTime, endTime } = body

    // Validate required fields
    if (!title || !startTime || !endTime) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, // Bad Request
        headers: { "Content-Type": "application/json" },
      })
    }

    // Create a new event in the database
    const event = await prisma.event.create({
      data: {
        title,                    // Event name/title (string, required)
        description,              // Optional description
        startTime: new Date(startTime), // Convert ISO string to Date object
        endTime: new Date(endTime),     // Convert ISO string to Date object
      },
    })

    // Return the created event as a response
    return new Response(JSON.stringify(event), {
      status: 201, // Created
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    // Log the error for debugging
    console.error("Error creating event:", error)

    // Return an internal server error response
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
