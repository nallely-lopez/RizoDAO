"use client";
import { useState } from "react";
import { useAccesly } from "accesly";
import { useSession } from "next-auth/react";

type Props = {
  onPostCreado?: () => void;
};

export default function CreatePost({ onPostCreado }: Props) {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const { wallet } = useAccesly();
  const { data: session } = useSession();

  const userEmail = wallet?.email || session?.user?.email;
  const userInicial = wallet?.email?.[0]?.toUpperCase() 
    || session?.user?.name?.[0]?.toUpperCase() 
    || "R";
  const estaConectado = !!userEmail;

  const handlePublicar = async () => {
    if (!texto.trim() || !userEmail) return;
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: texto,
          userEmail,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTexto("");
        onPostCreado?.();
      }
    } catch (error) {
      console.error("Error publicando:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-[#EDE4D8]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EDE4D8] flex items-center justify-center text-lg font-bold text-[#C4522A]"
          style={{ fontFamily: "var(--font-playfair)" }}>
          {userInicial}
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={estaConectado ? "Que esta pasando con tu rizo hoy?" : "Conectate para publicar"}
          rows={2}
          disabled={!estaConectado}
          className="flex-1 bg-[#F5F0EA] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:ring-1 focus:ring-[#C4522A] resize-none transition-colors disabled:opacity-50"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-xs text-[#9a9a9a] hover:text-[#C4522A] transition-colors">
            <span>📷</span> Foto
          </button>
          <button className="flex items-center gap-1.5 text-xs text-[#9a9a9a] hover:text-[#C4522A] transition-colors">
            <span>🎥</span> Video
          </button>
        </div>
        <div className="flex items-center gap-2">
          {texto.trim() && (
            <span className="text-xs text-[#9a9a9a]">+5 tokens</span>
          )}
          <button
            onClick={handlePublicar}
            disabled={!texto.trim() || loading || !estaConectado}
            className="bg-[#C4522A] text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-[#A03E1E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}