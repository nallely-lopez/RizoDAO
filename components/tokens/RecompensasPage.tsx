"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAccesly } from "accesly";
import Link from "next/link";

type TxHistorial = {
  id: string;
  amount: number;
  type: string;
  reason: string;
  createdAt: string;
};

type RewardsData = {
  tokens: number;
  totalGanado: number;
  totalGastado: number;
  historial: TxHistorial[];
};

const acciones = [
  { icono: "📝", titulo: "Publica en la comunidad", tokens: 5,  desc: "Comparte fotos, tips o preguntas" },
  { icono: "💬", titulo: "Comenta publicaciones",   tokens: 2,  desc: "Interactua con otros rizados" },
  { icono: "⭐", titulo: "Escribe una resena",       tokens: 10, desc: "Califica un producto que hayas usado" },
  { icono: "👤", titulo: "Completa tu perfil",       tokens: 20, desc: "Agrega foto, bio y tipo de rizo" },
  { icono: "📅", titulo: "Agenda una cita",          tokens: 15, desc: "Visita a un estilista verificado" },
];

const canjes = [
  { titulo: "Descuento 5%",   tokens: 100, desc: "En cualquier producto de la tienda" },
  { titulo: "Descuento 10%",  tokens: 200, desc: "En productos seleccionados" },
  { titulo: "Descuento 20%",  tokens: 400, desc: "En tu proxima cita con estilista" },
  { titulo: "Producto gratis",tokens: 800, desc: "Producto sorpresa para tu tipo de rizo" },
];

function formatFecha(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function RecompensasPage() {
  const { data: session } = useSession();
  const { wallet } = useAccesly();
  const [tab, setTab] = useState<"historial" | "ganar" | "canjear">("historial");
  const [data, setData] = useState<RewardsData | null>(null);
  const [cargando, setCargando] = useState(true);

  const userEmail = session?.user?.email || wallet?.email;
  const meta = 500;
  const tokens = data?.tokens ?? 0;
  const porcentaje = Math.min((tokens / meta) * 100, 100);

  useEffect(() => {
    if (!userEmail) { setCargando(false); return; }
    fetch(`/api/user/rewards?email=${encodeURIComponent(userEmail)}`)
      .then((r) => r.json())
      .then((d) => { if (d.tokens !== undefined) setData(d); })
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [userEmail]);

  if (!userEmail) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-[#A1887F] text-sm mb-4">Inicia sesion para ver tus recompensas</p>
        <Link href="/login"
          className="bg-[#8D6E63] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#6D4C41] transition-colors">
          Iniciar sesion
        </Link>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#8D6E63] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

      {/* Header balance */}
      <div className="bg-white rounded-3xl p-8 border border-[#D7CCC8] mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-[#A1887F] uppercase tracking-wider mb-1">Mis tokens RIZO</p>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold text-[#8D6E63]"
                style={{ fontFamily: "var(--font-playfair)" }}>
                {tokens}
              </span>
              <span className="text-sm text-[#A1887F] mb-2">tokens</span>
            </div>
            <p className="text-xs text-[#A1887F] mt-2">
              {tokens >= meta
                ? <span className="text-[#0F6E56] font-semibold">¡Ya alcanzaste el nivel Pro! 🎉</span>
                : <>Te faltan <span className="text-[#8D6E63] font-semibold">{meta - tokens} tokens</span> para tu proximo descuento</>
              }
            </p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs text-[#A1887F] mb-2">
              <span>Progreso al siguiente nivel</span>
              <span>{tokens}/{meta}</span>
            </div>
            <div className="h-3 rounded-full bg-[#FAF8F5] overflow-hidden">
              <div className="h-full rounded-full bg-[#8D6E63] transition-all"
                style={{ width: `${porcentaje}%` }} />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-[#8D6E63] font-medium">Nivel Rizo</span>
              <span className="text-[#A1887F]">Nivel Pro</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#FAF8F5]">
          {[
            { label: "Tokens ganados",    valor: data?.totalGanado ?? 0 },
            { label: "Tokens gastados",   valor: data?.totalGastado ?? 0 },
            { label: "Transacciones",     valor: data?.historial?.length ?? 0 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-[#3E2723]"
                style={{ fontFamily: "var(--font-playfair)" }}>
                {stat.valor}
              </p>
              <p className="text-xs text-[#A1887F] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-[#D7CCC8] mb-6">
        {[
          { id: "historial", label: "Historial" },
          { id: "ganar",     label: "Como ganar" },
          { id: "canjear",   label: "Canjear" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: tab === t.id ? "#8D6E63" : "transparent",
              color: tab === t.id ? "white" : "#A1887F",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Historial real */}
      {tab === "historial" && (
        <>
          {(!data?.historial || data.historial.length === 0) ? (
            <div className="bg-white rounded-2xl border border-[#D7CCC8] p-12 text-center">
              <span className="text-4xl mb-4 block">🪙</span>
              <p className="text-sm font-semibold text-[#3E2723]">Sin transacciones aun</p>
              <p className="text-xs text-[#A1887F] mt-1">Participa en la comunidad para ganar tokens</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#D7CCC8] overflow-hidden">
              {data.historial.map((item, i) => {
                const esGanado = item.amount > 0;
                return (
                  <div key={item.id}
                    className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: i < data.historial.length - 1 ? "1px solid #FAF8F5" : "none" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: esGanado ? "#E1F5EE" : "#FBEAF2" }}>
                        <span className="text-xs font-bold"
                          style={{ color: esGanado ? "#0F6E56" : "#993556" }}>
                          {esGanado ? "+" : "-"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-[#3E2723]">{item.reason}</p>
                        <p className="text-xs text-[#A1887F]">{formatFecha(item.createdAt)}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold"
                      style={{ color: esGanado ? "#0F6E56" : "#8D6E63" }}>
                      {esGanado ? "+" : ""}{item.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Como ganar */}
      {tab === "ganar" && (
        <div className="flex flex-col gap-3">
          {acciones.map((accion) => (
            <div key={accion.titulo}
              className="bg-white rounded-2xl border border-[#D7CCC8] p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-2xl">
                  {accion.icono}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3E2723]">{accion.titulo}</p>
                  <p className="text-xs text-[#A1887F] mt-0.5">{accion.desc}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-lg font-bold text-[#8D6E63]"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  +{accion.tokens}
                </span>
                <span className="text-xs text-[#A1887F]">tokens</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Canjear */}
      {tab === "canjear" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {canjes.map((canje) => {
            const puedesCanjear = tokens >= canje.tokens;
            return (
              <div key={canje.titulo}
                className="bg-white rounded-2xl border border-[#D7CCC8] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-[#3E2723]"
                    style={{ fontFamily: "var(--font-playfair)" }}>
                    {canje.titulo}
                  </h3>
                  <span className="text-sm font-bold text-[#8D6E63] bg-[#EFEBE9] px-3 py-1 rounded-full">
                    {canje.tokens} tokens
                  </span>
                </div>
                <p className="text-xs text-[#A1887F]">{canje.desc}</p>
                <button
                  disabled={!puedesCanjear}
                  className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: puedesCanjear ? "#8D6E63" : "#FAF8F5",
                    color: puedesCanjear ? "white" : "#BCAAA4",
                    cursor: puedesCanjear ? "pointer" : "not-allowed",
                  }}>
                  {puedesCanjear ? "Canjear ahora" : `Faltan ${canje.tokens - tokens} tokens`}
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
