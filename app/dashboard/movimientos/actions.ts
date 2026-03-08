"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAllTransactions(limit: number = 200) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });

    return {
      success: true,
      data: transactions.map(tx => ({
        id: tx.id,
        date: tx.date,
        amount: Number(tx.amount),
        concept: tx.concept,
        categoryId: tx.categoryId,
        type: tx.type,
        paymentMethod: tx.paymentMethod
      })),
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { error: "Error al cargar movimientos" };
  }
}
