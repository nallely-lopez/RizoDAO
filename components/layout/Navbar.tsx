"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Comunidad", href: "/comunidad" },
  { label: "Tienda", href: "/tienda" },
  { label: "Recompensas", href: "/recompensas" },
  { label: "Estilistas", href: "/estilistas" },
  { label: "Perfil", href: "/perfil" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#F5F0EA] border-b border-[#E8DDD0] sticky top-0 z-50">
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

        {/* Botón derecha */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            className="text-sm bg-[#C4522A] text-white px-5 py-2 rounded-full hover:bg-[#A03E1E] transition-colors">
            Iniciar sesión
          </Link>
        </div>

        {/* Menú móvil */}
        <button className="md:hidden text-[#3d3d3d]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-[#F5F0EA] border-t border-[#E8DDD0] px-6 py-4 flex flex-col gap-4">
          {links.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm text-[#3d3d3d]">
              {item.label}
            </Link>
          ))}
          <Link href="/login"
            className="text-sm bg-[#C4522A] text-white px-5 py-2 rounded-full text-center">
            Iniciar sesión
          </Link>
        </div>
      )}
    </nav>
  );
}