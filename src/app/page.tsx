"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Music,
  ListMusic,
  Calendar,
  Settings,
  Users,
  BarChart3,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Plus,
  Upload,
  Clock,
  Headphones,
  TrendingUp,
  HardDrive,
  Activity,
  Menu,
  X,
  ChevronRight,
  Edit,
  Trash2,
  MoreVertical,
  Disc,
  Mic,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  { id: "7", title: "Stairway to Heaven", artist: "Led Zeppelin", album: "Led Zeppelin IV", duration: 482, format: "mp3", fileSize: 10200000, playCount: 2890 },
  { id: "8", title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", duration: 356, format: "mp3", fileSize: 7600000, playCount: 1987 },
];

const samplePlaylists: Playlist[] = [
  { id: "1", name: "Éxitos Latinos", description: "Los mejores éxitos de música latina", type: "standard", shuffle: true, loop: true, itemsCount: 45, totalDuration: 10800 },
  { id: "2", name: "Rock Clásico", description: "Clásicos del rock de los 70s y 80s", type: "standard", shuffle: true, loop: true, itemsCount: 32, totalDuration: 7200 },
  { id: "3", name: "Mañanas Energéticas", description: "Música para empezar el día", type: "scheduled", shuffle: true, loop: true, itemsCount: 28, totalDuration: 6300 },
  { id: "4", name: "Noches Románticas", description: "Baladas para las noches", type: "scheduled", shuffle: false, loop: true, itemsCount: 22, totalDuration: 5400 },
];

