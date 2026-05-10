import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Fetch the 50 most recent trees from the Supabase database
    const trees = await prisma.tree.findMany({
      orderBy: {
        plantedAt: 'desc'
      },
      take: 50,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(trees)
  } catch (error) {
    console.error("Failed to fetch trees:", error)
    return NextResponse.json({ error: "Failed to fetch trees" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { species, location, latitude, longitude } = body

    // Validate required fields
    if (!species || !location) {
      return NextResponse.json(
        { error: "Missing required fields (species, location)" },
        { status: 400 }
      )
    }

    // Since we don't have authentication yet, let's find or create a default "Guest" user
    // so that the database foreign key constraint is satisfied.
    let defaultUser = await prisma.user.findUnique({
      where: { email: "guest@treetracker.app" }
    });

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          name: "Guest Planter",
          email: "guest@treetracker.app",
        }
      });
    }

    // Insert the new tree into the Supabase database
    const newTree = await prisma.tree.create({
      data: {
        species,
        location,
        latitude,
        longitude,
        userId: defaultUser.id,
      }
    })

    return NextResponse.json(newTree, { status: 201 })
  } catch (error) {
    console.error("Failed to plant tree:", error)
    return NextResponse.json({ error: "Failed to save tree to database" }, { status: 500 })
  }
}
