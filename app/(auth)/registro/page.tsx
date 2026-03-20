"use client";
import Link from "next/link";
import { useState } from "react";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-[#C4522A] text-xl">◎</span>
          <span className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-playfair)" }}>RIZO</span>
        </Link>
        <p className="text-sm text-[#7a7a7a] mt-2">Únete a la comunidad</p>
      </div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#EDE4D8]">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Crear cuenta</h1>
        <p className="text-xs text-[#7a7a7a] mb-6">Es gratis y siempre lo será</p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#5a5a5a]">Nombre completo</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#5a5a5a]">Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#5a5a5a]">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className="w-full bg-[#F5F0EA] border border-[#EDE4D8] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#b0a89a] focus:outline-none focus:border-[#C4522A] transition-colors" />
          </div>
          <button className="w-full bg-[#C4522A] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#A03E1E] transition-colors mt-2">Crear mi cuenta</button>
          <div className="relative flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[#EDE4D8]"></div>
            <span className="text-xs text-[#b0a89a]">o</span>
            <div className="flex-1 h-px bg-[#EDE4D8]"></div>
          </div>
          <button className="w-full bg-white border border-[#EDE4D8] text-[#3d3d3d] py-3 rounded-xl text-sm font-medium hover:bg-[#F5F0EA] transition-colors flex items-center justify-center gap-2">
            <span>G</span> Continuar con Google
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-[#7a7a7a] mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[#C4522A] font-medium hover:underline">Inicia sesión</Link>
      </p>
    </div>
  );
}