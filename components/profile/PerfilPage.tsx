"use client";
import { useState } from "react";

const publicaciones = [
  { id: 1, contenido: "Por fin encontre la rutina perfecta para mis rizos 3B!", likes: 42, comentarios: 8, tiempo: "hace 2 dias" },
  { id: 2, contenido: "Tips para el verano: hidratacion es clave. Uso mascarilla 2 veces por semana y mis rizos estan increibles.", likes: 67, comentarios: 15, tiempo: "hace 5 dias" },
  { id: 3, contenido: "Probando el nuevo gel de CurlsMX. Primeras impresiones: definicion increible sin efecto casco.", likes: 89, comentarios: 23, tiempo: "hace 1 semana" },
];

const resenas = [
  { id: 1, producto: "Gel Definidor Fuerte", marca: "CurlsMX", calificacion: 5, texto: "El mejor gel que he probado para mis rizos 3B. Dura todo el dia sin reseca.", fecha: "hace 3 dias" },
  { id: 2, producto: "Mascarilla Hidratante", marca: "Rizos con Valeria", calificacion: 5, texto: "Transformo mis rizos completamente. Los siento suaves y definidos.", fecha: "hace 1 semana" },
];

export default function PerfilPage() {
  const [tab, setTab] = useState<"publicaciones" | "resenas" | "guardados">("publicaciones");

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

      {/* Portada */}
      <div className="relative mb-16">
        <div className="w-full h-48 rounded-3xl bg-gradient-to-br from-[#E8DDD0] via-[#DDD0BC] to-[#C4A882]"></div>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-8">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-[#C4522A] flex items-center justify-center shadow-md">
            <span className="text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair)" }}>M</span>
          </div>
        </div>

        {/* Boton editar */}
        <div className="absolute bottom-4 right-4">
          <button className="bg-white border border-[#EDE4D8] text-[#3d3d3d] px-4 py-2 rounded-full text-xs font-medium hover:bg-[#F5F0EA] transition-colors">
            Editar perfil
          </button>
        </div>
      </div>

      {/* Info perfil */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Mariana Lopez
          </h1>
          <p className="text-sm text-[#9a9a9a]">@mariana.rizos</p>
          <p className="text-sm text-[#5a5a5a] mt-2 max-w-md">
            Rizos 3B apasionada del metodo CGM. Comparto rutinas, productos y tips para el cabello rizado.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FBEAF2] text-[#993556] font-medium">
              Rizada
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F0EA] text-[#5a5a5a]">
              Tipo 3B
            </span>
          </div>
        </div>

        {/* Tokens */}
        <div className="bg-white rounded-2xl border border-[#EDE4D8] px-6 py-4 flex flex-col items-center min-w-32">
          <p className="text-xs text-[#9a9a9a] mb-1">Mis tokens</p>
          <span className="text-3xl font-bold text-[#C4522A]"
            style={{ fontFamily: "var(--font-playfair)" }}>248</span>
          <span className="text-xs text-[#9a9a9a]">RIZO tokens</span>
          <button className="mt-2 text-xs text-[#C4522A] hover:underline">Ver recompensas</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl border border-[#EDE4D8] p-5 mb-6">
        {[
          { label: "Publicaciones", valor: 24 },
          { label: "Seguidores", valor: 318 },
          { label: "Siguiendo", valor: 142 },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-[#1a1a1a]"
              style={{ fontFamily: "var(--font-playfair)" }}>
              {stat.valor}
            </p>
            <p className="text-xs text-[#9a9a9a] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-[#EDE4D8] mb-6">
        {[
          { id: "publicaciones", label: "Publicaciones" },
          { id: "resenas", label: "Resenas" },
          { id: "guardados", label: "Guardados" },
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

      {/* Publicaciones */}
      {tab === "publicaciones" && (
        <div className="flex flex-col gap-4">
          {publicaciones.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-[#EDE4D8] p-5">
              <p className="text-sm text-[#3d3d3d] leading-relaxed">{post.contenido}</p>
              <div className="flex items-center gap-5 mt-4 pt-3 border-t border-[#F5F0EA]">
                <span className="text-xs text-[#9a9a9a] flex items-center gap-1">
                  <span>♡</span> {post.likes}
                </span>
                <span className="text-xs text-[#9a9a9a] flex items-center gap-1">
                  <span>💬</span> {post.comentarios}
                </span>
                <span className="text-xs text-[#9a9a9a] ml-auto">{post.tiempo}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resenas */}
      {tab === "resenas" && (
        <div className="flex flex-col gap-4">
          {resenas.map((resena) => (
            <div key={resena.id} className="bg-white rounded-2xl border border-[#EDE4D8] p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-[#1a1a1a]">{resena.producto}</p>
                  <p className="text-xs text-[#9a9a9a]">{resena.marca}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-xs"
                      style={{ color: star <= resena.calificacion ? "#C89B4F" : "#EDE4D8" }}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-[#5a5a5a] leading-relaxed">{resena.texto}</p>
              <p className="text-xs text-[#9a9a9a] mt-2">{resena.fecha}</p>
            </div>
          ))}
        </div>
      )}

      {/* Guardados */}
      {tab === "guardados" && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-4xl mb-4">🔖</span>
          <p className="text-sm font-semibold text-[#1a1a1a]">No tienes guardados aun</p>
          <p className="text-xs text-[#9a9a9a] mt-1">Guarda publicaciones y productos para verlos aqui</p>
        </div>
      )}

    </div>
  );
}