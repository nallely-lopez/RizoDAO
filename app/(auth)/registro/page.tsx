"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegistro = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta");
        return;
      }

      // Redirige al onboarding
      localStorage.setItem("rizoUserId", data.userId);
router.push("/onboarding");
    } catch {
      setError("Error de conexión, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-[#C4522A] text-xl">o</span>
          <span className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-playfair)" }}>RIZO</span>
        </Link>
        <p className="text-sm text-[#7a7a7a] mt-2">Unete a la comunidad</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#EDE4D8]">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Crear cuenta
        </h1>
        <p className="text-xs text-[#7a7a7a] mb-6">Es gratis y siempre lo sera</p>

        {error && (
          <div className="bg-[#FBEAF2] border border-[#E8A598] rounded-xl px-4 py-3 text-xs text-[#993556] mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#5a5a5a]">Nombre completo</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#5a5a5a]">Correo electronico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#5a5a5a]">Contrasena</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimo 8 caracteres"
              className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] transition-colors" />
          </div>

          <button
            onClick={handleRegistro}
            disabled={loading || !nombre || !email || !password}
            className="w-full bg-[#C4522A] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#A03E1E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2">
            {loading ? "Creando cuenta..." : "Crear mi cuenta"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[#7a7a7a] mt-6">
        Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[#C4522A] font-medium hover:underline">
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}