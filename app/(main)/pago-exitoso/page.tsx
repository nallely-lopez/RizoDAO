"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Zap, Gift, ExternalLink, Copy, Check } from "lucide-react";

type ResultadoPago = {
  txHash: string;
  txOnChain: boolean;
  producto: string;
  precioUSDC: number;
  tokens: number;
};

const STELLAR_EXPERT_URL = "https://stellar.expert/explorer/testnet/tx";

export default function PagoExitosoPage() {
  const router = useRouter();
  const [resultado, setResultado] = useState<ResultadoPago | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("pagoExitoso");
    if (stored) {
      setResultado(JSON.parse(stored));
    }

    // Confetti café/beige
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import("canvas-confetti").then((mod: any) => {
      const fire = mod.default ?? mod;
      const end = Date.now() + 3000;
      const frame = () => {
        if (cancelled || Date.now() > end) return;
        fire({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#8D6E63", "#BCAAA4", "#D7CCC8", "#EFEBE9"] });
        fire({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#8D6E63", "#BCAAA4", "#D7CCC8", "#EFEBE9"] });
        requestAnimationFrame(frame);
      };
      frame();
    });

    return () => { cancelled = true; };
  }, []);

  const copiarHash = async () => {
    if (!resultado?.txHash) return;
    await navigator.clipboard.writeText(resultado.txHash);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Hash real de Stellar: 64 caracteres hex. Los hashes "rizo-..." son de demo.
  const esHashReal = resultado?.txOnChain === true && /^[0-9a-fA-F]{64}$/.test(resultado?.txHash ?? "");
  const hashCorto = esHashReal && resultado?.txHash
    ? `${resultado.txHash.slice(0, 8)}…${resultado.txHash.slice(-8)}`
    : "";

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">

        {/* Ícono de éxito */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-[#8D6E63] to-[#BCAAA4] rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center shadow">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Mensaje principal */}
        <div className="space-y-1">
          <h1
            className="text-3xl font-bold text-[#3E2723]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            ¡Pago completado!
          </h1>
          <p className="text-[#6D4C41]">
            Tu transacción fue procesada en segundos ⚡️
          </p>
        </div>

        {/* Detalles de la transacción */}
        <div className="bg-white rounded-2xl border border-[#D7CCC8] p-6 text-left space-y-4">
          <h3
            className="text-base font-semibold text-[#3E2723]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Detalles de la transacción
          </h3>
          <div className="space-y-3">
            {resultado?.producto && (
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-[#A1887F] shrink-0">Producto</span>
                <span className="text-sm font-medium text-[#3E2723] text-right line-clamp-2">
                  {resultado.producto}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A1887F]">Monto pagado</span>
              <span className="text-base font-bold text-[#8D6E63]">
                ${resultado?.precioUSDC ?? "—"} USDC
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A1887F]">Tiempo de pago</span>
              <span className="text-sm font-medium text-green-600">~3 segundos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A1887F]">Comisión de red</span>
              <span className="text-sm font-medium text-green-600">$0.00</span>
            </div>

            {/* Hash de la transacción */}
            <div className="pt-2 border-t border-[#EFEBE9]">
              {esHashReal ? (
                <>
                  <p className="text-xs text-[#A1887F] mb-2">Hash de transacción</p>
                  <div className="flex items-center gap-2 bg-[#FAF8F5] rounded-xl px-3 py-2 mb-2">
                    <span className="text-xs font-mono text-[#6D4C41] flex-1 truncate">
                      {hashCorto}
                    </span>
                    <button
                      onClick={copiarHash}
                      className="shrink-0 text-[#A1887F] hover:text-[#8D6E63] transition-colors"
                      title="Copiar hash completo"
                    >
                      {copiado ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <a
                    href={`${STELLAR_EXPERT_URL}/${resultado!.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#3E2723] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#6D4C41] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Ver en Stellar Explorer
                  </a>
                </>
              ) : (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  <span className="text-amber-600 text-base">🔬</span>
                  <div>
                    <p className="text-xs font-semibold text-amber-700">Pago simulado — Modo demo</p>
                    <p className="text-xs text-amber-600 mt-0.5">Sin USDC real en testnet. La compra y tokens son válidos.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tokens ganados */}
        <div className="bg-gradient-to-br from-[#EFEBE9] to-[#D7CCC8] rounded-2xl p-6 border-2 border-[#BCAAA4]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-[#8D6E63]" />
            <h3
              className="text-base font-semibold text-[#3E2723]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              ¡Ganaste recompensas!
            </h3>
          </div>
          <p
            className="text-5xl font-bold text-[#8D6E63] mb-1"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            +{resultado?.tokens ?? 100}
          </p>
          <p className="text-sm text-[#6D4C41] font-medium">tokens RIZO</p>
          <div className="mt-3 pt-3 border-t border-[#BCAAA4]/50 grid grid-cols-2 gap-2 text-xs text-[#6D4C41]">
            <div className="bg-white/50 rounded-lg p-2">
              <p className="font-semibold">500 tokens</p>
              <p className="text-[#A1887F]">10% de descuento</p>
            </div>
            <div className="bg-white/50 rounded-lg p-2">
              <p className="font-semibold">1,000 tokens</p>
              <p className="text-[#A1887F]">Envío gratis</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/recompensas")}
            className="w-full bg-[#8D6E63] text-white py-3.5 rounded-2xl text-sm font-semibold hover:bg-[#6D4C41] transition-colors"
          >
            Ver mis recompensas
          </button>
          <button
            onClick={() => router.push("/tienda")}
            className="w-full border-2 border-[#D7CCC8] text-[#6D4C41] py-3.5 rounded-2xl text-sm font-semibold hover:border-[#8D6E63] hover:text-[#8D6E63] transition-colors"
          >
            Seguir comprando
          </button>
        </div>

        <p className="text-xs text-[#A1887F]">
          Recibirás un correo con los detalles de tu compra
        </p>
      </div>
    </div>
  );
}
