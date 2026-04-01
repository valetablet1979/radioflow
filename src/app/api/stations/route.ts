import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/stations - Get all stations
export async function GET() {
  try {
    const stations = await db.station.findMany({
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        nowPlaying: true,
        _count: {
          select: { media: true, playlists: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: stations });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stations" },
      { status: 500 }
    );
  }
}

// POST /api/stations - Create a new station
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      genre,
      streamPort,
      streamMount,
      streamFormat,
      bitrate,
      enableAutoDj,
      crossfade,
      normalize,
      ownerId,
    } = body;

    // Generate slug if not provided
    const stationSlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const station = await db.station.create({
      data: {
        name,
        slug: stationSlug,
        description,
        genre,
        streamPort: streamPort || 8000,
        streamMount: streamMount || "/stream",
        streamFormat: streamFormat || "mp3",
        bitrate: bitrate || 128,
        enableAutoDj: enableAutoDj ?? true,
        crossfade: crossfade ?? 2.0,
        normalize: normalize ?? true,
        owner: {
          connect: { id: ownerId || "default-user" },
        },
      },
    });

    // Create now playing entry
    await db.nowPlaying.create({
      data: {
        stationId: station.id,
        title: "Esperando transmisión...",
        artist: null,
        isLive: false,
      },
    });

    return NextResponse.json({ success: true, data: station }, { status: 201 });
  } catch (error) {
    console.error("Error creating station:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create station" },
      { status: 500 }
    );
  }
}
