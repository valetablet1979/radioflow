"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface NowPlaying {
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  elapsedTime?: number;
  isLive: boolean;
  djName?: string;
  artwork?: string;
}

interface Listeners {
  current: number;
  peak: number;
  unique: number;
}

interface StationState {
  stationId: string;
  nowPlaying: NowPlaying;
  listeners: Listeners;
  streamStatus: {
    isActive: boolean;
    bitrate: number;
    format: string;
  };
}

interface UseRadioRealtimeOptions {
  stationId?: string;
  autoConnect?: boolean;
}

interface UseRadioRealtimeReturn {
  isConnected: boolean;
  stationState: StationState | null;
  allStations: StationState[];
  nowPlaying: NowPlaying | null;
  listeners: Listeners | null;
  joinStation: (stationId: string) => void;
  leaveStation: (stationId: string) => void;
  updateNowPlaying: (data: {
    title: string;
    artist?: string;
    album?: string;
    artwork?: string;
  }) => void;
  connectDJ: (djName: string) => void;
  disconnectDJ: () => void;
}

export function useRadioRealtime(
  options: UseRadioRealtimeOptions = {}
): UseRadioRealtimeReturn {
  const { stationId, autoConnect = true } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [stationState, setStationState] = useState<StationState | null>(null);
  const [allStations, setAllStations] = useState<StationState[]>([]);
  
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect) return;

    const socketInstance = io("/?XTransformPort=3003", {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      console.log("🎵 Connected to Radio Realtime Service");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("📴 Disconnected from Radio Realtime Service");
      setIsConnected(false);
    });

    socketInstance.on("station_state", (state: StationState) => {
      setStationState(state);
    });

    socketInstance.on("all_stations", (stations: StationState[]) => {
      setAllStations(stations);
    });

    socketInstance.on("now_playing_update", (data: {
      elapsedTime: number;
      listeners: Listeners;
    }) => {
      setStationState((prev) =>
        prev
          ? {
              ...prev,
              nowPlaying: {
                ...prev.nowPlaying,
                elapsedTime: data.elapsedTime,
              },
              listeners: data.listeners,
            }
          : null
      );
    });

    socketInstance.on("track_change", (nowPlaying: NowPlaying) => {
      setStationState((prev) =>
        prev
          ? {
              ...prev,
              nowPlaying,
            }
          : null
      );
    });

    socketInstance.on("dj_connected", (data: { djName: string }) => {
      setStationState((prev) =>
        prev
          ? {
              ...prev,
              nowPlaying: {
                ...prev.nowPlaying,
                isLive: true,
                djName: data.djName,
              },
            }
          : null
      );
    });

    socketInstance.on("dj_disconnected", () => {
      setStationState((prev) =>
        prev
          ? {
              ...prev,
              nowPlaying: {
                ...prev.nowPlaying,
                isLive: false,
                djName: undefined,
              },
            }
          : null
      );
    });

    socketRef.current = socketInstance;

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [autoConnect]);

  // Auto-join station if stationId is provided
  useEffect(() => {
    const socket = socketRef.current;
    if (socket && isConnected && stationId) {
      socket.emit("join_station", stationId);

      return () => {
        socket.emit("leave_station", stationId);
      };
    }
  }, [isConnected, stationId]);

  // Request all stations status
  useEffect(() => {
    const socket = socketRef.current;
    if (socket && isConnected) {
      socket.emit("get_all_stations");
    }
  }, [isConnected]);

  const joinStation = useCallback(
    (id: string) => {
      const socket = socketRef.current;
      if (socket && isConnected) {
        socket.emit("join_station", id);
      }
    },
    [isConnected]
  );

  const leaveStation = useCallback(
    (id: string) => {
      const socket = socketRef.current;
      if (socket && isConnected) {
        socket.emit("leave_station", id);
      }
    },
    [isConnected]
  );

  const updateNowPlaying = useCallback(
    (data: {
      title: string;
      artist?: string;
      album?: string;
      artwork?: string;
    }) => {
      const socket = socketRef.current;
      if (socket && isConnected && stationId) {
        socket.emit("update_now_playing", {
          stationId,
          ...data,
        });
      }
    },
    [isConnected, stationId]
  );

  const connectDJ = useCallback(
    (djName: string) => {
      const socket = socketRef.current;
      if (socket && isConnected && stationId) {
        socket.emit("dj_connect", {
          stationId,
          djName,
        });
      }
    },
    [isConnected, stationId]
  );

  const disconnectDJ = useCallback(() => {
    const socket = socketRef.current;
    if (socket && isConnected && stationId) {
      socket.emit("dj_disconnect", stationId);
    }
  }, [isConnected, stationId]);

  return {
    isConnected,
    stationState,
    allStations,
    nowPlaying: stationState?.nowPlaying || null,
    listeners: stationState?.listeners || null,
    joinStation,
    leaveStation,
    updateNowPlaying,
    connectDJ,
    disconnectDJ,
  };
}
