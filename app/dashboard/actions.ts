"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getDashboardData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  try {
    const [monthTransactions, recentTransactionsData] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        select: {
          amount: true,
          type: true,
          categoryId: true,
        },
      }),
      prisma.transaction.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
      })
    ]);

    let gastos = 0;
    let ingresos = 0;
    const gastosByCategory: Record<string, number> = {};

    monthTransactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.type === "gasto") {
        gastos += amount;
        gastosByCategory[tx.categoryId] = (gastosByCategory[tx.categoryId] || 0) + amount;
      } else {
        ingresos += amount;
      }
    });

    const categoriesData = Object.entries(gastosByCategory).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      success: true,
      data: {
        gastos,
        ingresos,
        categoriesData,
        recentTransactions: recentTransactionsData.map(tx => ({
          id: tx.id,
          date: tx.date,
          amount: Number(tx.amount),
          concept: tx.concept,
          categoryId: tx.categoryId,
          type: tx.type,
          paymentMethod: tx.paymentMethod
        }))
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { error: "Error al cargar datos" };
  }
}

export async function deleteTransaction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  try {
    const tx = await prisma.transaction.findUnique({ where: { id } });
    if (!tx || tx.userId !== session.user.id) {
      return { error: "Movimiento no encontrado" };
    }

    await prisma.transaction.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { error: "Error al eliminar" };
  }
}
