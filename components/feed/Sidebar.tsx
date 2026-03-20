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

export default function Sidebar() {
  return (
    <aside className="flex flex-col gap-4">

      {/* Token balance */}
      <div className="bg-white rounded-2xl p-5 border border-[#EDE4D8]">
        <p className="text-xs text-[#9a9a9a] mb-1">Mis tokens</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-[#C4522A]"
            style={{ fontFamily: "var(--font-playfair)" }}>
            248
          </span>
          <span className="text-xs text-[#9a9a9a] mb-1">RIZO tokens</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-[#F5F0EA] overflow-hidden">
          <div className="h-full rounded-full bg-[#C4522A]" style={{ width: "62%" }}></div>
        </div>
        <p className="text-xs text-[#9a9a9a] mt-1.5">252 tokens para tu próximo descuento</p>
        <button className="mt-3 w-full border border-[#C4522A] text-[#C4522A] py-2 rounded-xl text-xs font-medium hover:bg-[#C4522A] hover:text-white transition-colors">
          Canjear tokens
        </button>
      </div>

      {/* Sugerencias */}
      <div className="bg-white rounded-2xl p-5 border border-[#EDE4D8]">
        <p className="text-sm font-semibold text-[#1a1a1a] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Sugerencias para ti
        </p>
        <div className="flex flex-col gap-4">
          {sugerencias.map((u) => (
            <div key={u.handle} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#EDE4D8] flex items-center justify-center text-sm font-bold text-[#C4522A]">
                  {u.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1a1a1a]">{u.nombre}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: badgeColor[u.tipo].bg, color: badgeColor[u.tipo].text }}>
                      {badgeColor[u.tipo].label}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-xs text-[#C4522A] font-medium hover:underline">
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tipos de rizo */}
      <div className="bg-white rounded-2xl p-5 border border-[#EDE4D8]">
        <p className="text-sm font-semibold text-[#1a1a1a] mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Explorar por tipo
        </p>
        <div className="flex flex-wrap gap-2">
          {["2A Ondulado", "2B Ondulado", "3A Rizado", "3B Rizado", "3C Muy rizado", "4A Afro"].map((tipo) => (
            <button key={tipo}
              className="text-xs px-3 py-1.5 rounded-full bg-[#F5F0EA] text-[#5a5a5a] hover:bg-[#EDE4D8] transition-colors">
              {tipo}
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}