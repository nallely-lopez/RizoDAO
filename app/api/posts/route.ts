import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            verified: true,
            hairType: true,
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error obteniendo posts:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { contenido, userEmail } = await req.json();

    if (!contenido || !userEmail) {
      return NextResponse.json({ error: "Datos requeridos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Crear post
    const post = await prisma.post.create({
      data: {
        content: contenido,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            verified: true,
          },
        },
      },
    });

    // Otorgar tokens por publicar
    await prisma.user.update({
      where: { id: user.id },
      data: { tokens: { increment: 5 } },
    });
    await prisma.tokenTransaction.create({
      data: {
        userId: user.id,
        amount: 5,
        type: "GANADO",
        reason: "PUBLICAR en la plataforma",
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Error creando post:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}