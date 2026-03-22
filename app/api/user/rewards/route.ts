import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        tokens: true,
        tokenTxs: {
          orderBy: { createdAt: "desc" },
          take: 30,
          select: {
            id: true,
            amount: true,
            type: true,
            reason: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const totalGanado = user.tokenTxs
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalGastado = user.tokenTxs
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return NextResponse.json({
      tokens: user.tokens,
      totalGanado,
      totalGastado,
      historial: user.tokenTxs,
    });
  } catch (error) {
    console.error("[/api/user/rewards]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
