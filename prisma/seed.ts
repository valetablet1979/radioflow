import { db } from "../src/lib/db";

async function main() {
  console.log("🌱 Seeding database...");

  // Create default user
  const user = await db.user.upsert({
    where: { email: "admin@radioflow.com" },
    update: {},
    create: {
      email: "admin@radioflow.com",
      name: "Admin",
      password: "$2a$10$placeholder", // In production, use proper hashing
      role: "admin",
    },
  });

  console.log("✅ Created user:", user.email);

  // Create sample stations
  const station1 = await db.station.upsert({
    where: { slug: "radio-latino" },
    update: {},
    create: {
      name: "Radio Latino",
      slug: "radio-latino",
      description: "La mejor música latina 24/7",
      genre: "Latino",
      isActive: true,
      isPublic: true,
      streamPort: 8000,
      streamMount: "/stream",
      streamFormat: "mp3",
      bitrate: 128,
      enableAutoDj: true,
      crossfade: 2.0,
      normalize: true,
      listenersCurrent: 234,
      listenersPeak: 512,
      listenersMax: 1000,
      ownerId: user.id,
    },
  });

  const station2 = await db.station.upsert({
    where: { slug: "rock-classics" },
    update: {},
    create: {
      name: "Rock Classics FM",
      slug: "rock-classics",
      description: "Los clásicos del rock de todos los tiempos",
      genre: "Rock",
      isActive: true,
      isPublic: true,
      streamPort: 8001,
      streamMount: "/stream",
      streamFormat: "mp3",
      bitrate: 192,
      enableAutoDj: true,
      crossfade: 3.0,
      normalize: true,
      listenersCurrent: 156,
      listenersPeak: 378,
      listenersMax: 500,
      ownerId: user.id,
    },
  });

  console.log("✅ Created stations:", station1.name, station2.name);

  // Create sample media
  const mediaData = [
    {
      title: "Despacito",
      artist: "Luis Fonsi",
      album: "Vida",
      genre: "Latino",
      duration: 229,
      format: "mp3",
      fileSize: 5480000,
    },
    {
      title: "La Bamba",
      artist: "Ritchie Valens",
      album: "Greatest Hits",
      genre: "Rock",
      duration: 195,
      format: "mp3",
      fileSize: 4200000,
    },
    {
      title: "Bailando",
      artist: "Enrique Iglesias",
      album: "Sex and Love",
      genre: "Latino",
      duration: 248,
      format: "mp3",
      fileSize: 5800000,
    },
    {
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      genre: "Rock",
      duration: 391,
      format: "mp3",
      fileSize: 8500000,
    },
    {
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      genre: "Rock",
      duration: 354,
      format: "mp3",
      fileSize: 7800000,
    },
  ];

  for (const media of mediaData) {
    await db.media.create({
      data: {
        stationId: station1.id,
        title: media.title,
        artist: media.artist,
        album: media.album,
        genre: media.genre,
        duration: media.duration,
        format: media.format,
        fileSize: media.fileSize,
        filename: `${media.title.toLowerCase().replace(/\s+/g, "-")}.mp3`,
        originalName: `${media.title}.mp3`,
        filePath: `/media/${media.title.toLowerCase().replace(/\s+/g, "-")}.mp3`,
        uploadedById: user.id,
      },
    });
  }

  console.log("✅ Created media files");

  // Create now playing entries
  await db.nowPlaying.create({
    data: {
      stationId: station1.id,
      title: "Despacito",
      artist: "Luis Fonsi ft. Daddy Yankee",
      album: "Vida",
      duration: 229,
      elapsedTime: 120,
      isLive: false,
    },
  });

  await db.nowPlaying.create({
    data: {
      stationId: station2.id,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      duration: 354,
      elapsedTime: 180,
      isLive: false,
    },
  });

  console.log("✅ Created now playing entries");

  // Create settings
  await db.setting.createMany({
    data: [
      { key: "platform_name", value: "RadioFlow", description: "Platform name", category: "general" },
      { key: "platform_url", value: "https://radio.tudominio.com", description: "Platform base URL", category: "general" },
      { key: "default_bitrate", value: "128", description: "Default streaming bitrate", category: "streaming" },
      { key: "default_format", value: "mp3", description: "Default streaming format", category: "streaming" },
      { key: "max_listeners", value: "1000", description: "Maximum listeners per station", category: "streaming" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Created settings");
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
