"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
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

const CATEGORIAS = {
  gasto: [
    { id: "comida", label: "🍔 Comida", color: "#ff8c42" },
    { id: "transporte", label: "🚗 Transporte", color: "#4a90e2" },
    { id: "educacion", label: "📚 Educación", color: "#f1c40f" },
    { id: "herramientas", label: "💻 Herramientas", color: "#1abc9c" },
    { id: "entretenimiento", label: "🎮 Entretenimiento", color: "#9b8dd8" },
    { id: "salud", label: "💊 Salud", color: "#e74c3c" },
    { id: "otros", label: "📦 Otros", color: "#95a5a6" },
  ],
  ingreso: [
    { id: "freelance", label: "🚀 Freelance", color: "#2ecc71" },
    { id: "business", label: "💼 Business", color: "#3498db" },
    { id: "propinas", label: "💸 Propinas", color: "#f1c40f" },
    { id: "alquiler", label: "🏠 Alquiler", color: "#e67e22" },
    { id: "otros", label: "📦 Otros", color: "#95a5a6" },
  ],
};

const MEDIOS_PAGO = [
  { value: "billetera digital", label: "💳 Billetera digital" },
  { value: "efectivo", label: "💵 Efectivo" },
  { value: "transferencia", label: "🏦 Transferencia" },
];

// ─── Login Screen ────────────────────────────────────────────────
function LoginScreen() {
  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#cfd73f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9b8dd8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Logo & Branding */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#cfd73f]/10 border border-[#cfd73f]/20 mb-6">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold text-[#cfd73f] mb-3">Isiteki</h1>
          <p className="text-white/50 text-lg">
            Tus finanzas personales,
            <br />
            simples y al instante.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          <p className="text-white/70 text-center text-sm mb-6">
            Inicia sesión para registrar tus movimientos
          </p>
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white text-black font-semibold text-base hover:bg-white/90 transition-all duration-300 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-white/20 text-xs text-center mt-8">
          Al continuar, aceptas nuestros términos de uso
        </p>
      </div>
    </div>
  );
}

