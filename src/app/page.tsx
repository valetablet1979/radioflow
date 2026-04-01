"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Radio, Headphones, Music, Calendar, BarChart3, Zap, Globe, Shield } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-pink-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Radio className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                RadioFlow
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto">
              Plataforma Profesional de Transmisión Radial
            </p>
            
            <p className="text-lg text-slate-400 mb-12 max-w-3xl mx-auto">
              Gestiona y transmite tu estación de radio online con herramientas profesionales. 
              AutoDJ, programación, estadísticas en tiempo real y más.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-6"
                onClick={() => router.push("/auth/register")}
              >
                Comenzar Gratis
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800 text-lg px-8 py-6"
                onClick={() => router.push("/auth/login")}
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Todo lo que necesitas para tu radio online
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Herramientas profesionales diseñadas para emisoras de radio de cualquier tamaño
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Radio className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Gestión de Estaciones</h3>
            <p className="text-slate-400">
              Crea y administra múltiples estaciones de radio con configuraciones personalizadas de streaming.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
              <Music className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Biblioteca de Medios</h3>
            <p className="text-slate-400">
              Sube y organiza tu música en una biblioteca centralizada con metadatos automáticos.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AutoDJ Inteligente</h3>
            <p className="text-slate-400">
              Transmisión automática 24/7 con soporte para crossfade, normalización y rotación.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Programación</h3>
            <p className="text-slate-400">
              Programa tus shows y playlists con calendarios semanales y recurrentes.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Estadísticas en Tiempo Real</h3>
            <p className="text-slate-400">
              Monitorea oyentes en tiempo real con gráficos detallados y reportes históricos.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Transmisión Mundial</h3>
            <p className="text-slate-400">
              Llega a oyentes de todo el mundo con streaming en múltiples formatos y calidades.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
            Únete a miles de emisoras que ya confían en RadioFlow para su transmisión online.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-purple-900 hover:bg-slate-100 text-lg px-8 py-6"
              onClick={() => router.push("/auth/register")}
            >
              Crear Cuenta Gratis
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 text-lg px-8 py-6"
              onClick={() => router.push("/auth/login")}
            >
              Ya tengo una cuenta
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Radio className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">RadioFlow</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2024 RadioFlow. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
