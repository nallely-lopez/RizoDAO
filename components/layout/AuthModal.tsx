"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccesly } from "accesly";

type Props = {
  onClose: () => void;
};

export default function AuthModal({ onClose }: Props) {
  const router = useRouter();
  const { connect } = useAccesly();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vista, setVista] = useState<"opciones" | "login">("opciones");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Correo o contrasena incorrectos");
        return;
      }
      onClose();
      router.push("/comunidad");
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = () => {
    connect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-sm border border-[#EDE4D8] shadow-xl"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[#C4522A]">o</span>
            <span className="text-lg font-bold text-[#1a1a1a]"
              style={{ fontFamily: "var(--font-playfair)" }}>RIZO</span>
          </div>
          <button onClick={onClose} className="text-[#9a9a9a] hover:text-[#1a1a1a] transition-colors text-lg">x</button>
        </div>

        {/* Vista opciones */}
        {vista === "opciones" && (
          <>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Como quieres entrar?
            </h2>
            <p className="text-xs text-[#9a9a9a] mb-6">Elige tu metodo de acceso</p>

            <div className="flex flex-col gap-3">
              {/* Login con email */}
              <button onClick={() => setVista("login")}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#EDE4D8] hover:border-[#C4522A] hover:bg-[#FDF5F2] transition-all text-left">
                <div className="w-10 h-10 rounded-xl bg-[#FDF5F2] flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">✉️</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1a1a]">Iniciar sesion</p>
                  <p className="text-xs text-[#9a9a9a] mt-0.5">Con email y contrasena</p>
                </div>
              </button>

              {/* Connect Wallet */}
              <button onClick={handleConnectWallet}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#EDE4D8] hover:border-[#C4522A] hover:bg-[#FDF5F2] transition-all text-left">
                <div className="w-10 h-10 rounded-xl bg-[#EEEDFE] flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🔑</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1a1a]">Connect Wallet</p>
                  <p className="text-xs text-[#9a9a9a] mt-0.5">Con tu wallet Stellar via Accesly</p>
                </div>
              </button>

              {/* Registro */}
              <div className="text-center pt-2">
                <p className="text-xs text-[#9a9a9a]">
                  No tienes cuenta?{" "}
                  <button onClick={() => { onClose(); router.push("/registro"); }}
                    className="text-[#C4522A] font-medium hover:underline">
                    Registrate gratis
                  </button>
                </p>
              </div>
            </div>
          </>
        )}

        {/* Vista login */}
        {vista === "login" && (
          <>
            <button onClick={() => setVista("opciones")}
              className="text-xs text-[#9a9a9a] hover:text-[#C4522A] transition-colors mb-4">
              Atras
            </button>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Iniciar sesion
            </h2>

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
              <button onClick={handleLogin} disabled={loading || !email || !password}
                className="w-full bg-[#C4522A] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#A03E1E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}