/**
 * lib/loyaltyContract.ts
 * Cliente para el contrato Soroban RizoLoyalty en Stellar Testnet.
 * SERVER-SIDE ONLY — nunca importar desde componentes cliente.
 */

import {
  rpc as SorobanRpc,
  Contract,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Keypair,
  Address,
  nativeToScVal,
  scValToNative,
  Transaction,
} from "@stellar/stellar-sdk";

const SOROBAN_RPC = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;

function getContractId(): string {
  const id = process.env.LOYALTY_CONTRACT_ID;
  if (!id) throw new Error("LOYALTY_CONTRACT_ID no está configurado en .env.local");
  return id;
}

function getRpcServer(): SorobanRpc.Server {
  return new SorobanRpc.Server(SOROBAN_RPC, { allowHttp: false });
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

/** Construye, simula, ensambla, firma y envía una transacción de escritura. */
async function submitTx(
  methodName: string,
  args: ReturnType<typeof nativeToScVal>[],
  signerSecret: string
): Promise<void> {
  const server = getRpcServer();
  const keypair = Keypair.fromSecret(signerSecret);
  const account = await server.getAccount(keypair.publicKey());
  const contract = new Contract(getContractId());

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(methodName, ...args))
    .setTimeout(30)
    .build();

  // prepareTransaction = simula + ensambla footprint/auth en un paso
  const prepared = (await server.prepareTransaction(tx)) as Transaction;
  prepared.sign(keypair);

  const sendResult = await server.sendTransaction(prepared);
  if (sendResult.status === "ERROR") {
    throw new Error(`[loyalty] submitTx error: ${JSON.stringify(sendResult)}`);
  }

  // Esperar confirmación (máx ~20s)
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const response = await server.getTransaction(sendResult.hash);
    if (response.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) return;
    if (response.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
      throw new Error(`[loyalty] transacción fallida: ${sendResult.hash}`);
    }
  }
}

/** Simula una llamada de solo lectura y retorna el valor de retorno. */
async function simulateRead(
  methodName: string,
  args: ReturnType<typeof nativeToScVal>[]
): Promise<ReturnType<typeof scValToNative> | null> {
  const server = getRpcServer();
  // Usamos el issuer como fuente (siempre existe y está fondado)
  const issuerPublicKey = process.env.STELLAR_ISSUER_PUBLIC_KEY;
  if (!issuerPublicKey) throw new Error("STELLAR_ISSUER_PUBLIC_KEY no configurado");

  const account = await server.getAccount(issuerPublicKey);
  const contract = new Contract(getContractId());

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(methodName, ...args))
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  if (SorobanRpc.Api.isSimulationError(result)) {
    throw new Error(`[loyalty] simulateRead error: ${result.error}`);
  }

  if (!result.result?.retval) return null;
  return scValToNative(result.result.retval);
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Agrega tokens al usuario (requiere su clave secreta).
 */
export async function addTokens(
  userSecret: string,
  amount: number
): Promise<void> {
  const keypair = Keypair.fromSecret(userSecret);
  await submitTx(
    "add_tokens",
    [
      new Address(keypair.publicKey()).toScVal(),
      nativeToScVal(BigInt(amount), { type: "i128" }),
    ],
    userSecret
  );
}

/**
 * Retorna el balance de tokens on-chain del usuario.
 */
export async function getLoyaltyBalance(userPublicKey: string): Promise<number> {
  try {
    const val = await simulateRead("get_balance", [
      new Address(userPublicKey).toScVal(),
    ]);
    return val !== null ? Number(val) : 0;
  } catch {
    return 0;
  }
}

/**
 * Registra una compra y otorga tokens (1 token cada 10 MXN).
 * Fire-and-forget seguro: no lanza aunque falle.
 */
export async function registerPurchase(
  userSecret: string,
  amountMXN: number
): Promise<void> {
  const keypair = Keypair.fromSecret(userSecret);
  await submitTx(
    "register_purchase",
    [
      new Address(keypair.publicKey()).toScVal(),
      nativeToScVal(BigInt(amountMXN), { type: "i128" }),
    ],
    userSecret
  );
}

/**
 * Retorna el % de descuento del usuario: 0, 10 o 15.
 */
export async function checkDiscount(userPublicKey: string): Promise<number> {
  try {
    const val = await simulateRead("check_discount", [
      new Address(userPublicKey).toScVal(),
    ]);
    return val !== null ? Number(val) : 0;
  } catch {
    return 0;
  }
}

/**
 * Expira tokens del usuario si tiene < 2 compras en 30 días.
 * Usa la clave del issuer como firmante (expire_tokens no requiere auth del usuario).
 */
export async function expireUserTokens(
  userPublicKey: string,
  issuerSecret: string
): Promise<void> {
  await submitTx(
    "expire_tokens",
    [new Address(userPublicKey).toScVal()],
    issuerSecret
  );
}

/**
 * Retorna cuántas compras hizo el usuario en los últimos 30 días.
 */
export async function getPurchaseCount(userPublicKey: string): Promise<number> {
  try {
    const val = await simulateRead("get_purchase_count", [
      new Address(userPublicKey).toScVal(),
    ]);
    return val !== null ? Number(val) : 0;
  } catch {
    return 0;
  }
}
