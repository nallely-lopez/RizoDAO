import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as StellarSdk from "@stellar/stellar-sdk";

const prisma = new PrismaClient();

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new StellarSdk.Horizon.Server(HORIZON_URL);
const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
const USDC = new StellarSdk.Asset("USDC", USDC_ISSUER);

export async function POST(req: Request) {
  try {
    const { userEmail, productName, precioUSDC, tokensGanados, paymentAsset = "USDC", precioXLM } =
      await req.json();

    if (!userEmail || !productName) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const rizoWallet =
      process.env.NEXT_PUBLIC_RIZO_WALLET_ADDRESS ||
      process.env.STELLAR_ISSUER_PUBLIC_KEY!;

    let txHash = `rizo-${Date.now()}`;
    let txOnChain = false;

    // Intentar pago real en Stellar Testnet si el usuario tiene secret key
    if (user.stellarSecretKey && user.stellarPublicKey) {
      try {
        const keypair = StellarSdk.Keypair.fromSecret(user.stellarSecretKey);
        const account = await server.loadAccount(keypair.publicKey());

        const pagoAsset = paymentAsset === "XLM" ? StellarSdk.Asset.native() : USDC;
        const pagoAmount = paymentAsset === "XLM"
          ? Number(precioXLM).toFixed(7)
          : Number(precioUSDC).toFixed(7);

        const tx = new StellarSdk.TransactionBuilder(account, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: rizoWallet,
              asset: pagoAsset,
              amount: pagoAmount,
            })
          )
          .addMemo(StellarSdk.Memo.text("RIZO Tienda"))
          .setTimeout(30)
          .build();

        tx.sign(keypair);
        const result = await server.submitTransaction(tx);
        txHash = result.hash;
        txOnChain = true;
      } catch (stellarErr: any) {
        // En testnet el usuario probablemente no tiene USDC — es esperado
        // Registramos la compra igual (demo mode)
        const resultCodes = stellarErr?.response?.data?.extras?.result_codes;
        console.log(
          "[Pago Stellar] fallback a demo —",
          stellarErr?.message ?? stellarErr,
          resultCodes ? `| result_codes: ${JSON.stringify(resultCodes)}` : ""
        );
      }
    }

    // Registrar compra en BD
    const compra = await prisma.purchase.create({
      data: {
        userId: user.id,
        walletAddress: user.stellarPublicKey ?? "privy-user",
        productName,
        precioUSDC,
        tokensGanados,
        stellarTxHash: txHash,
      },
    });

    // Acreditar tokens
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { tokens: { increment: tokensGanados } },
    });

    await prisma.tokenTransaction.create({
      data: {
        userId: user.id,
        amount: tokensGanados,
        type: "COMPRA",
        reason: `Compra: ${productName}`,
        stellarTxHash: txHash,
      },
    });

    return NextResponse.json({
      success: true,
      txHash,
      txOnChain,
      tokensGanados,
      totalTokens: updatedUser.tokens,
      purchaseId: compra.id,
    });
  } catch (error) {
    console.error("[/api/pago]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
