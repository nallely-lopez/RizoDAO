import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkDiscount } from "@/lib/loyaltyContract";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ discount: 0 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.stellarPublicKey) {
      return NextResponse.json({ discount: 0 });
    }

    const discount = await checkDiscount(user.stellarPublicKey);
    return NextResponse.json({ discount });
  } catch (err) {
    console.error("[loyalty/discount]", err);
    return NextResponse.json({ discount: 0 });
  }
}
