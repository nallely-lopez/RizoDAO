"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAccesly } from "accesly";
import { ArrowLeft, Zap, AlertCircle } from "lucide-react";

type Producto = {
  id: string;
  nombre: string;
  marca: string;
  precioMXN: number;
  precioUSDC: number;
  imagen: string;
  tokens: number;
};

type Balances = {
  xlm: number;
  usdc: number;
  stellarAddress: string | null;
  xlmPerUsdc: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { wallet, connect } = useAccesly();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [balances, setBalances] = useState<Balances | null>(null);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [paymentAsset, setPaymentAsset] = useState<"USDC" | "XLM">("XLM");
  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState<string | null>(null);

  const userEmail = session?.user?.email || wallet?.email;
  const estaLogueado = !!userEmail;

  useEffect(() => {
    const stored = sessionStorage.getItem("productoSeleccionado");
    if (stored) {
      setProducto(JSON.parse(stored));
    } else {
      router.replace("/tienda");
    }
  }, [router]);

  // Cargar balances Stellar cuando tengamos email y producto
  useEffect(() => {
    if (!userEmail || !producto) return;
    setLoadingBalances(true);
    fetch(`/api/user/balances?email=${encodeURIComponent(userEmail)}`)
      .then((r) => r.json())
      .then((data: Balances) => {
        setBalances(data);
        // Auto-seleccionar el mejor método disponible
        if (data.usdc >= producto.precioUSDC) {
          setPaymentAsset("USDC");
        } else {
          setPaymentAsset("XLM");
        }
      })
      .catch(() => {})
      .finally(() => setLoadingBalances(false));
  }, [userEmail, producto?.id]);

  const precioXLM = producto && balances
    ? parseFloat((producto.precioUSDC * balances.xlmPerUsdc).toFixed(7))
    : 0;

  const tieneUsdcSuficiente = (balances?.usdc ?? 0) >= (producto?.precioUSDC ?? 0);
  // Reservar ~2 XLM para fees y reserva mínima de cuenta
  const tieneXlmSuficiente = (balances?.xlm ?? 0) >= precioXLM + 2;

  const handlePagar = async () => {
    if (!userEmail || !producto) return;
    setPagando(true);
    setErrorPago(null);

    try {
      const res = await fetch("/api/pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          productName: producto.nombre,
          precioUSDC: producto.precioUSDC,
          tokensGanados: producto.tokens,
          paymentAsset,
          precioXLM,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorPago(data.error || "Error al procesar el pago");
        return;
      }

      sessionStorage.setItem(
        "pagoExitoso",
        JSON.stringify({
          txHash: data.txHash,
          txOnChain: data.txOnChain,
          producto: producto.nombre,
          precioUSDC: producto.precioUSDC,
          tokens: data.tokensGanados,
        })
      );

      router.push("/pago-exitoso");
    } catch {
      setErrorPago("Error de conexion. Intenta de nuevo.");
    } finally {
      setPagando(false);
    }
  };

  if (!producto) return null;

  const pagoDeshabilitado = pagando ||
    (paymentAsset === "USDC" && !tieneUsdcSuficiente) ||
    (paymentAsset === "XLM" && !tieneXlmSuficiente);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* Header */}
      <header className="bg-white border-b border-[#D7CCC8] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full border border-[#D7CCC8] flex items-center justify-center hover:bg-[#EFEBE9] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#6D4C41]" />
          </button>
          <h1
            className="text-lg font-semibold text-[#3E2723]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Checkout
          </h1>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">

        {/* Resumen del producto */}
        <div className="bg-white rounded-2xl border border-[#D7CCC8] p-5">
          <h3
            className="text-base font-semibold text-[#3E2723] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Resumen de compra
          </h3>
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-xl bg-[#EFEBE9] overflow-hidden flex-shrink-0">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' fill='%23EFEBE9'%3E%3Crect width='96' height='96'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='28'%3E%F0%9F%A7%B4%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#A1887F] mb-0.5">{producto.marca}</p>
              <h4
                className="text-sm font-semibold text-[#3E2723] leading-snug mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {producto.nombre}
              </h4>
              <p className="text-xl font-bold text-[#8D6E63]">${producto.precioUSDC} USDC</p>
              <p className="text-xs text-[#A1887F]">≈ ${producto.precioMXN} MXN</p>
            </div>
          </div>
        </div>

        {/* Tokens que ganará */}
        <div className="bg-gradient-to-br from-[#EFEBE9] to-[#D7CCC8] rounded-2xl p-5 border border-[#BCAAA4]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6D4C41] mb-1">Ganarás en esta compra</p>
              <p
                className="text-2xl font-bold text-[#8D6E63]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                +{producto.tokens} tokens RIZO
              </p>
              <p className="text-xs text-[#A1887F] mt-0.5">
                500 tokens = 10% · 1,000 tokens = envío gratis
              </p>
            </div>
            <span className="text-4xl">🎁</span>
          </div>
        </div>

        {/* Selector de método de pago */}
        {estaLogueado && (
          <div className="bg-white rounded-2xl border border-[#D7CCC8] p-5">
            <h3
              className="text-sm font-semibold text-[#3E2723] mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Método de pago
            </h3>

            {loadingBalances ? (
              <div className="flex justify-center py-4">
                <span className="w-5 h-5 border-2 border-[#8D6E63] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-3">

                  {/* Opción USDC */}
                  <button
                    onClick={() => setPaymentAsset("USDC")}
                    disabled={!tieneUsdcSuficiente}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      paymentAsset === "USDC"
                        ? "border-[#8D6E63] bg-[#EFEBE9]"
                        : tieneUsdcSuficiente
                        ? "border-[#D7CCC8] hover:border-[#8D6E63]"
                        : "border-[#D7CCC8] opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <p className="text-xs font-bold text-[#3E2723] mb-1">USDC</p>
                    <p className="text-base font-bold text-[#8D6E63]">${producto.precioUSDC}</p>
                    <p className={`text-xs mt-1.5 ${tieneUsdcSuficiente ? "text-green-600" : "text-red-500"}`}>
                      Saldo: {(balances?.usdc ?? 0).toFixed(2)}
                    </p>
                  </button>

                  {/* Opción XLM */}
                  <button
                    onClick={() => setPaymentAsset("XLM")}
                    disabled={!tieneXlmSuficiente}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      paymentAsset === "XLM"
                        ? "border-[#8D6E63] bg-[#EFEBE9]"
                        : tieneXlmSuficiente
                        ? "border-[#D7CCC8] hover:border-[#8D6E63]"
                        : "border-[#D7CCC8] opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <p className="text-xs font-bold text-[#3E2723] mb-1">XLM</p>
                    <p className="text-base font-bold text-[#8D6E63]">~{precioXLM.toFixed(2)}</p>
                    <p className={`text-xs mt-1.5 ${tieneXlmSuficiente ? "text-green-600" : "text-red-500"}`}>
                      Saldo: {(balances?.xlm ?? 0).toFixed(2)}
                    </p>
                  </button>
                </div>

                {balances && (
                  <p className="text-xs text-[#A1887F] text-center">
                    1 USDC ≈ {balances.xlmPerUsdc.toFixed(2)} XLM · precio mercado
                  </p>
                )}

                {/* Instrucciones USDC cuando no tiene suficiente */}
                {paymentAsset === "USDC" && !tieneUsdcSuficiente && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-amber-700">Cómo agregar USDC testnet con Freighter</p>
                    <ol className="text-xs text-amber-600 space-y-1 list-decimal list-inside">
                      <li>Abre Freighter → <strong>Manage Assets</strong></li>
                      <li>Añade asset: código <code className="bg-amber-100 px-1 rounded">USDC</code></li>
                      <li>Issuer: <code className="bg-amber-100 px-1 rounded text-[10px] break-all">GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5</code></li>
                      <li>Intercambia XLM por USDC en el DEX de Stellar testnet</li>
                    </ol>
                    <button
                      onClick={() => setPaymentAsset("XLM")}
                      className="w-full mt-1 text-xs text-amber-700 font-semibold border border-amber-300 rounded-lg py-1.5 hover:bg-amber-100 transition-colors"
                    >
                      Mejor opción: pagar con XLM →
                    </button>
                  </div>
                )}

                {/* Faucet XLM si no tiene suficiente */}
                {paymentAsset === "XLM" && !tieneXlmSuficiente && balances?.stellarAddress && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-1.5">Tu wallet no tiene suficiente XLM</p>
                    <a
                      href={`https://friendbot.stellar.org?addr=${balances.stellarAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Obtener XLM gratis del faucet de Stellar
                    </a>
                    <p className="text-xs text-blue-500 mt-1.5 text-center">
                      Recarga la página después de fondear.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Desglose del total */}
        <div className="bg-white rounded-2xl border border-[#D7CCC8] p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A1887F]">Subtotal</span>
              <span className="text-sm font-medium text-[#3E2723]">
                {paymentAsset === "XLM"
                  ? `~${precioXLM.toFixed(2)} XLM`
                  : `$${producto.precioUSDC} USDC`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A1887F]">Comision de red</span>
              <span className="text-sm font-medium text-green-600">$0.00</span>
            </div>
            <div className="border-t border-[#EFEBE9] pt-3 flex items-center justify-between">
              <span className="font-semibold text-[#3E2723]">Total</span>
              <span
                className="text-xl font-bold text-[#8D6E63]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {paymentAsset === "XLM"
                  ? `~${precioXLM.toFixed(2)} XLM`
                  : `$${producto.precioUSDC} USDC`}
              </span>
            </div>
          </div>
        </div>

        {/* Error de pago */}
        {errorPago && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{errorPago}</p>
          </div>
        )}

        {/* Botón principal */}
        {!estaLogueado ? (
          <button
            onClick={connect}
            className="w-full flex items-center justify-center gap-2 bg-[#8D6E63] text-white py-4 rounded-2xl text-base font-semibold hover:bg-[#6D4C41] transition-colors"
          >
            Conecta tu wallet para pagar
          </button>
        ) : (
          <button
            onClick={handlePagar}
            disabled={pagoDeshabilitado}
            className="w-full flex items-center justify-center gap-2 bg-[#8D6E63] text-white py-4 rounded-2xl text-base font-semibold hover:bg-[#6D4C41] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pagando ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando pago...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                {paymentAsset === "XLM"
                  ? `Pagar ~${precioXLM.toFixed(2)} XLM`
                  : `Pagar $${producto.precioUSDC} USDC`}
              </>
            )}
          </button>
        )}

        <p className="text-xs text-center text-[#A1887F]">
          Pago seguro e instantaneo · Sin comisiones adicionales
        </p>
      </div>
    </div>
  );
}
