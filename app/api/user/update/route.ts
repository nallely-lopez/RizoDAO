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

    await prisma.user.update({
      where: whereClause,
      data: {
        role: rol?.toUpperCase() === "RIZADA" ? "RIZADA" 
          : rol?.toUpperCase() === "MARCA" ? "MARCA" 
          : rol?.toUpperCase() === "ESTILISTA" ? "ESTILISTA" 
          : "RIZADA",
        hairType: tipoCabello || null,
        name: nombre || undefined,
        bio: bio || null,
        onboardingCompleted: true,
      },
    });

    // Dar tokens por completar onboarding
    const user = await prisma.user.findUnique({
      where: whereClause,
    });

    if (user && !user.onboardingCompleted) {
      await prisma.user.update({
        where: whereClause,
        data: { tokens: { increment: 20 } },
      });

      await prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          amount: 20,
          type: "GANADO",
          reason: "Onboarding completado",
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