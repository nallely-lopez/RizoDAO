"use client";
import Link from "next/link";
import { useState } from "react";

const HERO_IMG = "https://img.freepik.com/vector-premium/retrato-chica-linda-rizada-expresion-feliz_1334819-52437.jpg";

export default function Hero() {
  const [imgError, setImgError] = useState(false);
  return (
    <section className="w-full bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">

        {/* Texto izquierda */}
        <div className="flex-1 flex flex-col gap-6">
          <p className="text-xs font-semibold tracking-widest text-[#8D6E63] uppercase">
            Comunidad · Tienda · Recompensas
          </p>

          <h1
            className="text-4xl md:text-6xl font-bold leading-tight text-[#3E2723]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Tu rizo, tu poder,{" "}
            <span className="text-[#8D6E63]">tu comunidad</span>
          </h1>

          <p className="text-base md:text-lg text-[#6D4C41] leading-relaxed max-w-md">
            El ecosistema donde las personas con cabello rizado encuentran
            productos confiables, conectan con su comunidad y son
            recompensadas por participar.
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/registro"
              className="bg-[#8D6E63] text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-[#6D4C41] transition-colors"
            >
              Quiero acceso anticipado
            </Link>
            <Link
              href="#marcas"
              className="border border-[#8D6E63] text-[#8D6E63] px-7 py-3 rounded-full text-sm font-medium hover:bg-[#8D6E63] hover:text-white transition-colors"
            >
              Soy una marca
            </Link>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-5 mt-2">
            {[
              { color: "#8D6E63", label: "Tokens en Stellar" },
              { color: "#C89B4F", label: "Recompensas reales" },
              { color: "#9B7FA6", label: "100% curado" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-[#6D4C41]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Imagen derecha */}
        <div className="flex-1 w-full max-w-md">
          <div className="w-full h-80 md:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#8D6E63] to-[#4E342E]">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="text-5xl font-bold text-white opacity-30"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  RIZO
                </span>
              </div>
            ) : (
              <img
                src={HERO_IMG}
                alt="Persona con cabello rizado"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>

      </div>
    </section>
  );
}