import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { nombre, bio, rol, tipoCabello } = await req.json();
    const userEmail = req.headers.get("x-user-email");
    const userId = req.headers.get("x-user-id");

    if (!userEmail && !userId) {
      return NextResponse.json({ error: "Usuario requerido" }, { status: 400 });
    }

    const whereClause = userEmail 
      ? { email: userEmail }
      : { id: userId as string };

    // Leer estado ANTES de actualizar para saber si hay que dar tokens
    const userAntes = await prisma.user.findUnique({ where: whereClause });

    const roleNormalizado =
      rol?.toUpperCase() === "MARCA" ? "MARCA" :
      rol?.toUpperCase() === "ESTILISTA" ? "ESTILISTA" :
      "RIZADA";

    await prisma.user.update({
      where: whereClause,
      data: {
        role: roleNormalizado,
        hairType: tipoCabello || null,
        name: nombre || undefined,
        bio: bio || null,
        onboardingCompleted: true,
      },
    });

    // Dar tokens solo si es la primera vez que completa el onboarding
    if (userAntes && !userAntes.onboardingCompleted) {
      await prisma.user.update({
        where: whereClause,
        data: { tokens: { increment: 20 } },
      });

      await prisma.tokenTransaction.create({
        data: {
          userId: userAntes.id,
          amount: 20,
          type: "GANADO",
          reason: "Welcome bonus",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}