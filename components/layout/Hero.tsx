import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-[#F5F0EA] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">

        {/* Texto izquierda */}
        <div className="flex-1 flex flex-col gap-6">
          <p className="text-xs font-semibold tracking-widest text-[#C4522A] uppercase">
            Comunidad · Tienda · Recompensas
          </p>

          <h1
            className="text-4xl md:text-6xl font-bold leading-tight text-[#1a1a1a]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Tu rizo, tu poder,{" "}
            <span className="text-[#C4522A]">tu comunidad</span>
          </h1>

          <p className="text-base md:text-lg text-[#5a5a5a] leading-relaxed max-w-md">
            El ecosistema donde las personas con cabello rizado encuentran
            productos confiables, conectan con su comunidad y son
            recompensadas por participar.
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/app/auth/registro"
              className="bg-[#C4522A] text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-[#A03E1E] transition-colors"
            >
              Quiero acceso anticipado
            </Link>
            <Link
              href="#marcas"
              className="border border-[#C4522A] text-[#C4522A] px-7 py-3 rounded-full text-sm font-medium hover:bg-[#C4522A] hover:text-white transition-colors"
            >
              Soy una marca
            </Link>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-5 mt-2">
            {[
              { color: "#C4522A", label: "Tokens en Stellar" },
              { color: "#C89B4F", label: "Recompensas reales" },
              { color: "#9B7FA6", label: "100% curado" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-[#5a5a5a]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Imagen derecha — placeholder con gradiente */}
        <div className="flex-1 w-full max-w-md">
          <div className="w-full h-80 md:h-[420px] rounded-3xl bg-gradient-to-br from-[#E8DDD0] via-[#DDD0BC] to-[#C4A882] flex items-center justify-center">
            <span
              className="text-5xl font-bold text-[#C4522A] opacity-20"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              RIZO
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}