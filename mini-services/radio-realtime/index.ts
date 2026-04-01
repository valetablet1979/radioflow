import { Server } from "socket.io";

const PORT = 3003;

const io = new Server(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

console.log(`🎵 Radio Realtime Service running on port ${PORT}`);

// Store station states
const stationStates = new Map<string, any>();

// Initialize with some demo data
stationStates.set("radio-latino", {
  stationId: "radio-latino",
  nowPlaying: {
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    album: "Vida",
    duration: 229,
    elapsedTime: 120,
    isLive: false,
    artwork: null,
  },
  listeners: {
    current: 234,
    peak: 512,
    unique: 189,
  },
  streamStatus: {
    isActive: true,
    bitrate: 128,
    format: "mp3",
  },
});

stationStates.set("rock-classics", {
  stationId: "rock-classics",
  nowPlaying: {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: 354,
    elapsedTime: 180,
    isLive: false,
    artwork: null,
  },
  listeners: {
    current: 156,
    peak: 378,
    unique: 123,
  },
  streamStatus: {
    isActive: true,
    bitrate: 192,
    format: "mp3",
  },
});

// Demo tracks for rotation
const demoTracks = [
  { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", album: "Vida", duration: 229 },
  { title: "Bailando", artist: "Enrique Iglesias", album: "Sex and Love", duration: 248 },
  { title: "Vivir Mi Vida", artist: "Marc Anthony", album: "3.0", duration: 285 },
  { title: "La Bamba", artist: "Ritchie Valens", album: "Greatest Hits", duration: 195 },
  { title: "Hotel California", artist: "Eagles", album: "Hotel California", duration: 391 },
  { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", duration: 354 },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", album: "Led Zeppelin IV", duration: 482 },
];

// Simulate now playing updates
setInterval(() => {
  for (const [stationId, state] of stationStates) {
    // Increment elapsed time
    if (state.nowPlaying.elapsedTime < state.nowPlaying.duration) {
      state.nowPlaying.elapsedTime += 1;
    } else {
      // Change track
      const currentTrackIndex = demoTracks.findIndex(
        (t) => t.title === state.nowPlaying.title
      );
      const nextTrack = demoTracks[(currentTrackIndex + 1) % demoTracks.length];
      state.nowPlaying = {
        ...nextTrack,
        elapsedTime: 0,
        isLive: false,
        artwork: null,
      };
      
      // Broadcast track change
      io.to(`station:${stationId}`).emit("track_change", state.nowPlaying);
    }

    // Random listener fluctuation
    const listenerChange = Math.floor(Math.random() * 5) - 2;
    state.listeners.current = Math.max(
      0,
      state.listeners.current + listenerChange
    );
    state.listeners.peak = Math.max(
      state.listeners.peak,
      state.listeners.current
    );

    // Broadcast updates
    io.to(`station:${stationId}`).emit("now_playing_update", {
      elapsedTime: state.nowPlaying.elapsedTime,
      listeners: state.listeners,
    });
  }
}, 1000);

// Connection handling
io.on("connection", (socket) => {
  console.log(`📱 Client connected: ${socket.id}`);

  // Join station room
  socket.on("join_station", (stationId: string) => {
    socket.join(`station:${stationId}`);
    console.log(`📻 Client ${socket.id} joined station: ${stationId}`);

    // Send current state
    const state = stationStates.get(stationId);
    if (state) {
      socket.emit("station_state", state);
    }
  });

  // Leave station room
  socket.on("leave_station", (stationId: string) => {
    socket.leave(`station:${stationId}`);
    console.log(`🚪 Client ${socket.id} left station: ${stationId}`);
  });

  // Get all stations status
  socket.on("get_all_stations", () => {
    const stations = Array.from(stationStates.entries()).map(([id, state]) => ({
      stationId: id,
      nowPlaying: state.nowPlaying,
      listeners: state.listeners,
      streamStatus: state.streamStatus,
    }));
    socket.emit("all_stations", stations);
  });

  // Handle DJ going live
  socket.on("dj_connect", (data: { stationId: string; djName: string }) => {
    const state = stationStates.get(data.stationId);
    if (state) {
      state.nowPlaying.isLive = true;
      state.nowPlaying.djName = data.djName;
      io.to(`station:${data.stationId}`).emit("dj_connected", {
        djName: data.djName,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Handle DJ disconnecting
  socket.on("dj_disconnect", (stationId: string) => {
    const state = stationStates.get(stationId);
    if (state) {
      state.nowPlaying.isLive = false;
      state.nowPlaying.djName = null;
      io.to(`station:${stationId}`).emit("dj_disconnected", {
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Handle manual now playing update (from admin panel)
  socket.on("update_now_playing", (data: {
    stationId: string;
    title: string;
    artist?: string;
    album?: string;
    artwork?: string;
  }) => {
    const state = stationStates.get(data.stationId);
    if (state) {
      state.nowPlaying = {
        ...state.nowPlaying,
        ...data,
        elapsedTime: 0,
      };
      io.to(`station:${data.stationId}`).emit("track_change", state.nowPlaying);
    }
  });

  socket.on("disconnect", () => {
    console.log(`📴 Client disconnected: ${socket.id}`);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down radio realtime service...");
  io.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
