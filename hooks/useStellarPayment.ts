/**
 * useStellarPayment.ts
 * Hook de React para conectar Freighter y pagar con USDC en Stellar TESTNET.
 */

import { useState, useCallback, useEffect } from "react";
import {
  connectWallet,
  getPublicKey,
  getXLMBalance,
  getUSDCBalance,
  sendUSDC,
  fundTestnetAccount,
  addUSDCTrustline,
  type WalletInfo,
  type PaymentResult,
  type SendUSDCParams,
} from "@/lib/stellarService";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type PaymentStatus =
  | "idle"
  | "connecting"
  | "sending"
  | "success"
  | "error";

interface StellarState {
  wallet: WalletInfo | null;
  /** Saldo XLM (para cubrir la comisión de red ~0.00001 XLM) */
  xlmBalance: string;
  /** Saldo USDC disponible */
  usdcBalance: string;
  status: PaymentStatus;
  error: string | null;
  txHash: string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStellarPayment(defaultDestination?: string) {
  const [state, setState] = useState<StellarState>({
    wallet: null,
    xlmBalance: "0",
    usdcBalance: "0",
    status: "idle",
    error: null,
    txHash: null,
  });

  const patch = (partial: Partial<StellarState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  // ── Auto-reconexión silenciosa al montar ────────────────────────────────────
  useEffect(() => {
    (async () => {
      const publicKey = await getPublicKey();
      if (publicKey) {
        const [xlmBalance, usdcBalance] = await Promise.all([
          getXLMBalance(publicKey),
          getUSDCBalance(publicKey),
        ]);
        patch({
          wallet: { publicKey, network: "TESTNET" },
          xlmBalance,
          usdcBalance,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Refresca ambos saldos ───────────────────────────────────────────────────
  const refreshBalances = useCallback(async (publicKey?: string) => {
    const key =
      publicKey ??
      (await getPublicKey().catch(() => null));
    if (!key) return;
    const [xlmBalance, usdcBalance] = await Promise.all([
      getXLMBalance(key),
      getUSDCBalance(key),
    ]);
    patch({ xlmBalance, usdcBalance });
  }, []);

  // ── Conectar billetera ──────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    patch({ status: "connecting", error: null });
    try {
      const walletInfo = await connectWallet();
      await refreshBalances(walletInfo.publicKey);
      patch({ wallet: walletInfo, status: "idle" });
    } catch (err) {
      patch({
        status: "error",
        error: err instanceof Error ? err.message : "Error al conectar.",
      });
    }
  }, [refreshBalances]);

  // ── Desconectar (limpia estado local) ──────────────────────────────────────
  const disconnect = useCallback(() => {
    setState({
      wallet: null,
      xlmBalance: "0",
      usdcBalance: "0",
      status: "idle",
      error: null,
      txHash: null,
    });
  }, []);

  // ── Enviar USDC ─────────────────────────────────────────────────────────────
  const send = useCallback(
    async (params?: Partial<SendUSDCParams>): Promise<PaymentResult> => {
      const destination = params?.destination ?? defaultDestination;

      if (!destination) {
        const result = {
          success: false,
          error: "Falta la dirección destino.",
        };
        patch({ status: "error", error: result.error });
        return result;
      }

      patch({ status: "sending", error: null, txHash: null });

      const result = await sendUSDC({
        destination,
        amount: params?.amount ?? "10",
        memo: params?.memo ?? "Pago RIZO",
      });

      if (result.success) {
        patch({ status: "success", txHash: result.txHash ?? null });
        const key = await getPublicKey().catch(() => null);
        if (key) await refreshBalances(key);
      } else {
        patch({ status: "error", error: result.error ?? "Error al enviar." });
      }

      return result;
    },
    [defaultDestination, refreshBalances]
  );

  // ── Fondear cuenta TESTNET (Friendbot) ─────────────────────────────────────
  const fundAccount = useCallback(async (): Promise<boolean> => {
    if (!state.wallet) return false;
    const ok = await fundTestnetAccount(state.wallet.publicKey);
    if (ok) await refreshBalances(state.wallet.publicKey);
    return ok;
  }, [state.wallet, refreshBalances]);

  // ── Agregar trustline USDC ──────────────────────────────────────────────────
  const addTrustline = useCallback(async (): Promise<PaymentResult> => {
    patch({ status: "sending", error: null });
    const result = await addUSDCTrustline();
    if (result.success) {
      patch({ status: "idle" });
      const key = await getPublicKey().catch(() => null);
      if (key) await refreshBalances(key);
    } else {
      patch({ status: "error", error: result.error ?? "Error en trustline." });
    }
    return result;
  }, [refreshBalances]);

  // ── Reset ───────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    patch({ status: "idle", error: null, txHash: null });
  }, []);

  return {
    ...state,
    isConnected: !!state.wallet,
    isLoading:
      state.status === "connecting" || state.status === "sending",
    connect,
    disconnect,
    send,
    refreshBalances,
    fundAccount,
    addTrustline,
    reset,
  };
}
