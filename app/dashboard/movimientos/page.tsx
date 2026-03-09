"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Trash2, Loader2, ArrowLeft, Search } from "lucide-react";
import { getAllTransactions } from "./actions";
import { deleteTransaction } from "../actions";

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

type Transaction = {
  id: string;
  date: Date;
  amount: number;
  concept: string | null;
  categoryId: string;
  type: string;
  paymentMethod: string;
};

export default function MovimientosPage() {
  const { status } = useSession();
  const [data, setData] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      getAllTransactions().then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
        setLoading(false);
      });
    } else if (status === "unauthenticated") {
      redirect("/");
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteTransaction(id);
    if (res.success) {
      setData((prev) => {
        if (!prev) return prev;
        return prev.filter((t) => t.id !== id);
      });
    }
    setDeletingId(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#cfd73f]/30 border-t-[#cfd73f] rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Cargando movimientos...</p>
        </div>
      </div>
    );
  }

  // Agrupar movimientos por fecha para lectura óptima
  const groupedData: Record<string, Transaction[]> = {};
  if (data) {
    data.forEach((tx) => {
      const dateStr = new Date(tx.date).toLocaleDateString("es-PE", {
        weekday: 'short', 
        day: 'numeric', 
        month: 'short'
      });
      const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
      if (!groupedData[formattedDate]) {
        groupedData[formattedDate] = [];
      }
      groupedData[formattedDate].push(tx);
    });
  }

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1a1a1a] to-[#0a0a0a] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#cfd73f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9b8dd8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative min-h-screen w-full md:flex md:items-start md:justify-center md:px-6">
        <div className="w-full md:max-w-md md:mx-auto pb-12">
          {/* Header */}
          <div className="px-6 pt-6 pb-6 mb-6 overflow-hidden rounded-b-3xl bg-neutral-900 border-b border-white/5 sticky top-0 z-30 shadow-2xl">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-b-3xl" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#cfd73f] to-[#cfd73f] opacity-10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard"
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-white tracking-tight">Movimientos</h1>
                  <p className="text-xs font-medium text-white/50">
                    {data?.length || 0} registros encontrados
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 space-y-8">
            {Object.keys(groupedData).length > 0 ? (
              Object.entries(groupedData).map(([dateLabel, transactions]) => (
                <div key={dateLabel} className="space-y-4">
                  {/* Sticky Date Header for nice scroll UX */}
                  <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider sticky top-28 backdrop-blur-md inline-block px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                    {dateLabel}
                  </h3>
                  
                  <div className="bg-[#1a1a1a] backdrop-blur-xl border border-white/5 rounded-3xl p-3 space-y-1">
                    {transactions.map((tx) => {
                      const catInfo = CATEGORIAS[tx.categoryId];
                      const catLabel = catInfo?.label || tx.categoryId;
                      const catColor = catInfo?.color || "#95a5a6";
                      const isGasto = tx.type === "gasto";
                      
                      return (
                        <div key={tx.id} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-4 overflow-hidden pr-2">
                            {/* Icon Circle */}
                            <div 
                              className="w-12 h-12 rounded-full flex shrink-0 items-center justify-center text-xl shadow-inner"
                              style={{ backgroundColor: `${catColor}15`, border: `1px solid ${catColor}30` }}
                            >
                              <span>{catLabel.split(' ')[0]}</span> {/* Emoji */}
                            </div>
                            
                            <div className="flex flex-col truncate">
                              <span className="text-sm font-semibold text-white/90 truncate">
                                {catLabel.substring(catLabel.indexOf(' ') + 1)}
                              </span>
                              <span className="text-xs text-white/40 truncate mt-0.5 font-medium">
                                {tx.concept || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className={`text-sm font-bold block ${isGasto ? "text-white/80" : "text-[#50c878]"}`}>
                                {isGasto ? "- " : "+ "}
                                {formatCurrency(tx.amount).replace(/S\/\s?/, "S/ ")}
                              </span>
                            </div>
                            
                            {/* Delete Button (Mobile friendly opacity) */}
                            <button 
                              onClick={() => handleDelete(tx.id)}
                              disabled={deletingId === tx.id}
                              className="md:opacity-0 md:group-hover:opacity-100 opacity-60 hover:opacity-100 w-9 h-9 rounded-full flex items-center justify-center bg-transparent hover:bg-[#e74c3c]/15 text-[#e74c3c] transition-all disabled:opacity-50"
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
                    })}
                  </div>
                </div>
               ))
            ) : (
              <div className="flex items-center justify-center h-48 bg-[#1a1a1a] backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
                    <Search className="w-7 h-7 text-white/30" />
                  </div>
                  <p className="text-white/70 text-base font-semibold">Todo limpio</p>
                  <p className="text-white/40 text-sm mt-1">No hay movimientos registrados</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
