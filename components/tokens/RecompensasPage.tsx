"use client";
import { useState } from "react";

const historial = [
  { id: 1, accion: "Publicaste en la comunidad", tokens: +5, fecha: "Hoy, 2:30 pm", tipo: "ganado" },
  { id: 2, accion: "Comentaste una publicacion", tokens: +2, fecha: "Hoy, 1:15 pm", tipo: "ganado" },
  { id: 3, accion: "Votaste un producto", tokens: -1, fecha: "Hoy, 12:00 pm", tipo: "gastado" },
  { id: 4, accion: "Escribiste una resena", tokens: +10, fecha: "Ayer, 5:00 pm", tipo: "ganado" },
  { id: 5, accion: "Completaste tu perfil", tokens: +20, fecha: "Ayer, 3:00 pm", tipo: "ganado" },
  { id: 6, accion: "Canjeaste descuento 10%", tokens: -50, fecha: "Hace 3 dias", tipo: "gastado" },
  { id: 7, accion: "Navegaste la plataforma", tokens: +3, fecha: "Hace 3 dias", tipo: "ganado" },
  { id: 8, accion: "Agendaste una cita", tokens: -30, fecha: "Hace 5 dias", tipo: "gastado" },
];

const acciones = [
  { icono: "📝", titulo: "Publica en la comunidad", tokens: 5, desc: "Comparte fotos, tips o preguntas" },
  { icono: "💬", titulo: "Comenta publicaciones", tokens: 2, desc: "Interactua con otros rizados" },
  { icono: "⭐", titulo: "Escribe una resena", tokens: 10, desc: "Califica un producto que hayas usado" },
  { icono: "👤", titulo: "Completa tu perfil", tokens: 20, desc: "Agrega foto, bio y tipo de rizo" },
  { icono: "📅", titulo: "Agenda una cita", tokens: 15, desc: "Visita a un estilista verificado" },
];

const canjes = [
  { titulo: "Descuento 5%", tokens: 100, desc: "En cualquier producto de la tienda" },
  { titulo: "Descuento 10%", tokens: 200, desc: "En productos seleccionados" },
  { titulo: "Descuento 20%", tokens: 400, desc: "En tu proxima cita con estilista" },
  { titulo: "Producto gratis", tokens: 800, desc: "Producto sorpresa para tu tipo de rizo" },
];

export default function RecompensasPage() {
  const [tab, setTab] = useState<"historial" | "ganar" | "canjear">("historial");
  const tokens = 248;
  const meta = 500;
  const porcentaje = Math.min((tokens / meta) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

      {/* Header balance */}
      <div className="bg-white rounded-3xl p-8 border border-[#EDE4D8] mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-[#9a9a9a] uppercase tracking-wider mb-1">Mis tokens RIZO</p>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold text-[#C4522A]"
                style={{ fontFamily: "var(--font-playfair)" }}>
                {tokens}
              </span>
              <span className="text-sm text-[#9a9a9a] mb-2">tokens</span>
            </div>
            <p className="text-xs text-[#9a9a9a] mt-2">
              Te faltan <span className="text-[#C4522A] font-semibold">{meta - tokens} tokens</span> para tu proximo descuento
            </p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs text-[#9a9a9a] mb-2">
              <span>Progreso al siguiente nivel</span>
              <span>{tokens}/{meta}</span>
            </div>
            <div className="h-3 rounded-full bg-[#F5F0EA] overflow-hidden">
              <div className="h-full rounded-full bg-[#C4522A] transition-all"
                style={{ width: `${porcentaje}%` }}>
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-[#C4522A] font-medium">Nivel Rizo</span>
              <span className="text-[#9a9a9a]">Nivel Pro</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#F5F0EA]">
          {[
            { label: "Tokens ganados", valor: 379 },
            { label: "Tokens gastados", valor: 131 },
            { label: "Canjes realizados", valor: 3 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-[#1a1a1a]"
                style={{ fontFamily: "var(--font-playfair)" }}>
                {stat.valor}
              </p>
              <p className="text-xs text-[#9a9a9a] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-[#EDE4D8] mb-6">
        {[
          { id: "historial", label: "Historial" },
          { id: "ganar", label: "Como ganar" },
          { id: "canjear", label: "Canjear" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: tab === t.id ? "#C4522A" : "transparent",
              color: tab === t.id ? "white" : "#9a9a9a",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Historial */}
      {tab === "historial" && (
        <div className="bg-white rounded-2xl border border-[#EDE4D8] overflow-hidden">
          {historial.map((item, i) => (
            <div key={item.id}
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: i < historial.length - 1 ? "1px solid #F5F0EA" : "none" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: item.tipo === "ganado" ? "#E1F5EE" : "#FBEAF2" }}>
                  <span className="text-xs">{item.tipo === "ganado" ? "+" : "-"}</span>
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a]">{item.accion}</p>
                  <p className="text-xs text-[#9a9a9a]">{item.fecha}</p>
                </div>
              </div>
              <span className="text-sm font-bold"
                style={{ color: item.tipo === "ganado" ? "#0F6E56" : "#C4522A" }}>
                {item.tokens > 0 ? "+" : ""}{item.tokens}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Como ganar */}
      {tab === "ganar" && (
        <div className="flex flex-col gap-3">
          {acciones.map((accion) => (
            <div key={accion.titulo}
              className="bg-white rounded-2xl border border-[#EDE4D8] p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F0EA] flex items-center justify-center text-2xl">
                  {accion.icono}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{accion.titulo}</p>
                  <p className="text-xs text-[#9a9a9a] mt-0.5">{accion.desc}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-lg font-bold text-[#C4522A]"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  +{accion.tokens}
                </span>
                <span className="text-xs text-[#9a9a9a]">tokens</span>
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
                className="bg-white rounded-2xl border border-[#EDE4D8] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-[#1a1a1a]"
                    style={{ fontFamily: "var(--font-playfair)" }}>
                    {canje.titulo}
                  </h3>
                  <span className="text-sm font-bold text-[#C4522A] bg-[#FDF5F2] px-3 py-1 rounded-full">
                    {canje.tokens} tokens
                  </span>
                </div>
                <p className="text-xs text-[#9a9a9a]">{canje.desc}</p>
                <button
                  disabled={!puedesCanjear}
                  className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: puedesCanjear ? "#C4522A" : "#F5F0EA",
                    color: puedesCanjear ? "white" : "#b0a89a",
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