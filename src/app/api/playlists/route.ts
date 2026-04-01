import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/playlists - Get all playlists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get("stationId");

    const where: any = {};
    if (stationId) {
      where.stationId = stationId;
    }

    const playlists = await db.playlist.findMany({
      where,
      include: {
        station: {
          select: { id: true, name: true },
        },
        createdBy: {
          select: { id: true, name: true },
        },
        items: {
          include: {
            media: true,
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate total duration for each playlist
    const playlistsWithDuration = playlists.map((playlist) => ({
      ...playlist,
      totalDuration: playlist.items.reduce(
        (acc: number, item: any) => acc + (item.media?.duration || 0),
        0
      ),
    }));

    return NextResponse.json({ success: true, data: playlistsWithDuration });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

// POST /api/playlists - Create a new playlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      stationId,
      name,
      description,
      type,
      weight,
      shuffle,
      loop,
      avoidDuplicates,
      startTime,
      endTime,
      daysOfWeek,
      createdById,
    } = body;

    const playlist = await db.playlist.create({
      data: {
        stationId,
        name,
        description,
        type: type || "standard",
        weight: weight || 1,
        shuffle: shuffle ?? true,
        loop: loop ?? true,
        avoidDuplicates: avoidDuplicates ?? true,
        startTime,
        endTime,
        daysOfWeek,
        createdById,
      },
    });

    return NextResponse.json({ success: true, data: playlist }, { status: 201 });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}

// PUT /api/playlists - Add item to playlist
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { playlistId, mediaId, order, weight } = body;

    const playlistItem = await db.playlistItem.create({
      data: {
        playlistId,
        mediaId,
        order: order || 0,
        weight: weight || 1,
      },
      include: {
        media: true,
      },
    });

    return NextResponse.json({ success: true, data: playlistItem }, { status: 201 });
  } catch (error) {
    console.error("Error adding item to playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add item to playlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/playlists - Delete a playlist or item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const itemId = searchParams.get("itemId");

    if (itemId) {
      await db.playlistItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ success: true, message: "Item removed from playlist" });
    }

    if (id) {
      await db.playlist.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: "Playlist deleted" });
    }

    return NextResponse.json(
      { success: false, error: "Playlist ID or Item ID is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete playlist" },
      { status: 500 }
    );
  }
}
