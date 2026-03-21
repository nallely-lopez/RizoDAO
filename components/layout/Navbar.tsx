"use client";
import Link from "next/link";
import { useState } from "react";
import { useAccesly } from "accesly";
import AuthModal from "@/components/layout/AuthModal";

const links = [
  { label: "Comunidad", href: "/comunidad" },
  { label: "Tienda", href: "/tienda" },
  { label: "Recompensas", href: "/recompensas" },
  { label: "Estilistas", href: "/estilistas" },
  { label: "Perfil", href: "/perfil" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { wallet, disconnect } = useAccesly();

  return (
    <>
      <nav className="w-full bg-[#F5F0EA] border-b border-[#E8DDD0] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#C4522A] text-lg">◎</span>
            <span className="text-xl font-bold text-[#1a1a1a] tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}>
              RIZO
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((item) => (
              <Link key={item.label} href={item.href}
                className="text-sm text-[#3d3d3d] hover:text-[#C4522A] transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Derecha */}
          <div className="hidden md:flex items-center gap-3">
            {wallet ? (
              <div className="flex items-center gap-3">
                <Link href="/recompensas"
                  className="flex items-center gap-1.5 bg-[#FDF5F2] border border-[#EDE4D8] px-3 py-1.5 rounded-full hover:bg-[#EDE4D8] transition-colors">
                  <span className="text-xs">🪙</span>
                  <span className="text-xs font-semibold text-[#C4522A]">
                    {wallet.stellarAddress.slice(0, 4)}...{wallet.stellarAddress.slice(-4)}
                  </span>
                </Link>
                <div className="relative group">
                  <Link href="/perfil"
                    className="w-8 h-8 rounded-full bg-[#C4522A] flex items-center justify-center cursor-pointer">
                    <span className="text-xs font-bold text-white">
                      {wallet.email?.[0]?.toUpperCase() ?? "R"}
                    </span>
                  </Link>
                  <div className="absolute right-0 top-10 bg-white border border-[#EDE4D8] rounded-xl shadow-md py-1 min-w-32 hidden group-hover:block z-50">
                    <Link href="/perfil"
                      className="block px-4 py-2 text-xs text-[#3d3d3d] hover:bg-[#F5F0EA]">
                      Mi perfil
                    </Link>
                    <Link href="/recompensas"
                      className="block px-4 py-2 text-xs text-[#3d3d3d] hover:bg-[#F5F0EA]">
                      Mis tokens
                    </Link>
                    <button onClick={() => disconnect()}
                      className="w-full text-left px-4 py-2 text-xs text-[#C4522A] hover:bg-[#FDF5F2]">
                      Desconectar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => setModalOpen(true)}
                className="text-sm bg-[#C4522A] text-white px-5 py-2 rounded-full hover:bg-[#A03E1E] transition-colors">
                Entrar
              </button>
            )}
          </div>

          {/* Menú móvil */}
          <button className="md:hidden text-[#3d3d3d]"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div className="md:hidden bg-[#F5F0EA] border-t border-[#E8DDD0] px-6 py-4 flex flex-col gap-4">
            {links.map((item) => (
              <Link key={item.label} href={item.href}
                className="text-sm text-[#3d3d3d]"
                onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            {wallet ? (
              <button onClick={() => disconnect()}
                className="text-sm text-[#C4522A] text-left">
                Desconectar wallet
              </button>
            ) : (
              <button onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                className="text-sm bg-[#C4522A] text-white px-5 py-2 rounded-full text-center">
                Entrar
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Modal */}
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}