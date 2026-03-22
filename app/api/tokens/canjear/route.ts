import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateDiscountCode } from "@/lib/generateCode";

const prisma = new PrismaClient();

const CANJE_CONFIG: Record<
  string,
  { discount: number; tokens: number; description: string }
> = {
  DESCUENTO_5:  { discount: 5,  tokens: 100, description: "Descuento 5% en cualquier producto" },
  DESCUENTO_10: { discount: 10, tokens: 200, description: "Descuento 10% en productos seleccionados" },
  DESCUENTO_20: { discount: 20, tokens: 400, description: "Descuento 20% en tu proxima cita" },
};

export async function POST(req: Request) {
  try {
    const { userEmail, canjeType } = await req.json();

    if (!userEmail || !canjeType || !(canjeType in CANJE_CONFIG)) {
      return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
    }

    const config = CANJE_CONFIG[canjeType];

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (user.tokens < config.tokens) {
      return NextResponse.json({ error: "Tokens insuficientes" }, { status: 400 });
    }

    // Verificar si ya tiene un código activo del mismo tipo
    const codigoActivo = await prisma.discountCode.findFirst({
      where: {
        userId: user.id,
        type: canjeType,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (codigoActivo) {
      return NextResponse.json(
        { error: "Ya tienes este descuento activo", code: codigoActivo.code },
        { status: 409 }
      );
    }

    const code = generateDiscountCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Atomic: deduct tokens + create code + record transaction
    const [, discountCode] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { tokens: { decrement: config.tokens } },
      }),
      prisma.discountCode.create({
        data: {
          code,
          userId: user.id,
          type: canjeType,
          description: config.description,
          discount: config.discount,
          tokensUsed: config.tokens,
          expiresAt,
        },
      }),
      prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          amount: -config.tokens,
          type: "CANJE",
          reason: `Canje: ${config.description}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      code: discountCode.code,
      discount: discountCode.discount,
      description: discountCode.description,
      expiresAt: discountCode.expiresAt,
    });
  } catch (error) {
    console.error("[/api/tokens/canjear]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
