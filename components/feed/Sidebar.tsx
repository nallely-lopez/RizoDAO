"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAccesly } from "accesly";
import Link from "next/link";

const sugerencias = [
  { nombre: "Rizos con Valeria", handle: "@valeria.rizos", tipo: "estilista", avatar: "V" },
  { nombre: "CurlsMX", handle: "@curlsmx", tipo: "marca", avatar: "C" },
  { nombre: "Sofía Ondas", handle: "@sofia.ondas", tipo: "rizada", avatar: "S" },
];

const badgeColor: Record<string, { bg: string; text: string; label: string }> = {
  marca: { bg: "#EEEDFE", text: "#534AB7", label: "Marca" },
  estilista: { bg: "#E1F5EE", text: "#0F6E56", label: "Estilista" },
  rizada: { bg: "#FBEAF2", text: "#993556", label: "Rizada" },
};

const NEXT_MILESTONE = 500;

export default function Sidebar() {
  const { data: session } = useSession();
  const { wallet } = useAccesly();
  const [tokens, setTokens] = useState<number | null>(null);

  const userEmail = session?.user?.email || wallet?.email;

  useEffect(() => {
    if (!userEmail) return;
    fetch(`/api/user/me?email=${encodeURIComponent(userEmail)}`)
      .then((r) => r.json())
      .then((data) => { if (typeof data.tokens === "number") setTokens(data.tokens); })
      .catch(() => {});
  }, [userEmail]);

  const progress = tokens !== null ? Math.min((tokens / NEXT_MILESTONE) * 100, 100) : 0;
  const tokensRestantes = tokens !== null ? Math.max(NEXT_MILESTONE - tokens, 0) : null;

  return (
    <aside className="flex flex-col gap-4">

      {/* Token balance */}
      <div className="bg-white rounded-2xl p-5 border border-[#D7CCC8]">
        <p className="text-xs text-[#A1887F] mb-1">Mis tokens</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-[#8D6E63]"
            style={{ fontFamily: "var(--font-playfair)" }}>
            {tokens !== null ? tokens : "—"}
          </span>
          <span className="text-xs text-[#A1887F] mb-1">RIZO tokens</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-[#FAF8F5] overflow-hidden">
          <div className="h-full rounded-full bg-[#8D6E63] transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-[#A1887F] mt-1.5">
          {tokensRestantes !== null
            ? tokensRestantes > 0
              ? `${tokensRestantes} tokens para tu próximo descuento`
              : "¡Tienes suficientes tokens para un descuento!"
            : "Inicia sesión para ver tus tokens"}
        </p>
        <Link href="/recompensas">
          <button className="mt-3 w-full border border-[#8D6E63] text-[#8D6E63] py-2 rounded-xl text-xs font-medium hover:bg-[#8D6E63] hover:text-white transition-colors">
            Canjear tokens
          </button>
        </Link>
      </div>

      {/* Sugerencias */}
      <div className="bg-white rounded-2xl p-5 border border-[#D7CCC8]">
        <p className="text-sm font-semibold text-[#3E2723] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Sugerencias para ti
        </p>
        <div className="flex flex-col gap-4">
          {sugerencias.map((u) => (
            <div key={u.handle} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#D7CCC8] flex items-center justify-center text-sm font-bold text-[#8D6E63]">
                  {u.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#3E2723]">{u.nombre}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: badgeColor[u.tipo].bg, color: badgeColor[u.tipo].text }}>
                      {badgeColor[u.tipo].label}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-xs text-[#8D6E63] font-medium hover:underline">
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tipos de rizo */}
      <div className="bg-white rounded-2xl p-5 border border-[#D7CCC8]">
        <p className="text-sm font-semibold text-[#3E2723] mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Explorar por tipo
        </p>
        <div className="flex flex-wrap gap-2">
          {["2A Ondulado", "2B Ondulado", "3A Rizado", "3B Rizado", "3C Muy rizado", "4A Afro"].map((tipo) => (
            <button key={tipo}
              className="text-xs px-3 py-1.5 rounded-full bg-[#FAF8F5] text-[#6D4C41] hover:bg-[#D7CCC8] transition-colors">
              {tipo}
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}
