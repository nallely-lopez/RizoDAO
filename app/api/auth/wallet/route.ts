import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { stellarAddress, email } = await req.json()

  if (!stellarAddress) {
    return NextResponse.json({ error: "Sin dirección" }, { status: 400 })
  }

  let user = await prisma.user.findFirst({
    where: { email: email ?? "" },
  })

  if (user) {
    // Si existe pero no tiene nombre = perfil incompleto → onboarding
    const perfilCompleto = !!user.name && user.name !== email?.split("@")[0]
    return NextResponse.json({ isNew: !perfilCompleto, user })
  }

  // Crear usuario nuevo
  user = await prisma.user.create({
    data: {
      email: email ?? `${stellarAddress}@stellar.rizo`,
      name: email?.split("@")[0] ?? "Rizado/a",
      tokens: 0,
    },
  })

  return NextResponse.json({ isNew: true, user })
}