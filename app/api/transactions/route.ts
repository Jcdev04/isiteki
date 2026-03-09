import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, date, concept, categoryId, paymentMethod, type } = body;

    // Validaciones básicas
    if (!amount || !date || !categoryId || !paymentMethod || !type) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    if (!["gasto", "ingreso"].includes(type)) {
      return NextResponse.json(
        { error: "Tipo debe ser 'gasto' o 'ingreso'" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        concept: concept || null,
        categoryId,
        paymentMethod,
        type,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { result: "success", transaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: 50,
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
