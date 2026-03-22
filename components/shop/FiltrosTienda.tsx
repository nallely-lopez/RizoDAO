"use client";

type Props = {
  categoriaActiva: string;
  setCategoriaActiva: (c: string) => void;
  tipoRizoActivo: string;
  setTipoRizoActivo: (t: string) => void;
};

const categorias = ["Todos", "Shampoo", "Acondicionador", "Gel", "Crema", "Aceite", "Mascarilla"];
const tiposRizo = ["Todos", "2A", "2B", "3A", "3B", "3C", "4A", "4B", "4C"];

export default function FiltrosTienda({ categoriaActiva, setCategoriaActiva, tipoRizoActivo, setTipoRizoActivo }: Props) {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl p-5 border border-[#D7CCC8]">

      <div>
        <p className="text-xs font-semibold text-[#6D4C41] uppercase tracking-wider mb-3">Categoria</p>
        <div className="flex flex-col gap-1">
          {categorias.map((cat) => (
            <button key={cat} onClick={() => setCategoriaActiva(cat)}
              className="text-left text-sm px-3 py-2 rounded-xl transition-colors"
              style={{
                backgroundColor: categoriaActiva === cat ? "#EFEBE9" : "transparent",
                color: categoriaActiva === cat ? "#8D6E63" : "#6D4C41",
                fontWeight: categoriaActiva === cat ? 600 : 400,
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#FAF8F5] pt-4">
        <p className="text-xs font-semibold text-[#6D4C41] uppercase tracking-wider mb-3">Tipo de rizo</p>
        <div className="flex flex-wrap gap-2">
          {tiposRizo.map((tipo) => (
            <button key={tipo} onClick={() => setTipoRizoActivo(tipo)}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{
                borderColor: tipoRizoActivo === tipo ? "#8D6E63" : "#D7CCC8",
                backgroundColor: tipoRizoActivo === tipo ? "#EFEBE9" : "white",
                color: tipoRizoActivo === tipo ? "#8D6E63" : "#6D4C41",
              }}>
              {tipo}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}