"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Music,
  ListMusic,
  Calendar,
  Settings,
  BarChart3,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Plus,
  Upload,
  Headphones,
  TrendingUp,
  Menu,
  X,
  Edit,
  Trash2,
  MoreVertical,
  Disc,
  Mic,
  Timer,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { useState } from "react";

// Types
interface Station {
  id: string;
  name: string;
  slug: string;
  description?: string;
  genre?: string;
  logo?: string;
  isActive: boolean;
  isPublic: boolean;
  streamUrl?: string;
  streamPort: number;
  streamMount: string;
  streamFormat: string;
  bitrate: number;
  enableAutoDj: boolean;
  crossfade: number;
  normalize: boolean;
  listenersCurrent: number;
  listenersPeak: number;
  listenersMax: number;
  createdAt: string;
  updatedAt: string;
}

interface Media {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration: number;
  format: string;
  fileSize: number;
  playCount: number;
  artwork?: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  type: string;
  shuffle: boolean;
  loop: boolean;
  itemsCount: number;
  totalDuration: number;
}

interface NowPlaying {
  title: string;
  artist?: string;
  album?: string;
  artwork?: string;
  duration?: number;
  elapsedTime?: number;
  isLive: boolean;
  djName?: string;
}

// Sample data
const sampleStations: Station[] = [
  {
    id: "1",
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleMedia: Media[] = [
  { id: "1", title: "Despacito", artist: "Luis Fonsi", album: "Vida", duration: 229, format: "mp3", fileSize: 5480000, playCount: 1245 },
  { id: "2", title: "La Bamba", artist: "Ritchie Valens", album: "Greatest Hits", duration: 195, format: "mp3", fileSize: 4200000, playCount: 856 },
  { id: "3", title: "Bailando", artist: "Enrique Iglesias", album: "Sex and Love", duration: 248, format: "mp3", fileSize: 5800000, playCount: 2341 },
  { id: "4", title: "Vivir Mi Vida", artist: "Marc Anthony", album: "3.0", duration: 285, format: "mp3", fileSize: 6200000, playCount: 1567 },
  { id: "5", title: "Hotel California", artist: "Eagles", album: "Hotel California", duration: 391, format: "mp3", fileSize: 8500000, playCount: 3210 },
  { id: "6", title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", duration: 354, format: "mp3", fileSize: 7800000, playCount: 4521 },
];

const samplePlaylists: Playlist[] = [
  { id: "1", name: "Éxitos Latinos", description: "Los mejores éxitos de música latina", type: "standard", shuffle: true, loop: true, itemsCount: 45, totalDuration: 10800 },
  { id: "2", name: "Rock Clásico", description: "Clásicos del rock de los 70s y 80s", type: "standard", shuffle: true, loop: true, itemsCount: 32, totalDuration: 7200 },
  { id: "3", name: "Mañanas Energéticas", description: "Música para empezar el día", type: "scheduled", shuffle: true, loop: true, itemsCount: 28, totalDuration: 6300 },
];

const listenerData = [
  { time: "00:00", listeners: 120 },
  { time: "04:00", listeners: 45 },
  { time: "08:00", listeners: 156 },
  { time: "12:00", listeners: 312 },
  { time: "16:00", listeners: 298 },
  { time: "20:00", listeners: 412 },
];

const weeklyData = [
  { day: "Lun", listeners: 1850 },
  { day: "Mar", listeners: 2100 },
  { day: "Mié", listeners: 1950 },
  { day: "Jue", listeners: 2300 },
  { day: "Vie", listeners: 2800 },
  { day: "Sáb", listeners: 3200 },
  { day: "Dom", listeners: 2650 },
];

// Utility functions
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Now Playing Player Component
function NowPlayingPlayer({ nowPlaying }: { nowPlaying: NowPlaying }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState([75]);

  return (
    <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
              {nowPlaying.artwork ? (
                <img src={nowPlaying.artwork} alt="Album" className="w-full h-full object-cover" />
              ) : (
                <Disc className="w-8 h-8 text-white" />
              )}
            </div>
            {nowPlaying.isLive && (
              <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                LIVE
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{nowPlaying.title}</h3>
            <p className="text-sm text-purple-200 truncate">{nowPlaying.artist || "Artista desconocido"}</p>
            {nowPlaying.isLive && nowPlaying.djName && (
              <p className="text-xs text-purple-300 flex items-center gap-1 mt-0.5">
                <Mic className="w-3 h-3" /> {nowPlaying.djName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 rounded-full bg-white text-purple-900 hover:bg-white/90"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-purple-300" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-purple-300 w-8">{volume}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Page Component
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const nowPlaying: NowPlaying = {
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    album: "Vida",
    duration: 229,
    elapsedTime: 145,
    isLive: false,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Radio className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-white">RadioFlow</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </div>

      <div className="pt-16 lg:pt-0">
        {/* Main Content */}
        <main className="p-4 lg:p-6">
          {/* Welcome Banner */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Bienvenido, {session?.user?.name || "Usuario"}
            </h1>
            <p className="text-slate-400">
              Gestiona tus estaciones de radio desde el panel de control
            </p>
          </div>

          {/* Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{sampleStations.reduce((acc, s) => acc + s.listenersCurrent, 0)}</p>
                    <p className="text-xs text-slate-400">Oyentes Actuales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{sampleStations.length}</p>
                    <p className="text-xs text-slate-400">Estaciones Activas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{sampleMedia.length}</p>
                    <p className="text-xs text-slate-400">Archivos de Media</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{sampleStations.reduce((acc, s) => acc + s.listenersPeak, 0)}</p>
                    <p className="text-xs text-slate-400">Pico de Oyentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Now Playing */}
            <div className="lg:col-span-2 space-y-6">
              <NowPlayingPlayer nowPlaying={nowPlaying} />

              {/* Listener Chart */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5" />
                    Oyentes (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={listenerData}>
                        <defs>
                          <linearGradient id="colorListeners" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                          labelStyle={{ color: "#f3f4f6" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="listeners"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fill="url(#colorListeners)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Stations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleStations.map((station) => (
                  <Card key={station.id} className="bg-slate-900 border-slate-800 overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-purple-600 to-pink-600 relative">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-3 right-3">
                        <Badge variant={station.isActive ? "default" : "secondary"} className="bg-white/20 text-white">
                          {station.isActive ? "En vivo" : "Offline"}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <h3 className="text-lg font-bold text-white">{station.name}</h3>
                        <p className="text-white/80 text-sm">{station.genre}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-slate-400 mb-3">{station.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-500">{station.listenersCurrent}</p>
                          <p className="text-xs text-slate-400">Oyentes</p>
                        </div>
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                          <Play className="w-4 h-4 mr-2" />
                          Reproducir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Weekly Stats */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base text-white">Esta Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <Bar dataKey="listeners" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base text-white">Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-3">
                      {[
                        { action: "Nueva canción agregada", detail: "Despacito - Luis Fonsi", time: "Hace 5 min" },
                        { action: "Playlist actualizada", detail: "Éxitos Latinos", time: "Hace 15 min" },
                        { action: "Nuevo pico de oyentes", detail: "345 oyentes", time: "Hace 1 hora" },
                        { action: "Programación creada", detail: "Mañanas Energéticas", time: "Hace 2 horas" },
                        { action: "DJ conectado", detail: "DJ Carlos en vivo", time: "Hace 3 horas" },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500" />
                          <div className="flex-1">
                            <p className="font-medium text-white">{activity.action}</p>
                            <p className="text-slate-400 text-xs">{activity.detail}</p>
                          </div>
                          <span className="text-xs text-slate-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base text-white">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Estación
                  </Button>
                  <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Medios
                  </Button>
                  <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white">
                    <ListMusic className="w-4 h-4 mr-2" />
                    Nueva Playlist
                  </Button>
                  <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Programar Show
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
