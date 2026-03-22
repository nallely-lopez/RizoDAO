import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as StellarSdk from "@stellar/stellar-sdk";

const prisma = new PrismaClient();
const testnet = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
// Issuer mainnet de USDC (Circle) — solo para obtener el precio real XLM/USD
const USDC_ISSUER_MAINNET = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { stellarPublicKey: true },
  });

  const stellarAddress = user?.stellarPublicKey ?? null;
  let xlm = 0;
  let usdc = 0;

  if (stellarAddress) {
    try {
      const account = await testnet.loadAccount(stellarAddress);
      for (const b of account.balances) {
        if (b.asset_type === "native") {
          xlm = parseFloat(b.balance);
        } else if (
          b.asset_type === "credit_alphanum4" &&
          b.asset_code === "USDC" &&
          b.asset_issuer === USDC_ISSUER
        ) {
          usdc = parseFloat(b.balance);
        }
      }
    } catch {
      // Cuenta aún no fondeada en testnet
    }
  }

  // Precio XLM/USDC desde el order book de mainnet (más fiable que testnet sin liquidez)
  // selling=native(XLM), buying=USDC → asks[0].price = USDC por 1 XLM
  let xlmPerUsdc = 8; // fallback: ~1 XLM = $0.125
  try {
    const res = await fetch(
      `https://horizon.stellar.org/order_book?selling_asset_type=native` +
      `&buying_asset_type=credit_alphanum4&buying_asset_code=USDC` +
      `&buying_asset_issuer=${USDC_ISSUER_MAINNET}&limit=1`
    );
    const book = await res.json();
    if (book.asks?.length > 0) {
      const usdcPerXlm = parseFloat(book.asks[0].price);
      if (usdcPerXlm > 0) xlmPerUsdc = parseFloat((1 / usdcPerXlm).toFixed(4));
    }
  } catch {
    // Usar fallback
  }

  return NextResponse.json({ xlm, usdc, stellarAddress, xlmPerUsdc });
}