const listenerData = [
  { time: "00:00", listeners: 120 },
  { time: "02:00", listeners: 85 },
  { time: "04:00", listeners: 45 },
  { time: "06:00", listeners: 78 },
  { time: "08:00", listeners: 156 },
  { time: "10:00", listeners: 234 },
  { time: "12:00", listeners: 312 },
  { time: "14:00", listeners: 345 },
  { time: "16:00", listeners: 298 },
  { time: "18:00", listeners: 389 },
  { time: "20:00", listeners: 412 },
  { time: "22:00", listeners: 356 },
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

// Sidebar Navigation Component
function Sidebar({ 
  activeSection, 
  setActiveSection, 
  isMobileOpen, 
  setIsMobileOpen 
}: { 
  activeSection: string; 
  setActiveSection: (section: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "stations", label: "Estaciones", icon: Radio },
    { id: "media", label: "Medios", icon: Music },
    { id: "playlists", label: "Playlists", icon: ListMusic },
    { id: "schedule", label: "Programación", icon: Calendar },
    { id: "listeners", label: "Oyentes", icon: Headphones },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">RadioFlow</h1>
            <p className="text-xs text-muted-foreground">Transmisión Radial</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeSection === item.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@radioflow.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
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
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 flex-col border-r border-border bg-card z-50 flex"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

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

// Dashboard Section
function DashboardSection() {
  const [selectedStation, setSelectedStation] = useState<Station>(sampleStations[0]);

  const nowPlaying: NowPlaying = {
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    album: "Vida",
    duration: 229,
    elapsedTime: 145,
    isLive: false,
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sampleStations.reduce((acc, s) => acc + s.listenersCurrent, 0)}</p>
                <p className="text-xs text-muted-foreground">Oyentes Actuales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sampleStations.length}</p>
                <p className="text-xs text-muted-foreground">Estaciones Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sampleMedia.length}</p>
                <p className="text-xs text-muted-foreground">Archivos de Media</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sampleStations.reduce((acc, s) => acc + s.listenersPeak, 0)}</p>
                <p className="text-xs text-muted-foreground">Pico de Oyentes</p>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Weekly Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Esta Semana</CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actividad Reciente</CardTitle>
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
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-muted-foreground text-xs">{activity.detail}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Stations Section
function StationsSection() {
  const [stations, setStations] = useState<Station[]>(sampleStations);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Estaciones de Radio</h2>
          <p className="text-muted-foreground">Gestiona tus estaciones de transmisión</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Estación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Estación</DialogTitle>
              <DialogDescription>Configura tu nueva estación de radio</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Estación</Label>
                <Input id="name" placeholder="Mi Radio FM" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Descripción de tu estación..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Género</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="latino">Latino</SelectItem>
                      <SelectItem value="electronic">Electrónica</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="classical">Clásica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bitrate">Calidad (kbps)</Label>
                  <Select defaultValue="128">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="64">64</SelectItem>
                      <SelectItem value="128">128</SelectItem>
                      <SelectItem value="192">192</SelectItem>
                      <SelectItem value="256">256</SelectItem>
                      <SelectItem value="320">320</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>AutoDJ Activado</Label>
                  <p className="text-xs text-muted-foreground">Reproducción automática cuando no hay DJ en vivo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  toast.success("Estación creada exitosamente");
                  setIsCreateDialogOpen(false);
                }}>
                  Crear Estación
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stations.map((station) => (
          <Card key={station.id} className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 relative">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Badge variant={station.isActive ? "default" : "secondary"} className="bg-white/20 text-white">
                  {station.isActive ? "En vivo" : "Offline"}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white">{station.name}</h3>
                <p className="text-white/80 text-sm">{station.genre}</p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4">{station.description}</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">{station.listenersCurrent}</p>
                  <p className="text-xs text-muted-foreground">Actuales</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">{station.listenersPeak}</p>
                  <p className="text-xs text-muted-foreground">Pico</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{station.bitrate}</p>
                  <p className="text-xs text-muted-foreground">kbps</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button className="flex-1" variant="default">
                  <Play className="w-4 h-4 mr-2" />
                  Reproducir
                </Button>
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Media Section
function MediaSection() {
  const [media, setMedia] = useState<Media[]>(sampleMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const filteredMedia = media.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.album?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Biblioteca de Medios</h2>
          <p className="text-muted-foreground">{media.length} archivos de audio</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Subir Archivos
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir Archivos de Audio</DialogTitle>
              <DialogDescription>Arrastra archivos o haz clic para seleccionar</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">Arrastra archivos aquí</p>
                <p className="text-xs text-muted-foreground">MP3, WAV, FLAC, OGG, AAC (máx. 100MB)</p>
                <Button variant="outline" className="mt-4">
                  Seleccionar Archivos
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar por título, artista o álbum..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="mp3">MP3</SelectItem>
            <SelectItem value="flac">FLAC</SelectItem>
            <SelectItem value="wav">WAV</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">#</th>
                  <th className="text-left p-4 font-medium">Título</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Artista</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Álbum</th>
                  <th className="text-left p-4 font-medium">Duración</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Reproducciones</th>
                  <th className="text-left p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((item, index) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-muted-foreground">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Music className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.format.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">{item.artist || "-"}</td>
                    <td className="p-4 hidden lg:table-cell">{item.album || "-"}</td>
                    <td className="p-4">{formatDuration(item.duration)}</td>
                    <td className="p-4 hidden sm:table-cell">{item.playCount.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Playlists Section
function PlaylistsSection() {
  const [playlists, setPlaylists] = useState<Playlist[]>(samplePlaylists);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Playlists</h2>
          <p className="text-muted-foreground">Organiza tu música en playlists</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nombre de la Playlist</Label>
                <Input placeholder="Mi Playlist" />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea placeholder="Descripción opcional..." />
              </div>
              <div className="flex items-center justify-between">
                <Label>Aleatorio</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Repetir</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline">Cancelar</Button>
                <Button>Crear Playlist</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <ListMusic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{playlist.name}</CardTitle>
                    <CardDescription>{playlist.itemsCount} canciones</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{playlist.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  <Timer className="w-4 h-4 inline mr-1" />
                  {formatDuration(playlist.totalDuration)}
                </span>
                <div className="flex gap-1">
                  {playlist.shuffle && <Badge variant="secondary" className="text-xs">Aleatorio</Badge>}
                  {playlist.loop && <Badge variant="secondary" className="text-xs">Repetir</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Schedule Section
function ScheduleSection() {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  const scheduleItems = [
    { day: 0, hour: 8, duration: 3, title: "Mañanas Energéticas", color: "bg-green-500" },
    { day: 1, hour: 8, duration: 3, title: "Mañanas Energéticas", color: "bg-green-500" },
    { day: 2, hour: 8, duration: 3, title: "Mañanas Energéticas", color: "bg-green-500" },
    { day: 3, hour: 8, duration: 3, title: "Mañanas Energéticas", color: "bg-green-500" },
    { day: 4, hour: 8, duration: 3, title: "Mañanas Energéticas", color: "bg-green-500" },
    { day: 0, hour: 14, duration: 4, title: "Tarde Latino", color: "bg-purple-500" },
    { day: 1, hour: 14, duration: 4, title: "Tarde Latino", color: "bg-purple-500" },
    { day: 2, hour: 14, duration: 4, title: "Tarde Latino", color: "bg-purple-500" },
    { day: 3, hour: 14, duration: 4, title: "Tarde Latino", color: "bg-purple-500" },
    { day: 4, hour: 14, duration: 4, title: "Tarde Latino", color: "bg-purple-500" },
    { day: 5, hour: 10, duration: 6, title: "Fin de Semana Mix", color: "bg-blue-500" },
    { day: 6, hour: 10, duration: 6, title: "Fin de Semana Mix", color: "bg-blue-500" },
    { day: 5, hour: 20, duration: 3, title: "Noches de Fiesta", color: "bg-pink-500" },
    { day: 6, hour: 20, duration: 3, title: "Noches de Fiesta", color: "bg-pink-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Programación Semanal</h2>
          <p className="text-muted-foreground">Configura los horarios de tus programas</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Programa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Programa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nombre del Programa</Label>
                <Input placeholder="Mi Programa" />
              </div>
              <div className="space-y-2">
                <Label>Playlist Asociada</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar playlist" />
                  </SelectTrigger>
                  <SelectContent>
                    {samplePlaylists.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hora de Inicio</Label>
                  <Input type="time" defaultValue="08:00" />
                </div>
                <div className="space-y-2">
                  <Label>Hora de Fin</Label>
                  <Input type="time" defaultValue="12:00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Días de la Semana</Label>
                <div className="flex flex-wrap gap-2">
                  {days.map((day, i) => (
                    <Badge key={i} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {day.slice(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline">Cancelar</Button>
                <Button>Crear Programa</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 border-b bg-muted/50">
              <div className="p-3 font-medium border-r">Hora</div>
              {days.map((day) => (
                <div key={day} className="p-3 font-medium text-center border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            {hours.slice(6, 24).map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                <div className="p-2 text-sm text-muted-foreground border-r bg-muted/30">
                  {hour}
                </div>
                {days.map((_, dayIndex) => {
                  const item = scheduleItems.find(
                    (s) => s.day === dayIndex && hours.indexOf(hour) >= s.hour && hours.indexOf(hour) < s.hour + s.duration
                  );
                  return (
                    <div
                      key={dayIndex}
                      className="p-1 border-r last:border-r-0 min-h-[40px]"
                    >
                      {item && hours.indexOf(hour) === item.hour && (
                        <div
                          className={`${item.color} text-white text-xs p-1 rounded cursor-pointer hover:opacity-90`}
                          style={{ height: `${item.duration * 40}px` }}
                        >
                          {item.title}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Listeners Section
function ListenersSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Estadísticas de Oyentes</h2>
        <p className="text-muted-foreground">Métricas detalladas de tu audiencia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">1,847</p>
                <p className="text-muted-foreground">Oyentes Hoy</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% vs ayer
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">12.4k</p>
                <p className="text-muted-foreground">Esta Semana</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.3% vs semana anterior
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">2:34:00</p>
                <p className="text-muted-foreground">Tiempo Promedio</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5.2% vs promedio
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Oyentes por Hora (Últimas 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={listenerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                />
                <Line
                  type="monotone"
                  dataKey="listeners"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Ubicaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { country: "México", listeners: 5234, percentage: 42 },
                { country: "España", listeners: 2156, percentage: 18 },
                { country: "Argentina", listeners: 1876, percentage: 15 },
                { country: "Colombia", listeners: 1432, percentage: 12 },
                { country: "Chile", listeners: 987, percentage: 8 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.country}</span>
                    <span className="text-muted-foreground">{item.listeners.toLocaleString()} oyentes</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { device: "Móvil", icon: "📱", listeners: 6234, percentage: 50 },
                { device: "Desktop", icon: "💻", listeners: 3740, percentage: 30 },
                { device: "Tablet", icon: "📲", listeners: 1247, percentage: 10 },
                { device: "Smart TV", icon: "📺", listeners: 872, percentage: 7 },
                { device: "Otros", icon: "🔊", listeners: 374, percentage: 3 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{item.device}</span>
                      <span className="text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Settings Section
function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuración</h2>
        <p className="text-muted-foreground">Administra la configuración de tu plataforma</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
          <TabsTrigger value="storage">Almacenamiento</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Configuración básica de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre de la Plataforma</Label>
                  <Input defaultValue="RadioFlow" />
                </div>
                <div className="space-y-2">
                  <Label>URL Base</Label>
                  <Input defaultValue="https://radio.tudominio.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea defaultValue="Plataforma de transmisión radial online" />
              </div>
              <div className="space-y-2">
                <Label>Zona Horaria</Label>
                <Select defaultValue="america_mexico">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america_mexico">América/México_City</SelectItem>
                    <SelectItem value="america_new_york">América/New_York</SelectItem>
                    <SelectItem value="europe_madrid">Europa/Madrid</SelectItem>
                    <SelectItem value="america_buenos_aires">América/Buenos_Aires</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Streaming</CardTitle>
              <CardDescription>Ajustes del servidor de streaming</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Puerto Icecast</Label>
                  <Input type="number" defaultValue="8000" />
                </div>
                <div className="space-y-2">
                  <Label>Formato por Defecto</Label>
                  <Select defaultValue="mp3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp3">MP3</SelectItem>
                      <SelectItem value="aac">AAC</SelectItem>
                      <SelectItem value="ogg">OGG Vorbis</SelectItem>
                      <SelectItem value="flac">FLAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bitrate por Defecto</Label>
                  <Select defaultValue="128">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="64">64 kbps</SelectItem>
                      <SelectItem value="128">128 kbps</SelectItem>
                      <SelectItem value="192">192 kbps</SelectItem>
                      <SelectItem value="256">256 kbps</SelectItem>
                      <SelectItem value="320">320 kbps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Crossfade por Defecto</Label>
                  <Input type="number" defaultValue="2" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Normalización de Audio</Label>
                  <p className="text-xs text-muted-foreground">Normaliza el volumen de todos los archivos</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Almacenamiento</CardTitle>
              <CardDescription>Gestión del espacio en disco</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Espacio utilizado</span>
                  <span>45.2 GB / 100 GB</span>
                </div>
                <Progress value={45} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-2xl font-bold">45.2 GB</p>
                  <p className="text-xs text-muted-foreground">Media Files</p>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-2xl font-bold">2.1 GB</p>
                  <p className="text-xs text-muted-foreground">Logs</p>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-2xl font-bold">52.7 GB</p>
                  <p className="text-xs text-muted-foreground">Total Usado</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ruta de Almacenamiento</Label>
                <Input defaultValue="/var/azuracast/stations" />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claves API</CardTitle>
              <CardDescription>Gestiona las claves de acceso a la API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Clave Principal</p>
                  <p className="text-sm text-muted-foreground font-mono">sk_live_****************************</p>
                  <p className="text-xs text-muted-foreground mt-1">Creada: 15 Mar 2026</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Copiar</Button>
                  <Button variant="outline" size="sm" className="text-red-500">Revocar</Button>
                </div>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Clave API
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main App Component
export default function RadioFlowApp() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "stations":
        return <StationsSection />;
      case "media":
        return <MediaSection />;
      case "playlists":
        return <PlaylistsSection />;
      case "schedule":
        return <ScheduleSection />;
      case "listeners":
        return <ListenersSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">RadioFlow</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="p-4 border-t text-center text-sm text-muted-foreground">
          RadioFlow - Plataforma de Transmisión Radial Online © 2026
        </footer>
      </main>
    </div>
  );
}