// ─── Main Capture Page ───────────────────────────────────────────
export default function Home() {
  const { data: session, status } = useSession();

  const [tipo, setTipo] = useState<"gasto" | "ingreso">("gasto");
  const [fecha, setFecha] = useState(() => {
    const ahora = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(ahora);
  });
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [concepto, setConcepto] = useState("");
  const [medioPago, setMedioPago] = useState("billetera digital");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // Show toast helper
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Loading state
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

  // Not logged in
  if (!session) {
    return <LoginScreen />;
  }

  const getFechaLegible = (fechaStr: string) => {
    if (!fechaStr) return "";
    const [year, month, day] = fechaStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    const formatter = new Intl.DateTimeFormat("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    let parts = formatter.format(date);
    parts = parts.charAt(0).toUpperCase() + parts.slice(1);

    return `${parts}, ${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        amount: parseFloat(monto),
        date: fecha,
        concept: concepto || null,
        categoryId: categoria,
        paymentMethod: medioPago,
        type: tipo,
      };

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.result === "success") {
        showToast(
          `${tipo === "gasto" ? "Gasto" : "Ingreso"} registrado: S/ ${monto}`,
          "success"
        );

        // Reset form
        setMonto("");
        setCategoria("");
        setConcepto("");
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      showToast("Error al registrar. Intenta de nuevo.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden">
      {/* Background subtle effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#cfd73f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9b8dd8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          toast.show
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div
          className={`px-6 py-3 rounded-2xl backdrop-blur-xl border font-medium text-sm ${
            toast.type === "success"
              ? "bg-[#50c878]/15 border-[#50c878]/30 text-[#50c878]"
              : "bg-[#e74c3c]/15 border-[#e74c3c]/30 text-[#e74c3c]"
          }`}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      </div>

      {/* Mobile-first container */}
      <div className="relative min-h-screen w-full md:flex md:items-center md:justify-center md:p-6">
        <div className="w-full md:max-w-md md:mx-auto pb-24">
          {/* Header - Mobile status bar style with glassmorphism */}
          <div className="relative px-6 pt-6 pb-6 mb-6 overflow-hidden rounded-b-3xl bg-neutral-900">
            {/* Glassmorphism background with gradient circle */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-b-3xl" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#cfd73f] to-[#cfd73f] opacity-30 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 flex items-start justify-between">
              {/* Title section */}
              <div className="flex flex-col gap-1 pr-4">
                <h1 className="text-3xl font-bold text-[#cfd73f]">Isiteki</h1>
                <p className="text-base font-medium text-white/70">
                  Registra tus movimientos al instante
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

          {/* Form Container - Mobile full width, Desktop card */}
          <div className="px-6 pb-6 md:bg-[#1a1a1a]/80 md:backdrop-blur-xl md:rounded-3xl md:shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Toggle Tipo (Gasto/Ingreso) */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/60">
                  Tipo de Movimiento
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTipo("gasto");
                      setCategoria("");
                    }}
                    className={`flex-1 py-4 px-4 rounded-2xl font-semibold transition-all duration-300 border-2 ${
                      tipo === "gasto"
                        ? "border-[#e74c3c] text-[#e74c3c] bg-[#e74c3c]/10"
                        : "border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    💸 Gasto
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTipo("ingreso");
                      setCategoria("");
                    }}
                    className={`flex-1 py-4 px-4 rounded-2xl font-semibold transition-all duration-300 border-2 ${
                      tipo === "ingreso"
                        ? "border-[#50c878] text-[#50c878] bg-[#50c878]/10"
                        : "border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    💰 Ingreso
                  </button>
                </div>
              </div>

              {/* Monto - Hero input */}
              <div className="space-y-4">
                <label htmlFor="monto" className="text-sm font-medium text-white/60">
                  Monto *
                </label>
                <div className="relative">
                  <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
                    <div className="relative flex items-center px-5 py-5">
                      <span className="absolute left-5 text-2xl font-bold text-[#cfd73f]">
                        S/
                      </span>
                      <input
                        id="monto"
                        type="number"
                        step="0.01"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        placeholder="0.00"
                        autoFocus
                        required
                        className="flex-1 bg-transparent text-4xl font-bold text-white placeholder:text-white/20 outline-none pl-12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Categoría - Chips con bordes de colores */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/60">
                  Categoría *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIAS[tipo].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoria(cat.id)}
                      className={`py-4 px-4 rounded-2xl font-medium transition-all duration-300 border-2 ${
                        categoria === cat.id
                          ? "scale-[1.02]"
                          : "border-white/10 text-white/50 hover:border-white/20"
                      }`}
                      style={
                        categoria === cat.id
                          ? {
                              borderColor: cat.color,
                              color: cat.color,
                              backgroundColor: `${cat.color}15`,
                            }
                          : undefined
                      }
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concepto */}
              <div className="space-y-4">
                <label
                  htmlFor="concepto"
                  className="text-sm font-medium text-white/60"
                >
                  Concepto <span className="text-white/30">(opcional)</span>
                </label>
                <input
                  id="concepto"
                  type="text"
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  placeholder='Ej: "Taxi al centro"'
                  className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] text-white placeholder:text-white/30 focus:bg-[#222] outline-none transition-all"
                />
              </div>

              {/* Medio de Pago */}
              <div className="space-y-4">
                <label
                  htmlFor="medioPago"
                  className="text-sm font-medium text-white/60"
                >
                  Medio de Pago
                </label>
                <select
                  id="medioPago"
                  value={medioPago}
                  onChange={(e) => setMedioPago(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] text-white focus:bg-[#222] outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  {MEDIOS_PAGO.map((medio) => (
                    <option
                      key={medio.value}
                      value={medio.value}
                      className="bg-[#1a1a1a]"
                    >
                      {medio.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label
                    htmlFor="fecha"
                    className="text-sm font-medium text-white/60"
                  >
                    Fecha
                  </label>
                  <span className="text-xs font-medium text-[#cfd73f]">
                    {getFechaLegible(fecha)}
                  </span>
                </div>
                <input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] text-white focus:bg-[#222] outline-none transition-all"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={!monto || !categoria || isSubmitting}
                className="w-full py-5 rounded-2xl font-bold text-lg text-black disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all mt-8"
                style={{
                  backgroundColor:
                    !monto || !categoria || isSubmitting
                      ? "#2a2a2a"
                      : "#cfd73f",
                }}
              >
                {isSubmitting
                  ? "⏳ Guardando..."
                  : tipo === "gasto"
                  ? "💸 Registrar Gasto"
                  : "💰 Registrar Ingreso"}
              </button>
            </form>

            {/* Tip */}
            <div className="mt-6 text-center">
              <p className="text-white/30 text-sm">
                ⚡ Solo monto y categoría son obligatorios
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="flex items-center justify-around bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-3 px-2">
            {/* Captura (active) */}
            <Link
              href="/"
              className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl bg-[#cfd73f]/10 text-[#cfd73f]"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="text-xs font-semibold">Captura</span>
            </Link>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl text-white/40 hover:text-white/60 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                />
              </svg>
              <span className="text-xs font-medium">Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
