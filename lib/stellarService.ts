/**
 * stellarService.ts
 * Servicio para conectar Freighter y enviar USDC en la red Stellar TESTNET.
 */

import {
  Horizon,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  BASE_FEE,
  Memo,
} from "@stellar/stellar-sdk";

import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";

// ─── Configuración TESTNET ────────────────────────────────────────────────────

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const server = new Horizon.Server(HORIZON_URL);

/**
 * USDC en Stellar TESTNET.
 * Emisor oficial de Circle para TESTNET:
 *   https://stellar.expert/explorer/testnet/asset/USDC-GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
 */
const USDC_ISSUER_TESTNET =
  "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

export const USDC = new Asset("USDC", USDC_ISSUER_TESTNET);

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface WalletInfo {
  publicKey: string;
  network: string;
}

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface SendUSDCParams {
  /** Clave pública Stellar del destinatario */
  destination: string;
  /** Monto en USDC como string, p.ej. "20" */
  amount: string;
  /** Memo de texto opcional (máx 28 bytes) */
  memo?: string;
}

// ─── Verificación de Freighter ────────────────────────────────────────────────

export async function checkFreighterInstalled(): Promise<boolean> {
  const { isConnected: connected } = await isConnected();
  return connected;
}

export async function checkFreighterAllowed(): Promise<boolean> {
  const { isAllowed: allowed } = await isAllowed();
  return allowed;
}

// ─── Conexión de billetera ────────────────────────────────────────────────────

/**
 * Conecta Freighter y retorna la clave pública + red activa.
 */
export async function connectWallet(): Promise<WalletInfo> {
  const installed = await checkFreighterInstalled();
  if (!installed) {
    throw new Error(
      "Freighter no está instalado. Descárgalo en https://www.freighter.app"
    );
  }

  const accessResult = await requestAccess();
  if (accessResult.error) {
    throw new Error(`Acceso denegado: ${accessResult.error}`);
  }

  const addressResult = await getAddress();
  if (addressResult.error || !addressResult.address) {
    throw new Error("No se pudo obtener la dirección de Freighter.");
  }

  const networkResult = await getNetwork();
  if (networkResult.error) {
    throw new Error("No se pudo obtener la red activa en Freighter.");
  }

  const activeNetwork = networkResult.network ?? "";

  if (
    activeNetwork !== "TESTNET" &&
    networkResult.networkPassphrase !== NETWORK_PASSPHRASE
  ) {
    console.warn(
      `⚠️  Freighter está en "${activeNetwork}". Se esperaba TESTNET.`
    );
  }

  return {
    publicKey: addressResult.address,
    network: activeNetwork || "TESTNET",
  };
}

/**
 * Reconecta sin abrir popup: retorna la public key si ya estaba permitido.
 */
export async function getPublicKey(): Promise<string | null> {
  const allowed = await checkFreighterAllowed();
  if (!allowed) return null;
  const result = await getAddress();
  return result.address ?? null;
}

// ─── Saldos ───────────────────────────────────────────────────────────────────

/**
 * Retorna el saldo XLM de una cuenta (necesario para pagar comisiones).
 */
export async function getXLMBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    const bal = account.balances.find((b) => b.asset_type === "native");
    return bal ? bal.balance : "0";
  } catch {
    return "0";
  }
}

/**
 * Retorna el saldo USDC de una cuenta en TESTNET.
 */
export async function getUSDCBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    const bal = account.balances.find(
      (b) =>
        b.asset_type === "credit_alphanum4" &&
        (b as Horizon.HorizonApi.BalanceLine<"credit_alphanum4">).asset_code ===
          "USDC" &&
        (b as Horizon.HorizonApi.BalanceLine<"credit_alphanum4">).asset_issuer ===
          USDC_ISSUER_TESTNET
    );
    return bal ? (bal as Horizon.HorizonApi.BalanceLine<"credit_alphanum4">).balance : "0";
  } catch {
    return "0";
  }
}

// ─── Envío de USDC ────────────────────────────────────────────────────────────

/**
 * Construye, firma con Freighter y envía USDC en TESTNET.
 */
export async function sendUSDC({
  destination,
  amount,
  memo,
}: SendUSDCParams): Promise<PaymentResult> {
  try {
    // 1. Obtener clave pública del remitente
    const addressResult = await getAddress();
    if (addressResult.error || !addressResult.address) {
      throw new Error("Freighter no está conectado.");
    }
    const sourcePublicKey = addressResult.address;

    // 2. Cargar cuenta fuente desde Horizon
    const sourceAccount = await server.loadAccount(sourcePublicKey);

    // 3. Construir la transacción
    const txBuilder = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.payment({
          destination,
          asset: USDC,
          amount,
        })
      )
      .setTimeout(180);

    if (memo) {
      txBuilder.addMemo(Memo.text(memo.slice(0, 28)));
    }

    const transaction = txBuilder.build();
    const transactionXDR = transaction.toXDR();

    // 4. Firmar con Freighter (abre popup de confirmación al usuario)
    const signResult = await signTransaction(transactionXDR, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    if (signResult.error || !signResult.signedTxXdr) {
      throw new Error(
        signResult.error ?? "El usuario canceló la firma."
      );
    }

    // 5. Deserializar y enviar a Horizon
    const { TransactionBuilder: TB } = await import("@stellar/stellar-sdk");
    const signedTx = TB.fromXDR(signResult.signedTxXdr, NETWORK_PASSPHRASE);
    const response = await server.submitTransaction(signedTx);

    return { success: true, txHash: response.hash };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error desconocido al enviar USDC.";

    const horizonErr = err as {
      response?: { data?: { extras?: { result_codes?: unknown } } };
    };
    if (horizonErr.response?.data?.extras?.result_codes) {
      console.error(
        "Horizon result_codes:",
        horizonErr.response.data.extras.result_codes
      );
    }

    return { success: false, error: message };
  }
}

// ─── Utilidades TESTNET ───────────────────────────────────────────────────────

/**
 * Fondea una cuenta nueva en TESTNET con el Friendbot de Stellar.
 */
export async function fundTestnetAccount(publicKey: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    );
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Agrega un trustline de USDC a la cuenta conectada.
 */
export async function addUSDCTrustline(): Promise<PaymentResult> {
  try {
    const addressResult = await getAddress();
    if (addressResult.error || !addressResult.address) {
      throw new Error("Freighter no está conectado.");
    }
    const publicKey = addressResult.address;
    const account = await server.loadAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(Operation.changeTrust({ asset: USDC }))
      .setTimeout(180)
      .build();

    const signResult = await signTransaction(tx.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    if (signResult.error || !signResult.signedTxXdr) {
      throw new Error(signResult.error ?? "Firma cancelada.");
    }

    const { TransactionBuilder: TB } = await import("@stellar/stellar-sdk");
    const signed = TB.fromXDR(signResult.signedTxXdr, NETWORK_PASSPHRASE);
    const response = await server.submitTransaction(signed);

    return { success: true, txHash: response.hash };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al agregar trustline.",
    };
  }
}
