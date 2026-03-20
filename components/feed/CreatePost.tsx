"use client";
import { useState } from "react";

export default function CreatePost() {
  const [texto, setTexto] = useState("");

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-[#EDE4D8]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EDE4D8] flex items-center justify-center text-lg font-bold text-[#C4522A]"
          style={{ fontFamily: "var(--font-playfair)" }}>
          R
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="¿Qué está pasando con tu rizo hoy?"
          rows={2}
          className="flex-1 bg-[#F5F0EA] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:ring-1 focus:ring-[#C4522A] resize-none transition-colors"
        />
      </div>
      <div className="flex items-center justify-between pl-13">
        <div className="flex items-center gap-3 ml-13">
          <button className="flex items-center gap-1.5 text-xs text-[#9a9a9a] hover:text-[#C4522A] transition-colors">
            <span>📷</span> Foto
          </button>
          <button className="flex items-center gap-1.5 text-xs text-[#9a9a9a] hover:text-[#C4522A] transition-colors">
            <span>🎥</span> Video
          </button>
        </div>
        <button
          disabled={!texto.trim()}
          className="bg-[#C4522A] text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-[#A03E1E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Publicar
        </button>
      </div>
    </div>
  );
}