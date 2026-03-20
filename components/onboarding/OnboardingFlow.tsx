"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const tiposCabello = [
  { id: "2a", titulo: "2A — Ondulado suave", desc: "Ondas ligeras en forma de S, cabello fino" },
  { id: "2b", titulo: "2B — Ondulado definido", desc: "Ondas mas marcadas, algo de volumen" },
  { id: "3a", titulo: "3A — Rizado amplio", desc: "Rizos grandes y definidos, muy elasticos" },
  { id: "3b", titulo: "3B — Rizado compacto", desc: "Rizos medianos con mucho volumen" },
  { id: "3c", titulo: "3C — Muy rizado", desc: "Rizos apretados tipo sacacorchos" },
  { id: "4a", titulo: "4A — Afro suave", desc: "Rizos muy apretados en forma de S" },
  { id: "4b", titulo: "4B — Afro angular", desc: "Patron en zigzag, muy denso" },
  { id: "4c", titulo: "4C — Afro compacto", desc: "El rizo mas apretado, maximo volumen" },
];

const roles = [
  { id: "rizada", titulo: "Soy Rizada/o", desc: "Quiero encontrar productos, conectar con la comunidad y ganar tokens.", color: "#FBEAF2" },
  { id: "marca", titulo: "Soy una Marca", desc: "Quiero publicar mis productos y conectar con mi comunidad.", color: "#EEEDFE" },
  { id: "estilista", titulo: "Soy Estilista", desc: "Quiero ofrecer mis servicios y aparecer en busquedas.", color: "#E1F5EE" },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [rol, setRol] = useState("");
  const [tipoCabello, setTipoCabello] = useState("");
  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");

  // Si el rol es rizada: 3 pasos (rol → tipo cabello → perfil)
  // Si el rol es marca/estilista: 2 pasos (rol → perfil)
  const totalPasos = rol === "rizada" ? 3 : 2;

  const handleContinuar = () => {
    if (paso === 1 && rol !== "rizada") {
      // Marca/Estilista saltan directo al perfil
      setPaso(3);
    } else {
      setPaso(paso + 1);
    }
  };

  const handleAtras = () => {
    if (paso === 3 && rol !== "rizada") {
      setPaso(1);
    } else {
      setPaso(paso - 1);
    }
  };

  const pasoActual = paso === 1 ? 1 : rol === "rizada" ? paso : paso === 3 ? 2 : paso;

  const continuarDeshabilitado =
    paso === 1 ? !rol :
    paso === 2 ? !tipoCabello :
    !nombre;

  return (
    <div className="min-h-screen bg-[#F5F0EA] flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[#C4522A] text-xl">o</span>
        <span className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-playfair)" }}>RIZO</span>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 border border-[#EDE4D8] shadow-sm">

        {/* Barra de progreso */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalPasos }).map((_, i) => {
            const n = i + 1;
            const activo = pasoActual >= n;
            return (
              <div key={n} className="flex items-center gap-2 flex-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: activo ? "#C4522A" : "#F5F0EA", color: activo ? "white" : "#9a9a9a" }}>
                  {pasoActual > n ? "v" : n}
                </div>
                {n < totalPasos && (
                  <div className="flex-1 h-0.5 rounded-full"
                    style={{ backgroundColor: pasoActual > n ? "#C4522A" : "#EDE4D8" }}>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PASO 1 — Rol */}
        {paso === 1 && (
          <>
            <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Como quieres usar RIZO?
            </h1>
            <p className="text-sm text-[#9a9a9a] mb-6">Paso 1 de {totalPasos || 2}</p>
            <div className="flex flex-col gap-3">
              {roles.map((r) => (
                <button key={r.id} onClick={() => setRol(r.id)}
                  className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all"
                  style={{ borderColor: rol === r.id ? "#C4522A" : "#EDE4D8", backgroundColor: rol === r.id ? "#FDF5F2" : "white" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: r.color }}>
                    {r.id === "rizada" ? "R" : r.id === "marca" ? "M" : "E"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a1a]">{r.titulo}</p>
                    <p className="text-xs text-[#9a9a9a] mt-1">{r.desc}</p>
                  </div>
                  {rol === r.id && <span className="ml-auto text-[#C4522A] text-lg font-bold">v</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {/* PASO 2 — Tipo de cabello (solo si es rizada) */}
        {paso === 2 && rol === "rizada" && (
         <>
    <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
      Cual es tu tipo de cabello?
    </h1>
    <p className="text-sm text-[#9a9a9a] mb-4">Paso 2 de 3</p>
    <div className="w-full rounded-2xl overflow-hidden mb-6 border border-[#EDE4D8]">
      <img src="/TipoRizo.jpeg" alt="Tipos de rizo" className="w-full object-cover" />
    </div>
    <div className="grid grid-cols-2 gap-3">
              {tiposCabello.map((tipo) => (
                <button key={tipo.id} onClick={() => setTipoCabello(tipo.id)}
                  className="flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all"
                  style={{ borderColor: tipoCabello === tipo.id ? "#C4522A" : "#EDE4D8", backgroundColor: tipoCabello === tipo.id ? "#FDF5F2" : "white" }}>
                  <div>
                    <p className="text-xs font-semibold text-[#1a1a1a]">{tipo.titulo}</p>
                    <p className="text-xs text-[#9a9a9a] mt-0.5">{tipo.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* PASO 3 — Perfil */}
        {paso === 3 && (
          <>
            <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Cuentanos sobre ti
            </h1>
            <p className="text-sm text-[#9a9a9a] mb-6">Paso {totalPasos} de {totalPasos}</p>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <div className="w-20 h-20 rounded-full bg-[#EDE4D8] flex items-center justify-center cursor-pointer hover:bg-[#DDD0BC] transition-colors">
                  <span className="text-sm text-[#9a9a9a]">foto</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#5a5a5a]">Nombre o apodo</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Como te llamas?"
                  className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#5a5a5a]">Bio corta</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Cuentanos sobre tu cabello..." rows={3}
                  className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] resize-none transition-colors" />
              </div>
            </div>
          </>
        )}

        {/* Navegacion */}
        <div className="flex items-center justify-between mt-8">
          {paso > 1 ? (
            <button onClick={handleAtras} className="text-sm text-[#9a9a9a] hover:text-[#C4522A] transition-colors">
              Atras
            </button>
          ) : <div />}

          {paso < 3 ? (
            <button onClick={handleContinuar} disabled={continuarDeshabilitado}
              className="bg-[#C4522A] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#A03E1E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Continuar
            </button>
          ) : (
            <button onClick={() => router.push("/comunidad")} disabled={!nombre}
              className="bg-[#C4522A] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#A03E1E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Empezar
            </button>
          )}
        </div>

      </div>
    </div>
  );
}