"use client";
import { useState, useCallback, useEffect } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export type WalletEstado = {
  conectado: boolean;
  publicKey: string | null;
  balanceXLM: string;
  balanceUSDC: string;
  redNombre: string;
  cargando: boolean;
  error: string | null;
  conectar: () => Promise<void>;
  desconectar: () => void;
  refrescar: () => Promise<void>;
};

async function obtenerBalances(publicKey: string) {
  const server = new StellarSdk.Horizon.Server(HORIZON_URL);
  const account = await server.loadAccount(publicKey);

  let xlm = "0.00";
  let usdc = "0.00";

  for (const b of account.balances) {
    if (b.asset_type === "native") {
      xlm = parseFloat(b.balance).toFixed(2);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if ((b as any).asset_code === "USDC" && (b as any).asset_issuer === USDC_ISSUER) {
      usdc = parseFloat(b.balance).toFixed(2);
    }
  }

  return { xlm, usdc };
}

export function useWallet(): WalletEstado {
  const [conectado, setConectado] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balanceXLM, setBalanceXLM] = useState("0.00");
  const [balanceUSDC, setBalanceUSDC] = useState("0.00");
  const [redNombre, setRedNombre] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarBalances = useCallback(async (pk: string) => {
    try {
      const { xlm, usdc } = await obtenerBalances(pk);
      setBalanceXLM(xlm);
      setBalanceUSDC(usdc);
    } catch {
      // Cuenta sin fondos en testnet
      setBalanceXLM("0.00");
      setBalanceUSDC("0.00");
    }
  }, []);

  const refrescar = useCallback(async () => {
    if (publicKey) await cargarBalances(publicKey);
  }, [publicKey, cargarBalances]);

  const conectar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const freighter = await import("@stellar/freighter-api");

      // Verificar que la extensión esté instalada
      const { isConnected } = await freighter.isConnected();
      if (!isConnected) {
        setError("Freighter no está instalado. Descárgalo en freighter.app");
        return;
      }

      // Solicitar acceso (abre el popup de Freighter)
      const accessResult = await freighter.requestAccess();
      if (accessResult.error) {
        setError("Acceso denegado. Acepta la conexión en Freighter.");
        return;
      }

      const address = accessResult.address;
      if (!address) {
        setError("No se pudo obtener la dirección pública");
        return;
      }

      // Verificar que esté en testnet
      const networkResult = await freighter.getNetwork();
      const redActual = networkResult.network?.toUpperCase();
      if (redActual && redActual !== "TESTNET" && !networkResult.error) {
        setError(`Por favor cambia Freighter a Testnet (red actual: ${redActual})`);
        return;
      }

      setPublicKey(address);
      setConectado(true);
      setRedNombre("Testnet");
      sessionStorage.setItem("walletPublicKey", address);

      await cargarBalances(address);
    } catch {
      setError("Error inesperado al conectar con Freighter");
    } finally {
      setCargando(false);
    }
  }, [cargarBalances]);

  const desconectar = useCallback(() => {
    setConectado(false);
    setPublicKey(null);
    setBalanceXLM("0.00");
    setBalanceUSDC("0.00");
    setRedNombre("");
    setError(null);
    sessionStorage.removeItem("walletPublicKey");
  }, []);

  // Restaurar sesión al montar
  useEffect(() => {
    const stored = sessionStorage.getItem("walletPublicKey");
    if (!stored) return;

    import("@stellar/freighter-api")
      .then(async (freighter) => {
        const { isAllowed } = await freighter.isAllowed();
        if (!isAllowed) {
          sessionStorage.removeItem("walletPublicKey");
          return;
        }
        setPublicKey(stored);
        setConectado(true);
        setRedNombre("Testnet");
        await cargarBalances(stored);
      })
      .catch(() => {});
  }, [cargarBalances]);

  return {
    conectado,
    publicKey,
    balanceXLM,
    balanceUSDC,
    redNombre,
    cargando,
    error,
    conectar,
    desconectar,
    refrescar,
  };
}
