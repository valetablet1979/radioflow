import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/nowplaying - Get current playing info for a station
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get("stationId");

    if (!stationId) {
      // Get all stations' now playing
      const allNowPlaying = await db.nowPlaying.findMany({
        include: {
          station: {
            select: { id: true, name: true, slug: true },
          },
        },
      });
      return NextResponse.json({ success: true, data: allNowPlaying });
    }

    const nowPlaying = await db.nowPlaying.findUnique({
      where: { stationId },
      include: {
        station: {
          select: {
            id: true,
            name: true,
            slug: true,
            listenersCurrent: true,
            listenersPeak: true,
          },
        },
      },
    });

    if (!nowPlaying) {
      return NextResponse.json(
        { success: false, error: "Station not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: nowPlaying });
  } catch (error) {
    console.error("Error fetching now playing:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch now playing" },
      { status: 500 }
    );
  }
}

// PUT /api/nowplaying - Update now playing info
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      stationId,
      mediaId,
      title,
      artist,
      album,
      artwork,
      duration,
      elapsedTime,
      isLive,
      djName,
    } = body;

    const nowPlaying = await db.nowPlaying.update({
      where: { stationId },
      data: {
        mediaId,
        title,
        artist,
        album,
        artwork,
        duration,
        elapsedTime,
        isLive,
        djName,
      },
    });

    // Create stream event for logging
    await db.streamEvent.create({
      data: {
        stationId,
        eventType: "track_start",
        mediaId,
        title,
        artist,
      },
    });

    return NextResponse.json({ success: true, data: nowPlaying });
  } catch (error) {
    console.error("Error updating now playing:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update now playing" },
      { status: 500 }
    );
  }
}
