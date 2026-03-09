"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User, LogOut, ChevronRight, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getDashboardData, deleteTransaction } from "./actions";

const CATEGORIAS: Record<string, { label: string; color: string }> = {
  // Gastos
  comida: { label: "🍔 Comida", color: "#ff8c42" },
  transporte: { label: "🚗 Transporte", color: "#4a90e2" },
  educacion: { label: "📚 Educación", color: "#f1c40f" },
  herramientas: { label: "💻 Herramientas", color: "#1abc9c" },
  entretenimiento: { label: "🎮 Entretenimiento", color: "#9b8dd8" },
  salud: { label: "💊 Salud", color: "#e74c3c" },
  // Ingresos
  freelance: { label: "🚀 Freelance", color: "#2ecc71" },
  business: { label: "💼 Business", color: "#3498db" },
  propinas: { label: "💸 Propinas", color: "#f1c40f" },
  alquiler: { label: "🏠 Alquiler", color: "#e67e22" },
  // Compartido
  otros: { label: "📦 Otros", color: "#95a5a6" },
};

type DashboardState = {
  gastos: number;
  ingresos: number;
  categoriesData: { name: string; value: number }[];
  recentTransactions: any[];
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteTransaction(id);
    if (res.success) {
      setData((prev) => {
        if (!prev) return prev;
        const txToDelete = prev.recentTransactions.find((t) => t.id === id);
        if (!txToDelete) return prev;
        
        const isGasto = txToDelete.type === "gasto";
        return {
          ...prev,
          recentTransactions: prev.recentTransactions.filter((t) => t.id !== id),
          gastos: isGasto ? prev.gastos - txToDelete.amount : prev.gastos,
          ingresos: isGasto ? prev.ingresos : prev.ingresos - txToDelete.amount,
        };
      });
    }
    setDeletingId(null);
  };

  useEffect(() => {
    if (status === "authenticated") {
      getDashboardData().then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
        setLoading(false);
      });
    } else if (status === "unauthenticated") {
      redirect("/");
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#cfd73f]/30 border-t-[#cfd73f] rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const chartData = data?.categoriesData.map((d) => ({
    ...d,
    fill: CATEGORIAS[d.name]?.color || "#95a5a6",
  })) || [];

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1a1a1a] to-[#0a0a0a] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#cfd73f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9b8dd8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative min-h-screen w-full md:flex md:items-start md:justify-center md:p-6">
        <div className="w-full md:max-w-md md:mx-auto pb-24">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-6 mb-6 overflow-hidden rounded-b-3xl bg-neutral-900 border-b border-white/5">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-b-3xl" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-[#cfd73f] to-[#cfd73f] opacity-20 rounded-full blur-3xl pointer-events-none" />
            
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
                        <AvatarImage src={session?.user?.image || undefined} alt="Avatar" />
                        <AvatarFallback>
                          {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium leading-none text-white truncate">
                          {session?.user?.name || "Usuario"}
                        </span>
                        <span className="text-xs text-white/50 leading-none mt-1.5 truncate">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-[#e74c3c] cursor-pointer focus:bg-white/5 focus:text-[#e74c3c]"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="px-6 space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a1a1a] backdrop-blur-xl border border-white/5 rounded-3xl p-5">
                <p className="text-white/40 text-xs font-medium mb-1">Gastos del mes</p>
                <p className="text-2xl font-bold text-[#e74c3c]">
                  {formatCurrency(data?.gastos || 0)}
                </p>
              </div>
              <div className="bg-[#1a1a1a] backdrop-blur-xl border border-white/5 rounded-3xl p-5">
                <p className="text-white/40 text-xs font-medium mb-1">Ingresos del mes</p>
                <p className="text-2xl font-bold text-[#50c878]">
                  {formatCurrency(data?.ingresos || 0)}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-[#1a1a1a] backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative">
              <p className="text-white/80 text-base font-semibold mb-6">Distribución de gastos</p>
              
              {chartData.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <div className="relative h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          stroke="none" // Removes border between slices
                          paddingAngle={5}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#ffffff' }}
                          formatter={(value: any, name: any) => [
                            formatCurrency(Number(value)),
                            CATEGORIAS[String(name)]?.label || String(name)
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-white/40 text-xs font-medium">Total Gastado</span>
                      <span className="text-white text-xl font-bold mt-1">
                        {formatCurrency(data?.gastos || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-3 mt-2 px-1">
                    {[...chartData]
                      .sort((a, b) => b.value - a.value)
                      .map((entry, index) => {
                        const porcentaje = ((entry.value / (data?.gastos || 1)) * 100).toFixed(1);
                        const catInfo = CATEGORIAS[entry.name];
                        // Removing the emoji for the legend, just showing text and color dot
                        const labelParts = (catInfo?.label || entry.name).split(' ');
                        const rawLabel = labelParts.length > 1 ? labelParts.slice(1).join(' ') : labelParts[0];
                        
                        return (
                          <div key={index} className="flex items-center gap-2.5">
                            <div 
                              className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                              style={{ backgroundColor: entry.fill, boxShadow: `0 0 8px ${entry.fill}40` }} 
                            />
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-xs font-medium text-white/80 truncate capitalize">
                                {rawLabel}
                              </span>
                              <span className="text-[11px] font-bold text-white/40">
                                {porcentaje}% ({formatCurrency(entry.value).replace(/S\/\s?/, "")})
                              </span>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#cfd73f]/10 border border-[#cfd73f]/20 mb-4">
                      <svg className="w-7 h-7 text-[#cfd73f]/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                      </svg>
                    </div>
                    <p className="text-white/30 text-sm">Sin datos este mes</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent transactions */}
            <div className="bg-[#1a1a1a] backdrop-blur-xl border border-white/5 rounded-3xl p-6">
              <p className="text-white/80 text-base font-semibold mb-6">Últimos movimientos</p>
              
              <div className="space-y-4">
                {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                  data.recentTransactions.slice(0, 5).map((tx) => {
                    const catInfo = CATEGORIAS[tx.categoryId];
                    const catLabel = catInfo?.label || tx.categoryId;
                    const catColor = catInfo?.color || "#95a5a6";
                    const isGasto = tx.type === "gasto";
                    
                    return (
                        <div key={tx.id} className="flex items-center justify-between group p-1 -mx-1 rounded-xl hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3 overflow-hidden pr-2">
                            {/* Icon Circle */}
                            <div 
                              className="w-10 h-10 rounded-full flex shrink-0 items-center justify-center text-lg shadow-inner"
                              style={{ backgroundColor: `${catColor}15`, border: `1px solid ${catColor}30` }}
                            >
                              <span>{catLabel.split(' ')[0]}</span> {/* Emoji */}
                            </div>
                            
                            <div className="flex flex-col truncate">
                              <span className="text-sm font-medium text-white truncate">
                                {catLabel.substring(catLabel.indexOf(' ') + 1)}
                              </span>
                              <span className="text-xs text-white/40 truncate mt-0.5">
                                {tx.concept || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className={`text-sm font-medium block ${isGasto ? "text-white/80" : "text-[#50c878]"}`}>
                                {isGasto ? "- " : "+ "}
                                {formatCurrency(tx.amount).replace(/S\/\s?/, "S/ ")}
                              </span>
                            </div>
                            
                            <button 
                              onClick={() => handleDelete(tx.id)}
                              disabled={deletingId === tx.id}
                              className="w-8 h-8 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-[#e74c3c]/10 text-[#e74c3c] transition-all disabled:opacity-50"
                              title="Eliminar movimiento"
                            >
                              {deletingId === tx.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                    );
                  })
                ) : (
                  <p className="text-white/30 text-sm text-center py-4">
                    No hay movimientos registrados
                  </p>
                )}
              </div>

              {/* Show All Toggle Button */}
              {data?.recentTransactions && data.recentTransactions.length > 0 && (
                <Link
                  href="/dashboard/movimientos"
                  className="w-full mt-6 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Ver todos los movimientos <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="flex items-center justify-around bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-3 px-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl text-white/40 hover:text-white/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-xs font-medium">Captura</span>
            </Link>

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
