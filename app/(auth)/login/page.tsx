"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Correo o contrasena incorrectos");
        return;
      }

      router.push("/comunidad");
    } catch {
      setError("Error de conexion, intenta de nuevo");
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
        <p className="text-sm text-[#7a7a7a] mt-2">Bienvenida de vuelta</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#EDE4D8]">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
          Iniciar sesion
        </h1>

        {error && (
          <div className="bg-[#FBEAF2] border border-[#E8A598] rounded-xl px-4 py-3 text-xs text-[#993556] mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#5a5a5a]">Correo electronico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#5a5a5a]">Contrasena</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="........"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] transition-colors" />
          </div>

          <div className="text-right">
            <Link href="#" className="text-xs text-[#C4522A] hover:underline">
              Olvidaste tu contrasena?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-[#C4522A] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#A03E1E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[#7a7a7a] mt-6">
        No tienes cuenta?{" "}
        <Link href="/registro" className="text-[#C4522A] font-medium hover:underline">
          Registrate gratis
        </Link>
      </p>
    </div>
  );
}