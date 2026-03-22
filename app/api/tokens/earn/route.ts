import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REGLAS_EARN: Record<string, number> = {
  post: 5,
  comentario: 2,
  resena: 10,
  perfil: 20,
  navegacion: 3,
};

export async function POST(req: Request) {
  try {
    const { userEmail, accion } = await req.json() as {
      userEmail: string;
      accion: keyof typeof REGLAS_EARN;
    };

    if (!userEmail || !accion || !(accion in REGLAS_EARN)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const cantidad = REGLAS_EARN[accion];

    const [usuarioActualizado] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { tokens: { increment: cantidad } },
      }),
      prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          amount: cantidad,
          type: "EARN",
          reason: `Acción: ${accion}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      tokensGanados: cantidad,
      totalTokens: usuarioActualizado.tokens,
    });
  } catch (error) {
    console.error("[/api/tokens/earn] Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
