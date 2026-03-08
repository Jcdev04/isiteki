"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#cfd73f]/30 border-t-[#cfd73f] rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#cfd73f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9b8dd8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative min-h-screen w-full md:flex md:items-start md:justify-center md:p-6">
        <div className="w-full md:max-w-md md:mx-auto pb-24">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-6 mb-6 overflow-hidden rounded-b-3xl bg-neutral-900">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-b-3xl" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#cfd73f] to-[#cfd73f] opacity-30 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex items-start justify-between">
              {/* Title section */}
              <div className="flex flex-col gap-1 pr-4">
                <h1 className="text-3xl font-bold text-[#cfd73f]">Dashboard</h1>
                <p className="text-base font-medium text-white/70">
                  Resumen de tus finanzas
                </p>
              </div>

              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/10 bg-black/20 hover:bg-white/10 hover:text-white h-9 px-4 py-2">
                    <User className="w-4 h-4 text-[#cfd73f]" />
                    <span className="text-white/90">Mi cuenta</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={session.user?.image || undefined} alt="Avatar" />
                        <AvatarFallback>
                          {session.user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium leading-none text-white truncate">
                          {session.user?.name || "Usuario"}
                        </span>
                        <span className="text-xs text-white/50 leading-none mt-1.5 truncate">
                          {session.user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-[#e74c3c] cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="px-6 space-y-4">
            {/* Summary cards placeholder */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-xs font-medium mb-1">Gastos del mes</p>
                <p className="text-2xl font-bold text-[#e74c3c]">--</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-xs font-medium mb-1">Ingresos del mes</p>
                <p className="text-2xl font-bold text-[#50c878]">--</p>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <p className="text-white/40 text-sm font-medium mb-4">Distribución por categoría</p>
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#cfd73f]/10 border border-[#cfd73f]/20 mb-4">
                    <svg className="w-7 h-7 text-[#cfd73f]/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                  </div>
                  <p className="text-white/30 text-sm">Gráficos próximamente</p>
                  <p className="text-white/20 text-xs mt-1">Registra movimientos para ver tus estadísticas</p>
                </div>
              </div>
            </div>

            {/* Recent transactions placeholder */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <p className="text-white/40 text-sm font-medium mb-4">Últimos movimientos</p>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-white/5" />
                    <div className="flex-1">
                      <div className="h-3 bg-white/5 rounded-full w-24 mb-2" />
                      <div className="h-2 bg-white/5 rounded-full w-16" />
                    </div>
                    <div className="h-4 bg-white/5 rounded-full w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="flex items-center justify-around bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-3 px-2">
            {/* Captura */}
            <Link
              href="/"
              className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl text-white/40 hover:text-white/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-xs font-medium">Captura</span>
            </Link>

            {/* Dashboard (active) */}
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl bg-[#cfd73f]/10 text-[#cfd73f]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              <span className="text-xs font-semibold">Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
