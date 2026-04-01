import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/media - Get all media files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get("stationId");
    const search = searchParams.get("search");
    const format = searchParams.get("format");

    const where: any = {};
    
    if (stationId) {
      where.stationId = stationId;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { artist: { contains: search, mode: "insensitive" } },
        { album: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (format && format !== "all") {
      where.format = format;
    }

    const media = await db.media.findMany({
      where,
      include: {
        station: {
          select: { id: true, name: true },
        },
        uploadedBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// POST /api/media - Create a new media entry (metadata only, file upload handled separately)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      stationId,
      title,
      artist,
      album,
      genre,
      year,
      filename,
      originalName,
      filePath,
      fileSize,
      duration,
      format,
      bitrate,
      sampleRate,
      artwork,
      isrc,
      uploadedById,
    } = body;

    const media = await db.media.create({
      data: {
        stationId,
        title,
        artist,
        album,
        genre,
        year,
        filename,
        originalName,
        filePath,
        fileSize,
        duration,
        format,
        bitrate,
        sampleRate,
        artwork,
        isrc,
        uploadedById,
      },
    });

    return NextResponse.json({ success: true, data: media }, { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create media" },
      { status: 500 }
    );
  }
}

// DELETE /api/media - Delete a media file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Media ID is required" },
        { status: 400 }
      );
    }

    await db.media.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Media deleted" });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
