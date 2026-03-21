"use client";
import Link from "next/link";
import { useState } from "react";
import { useAccesly } from "accesly";
import AuthModal from "@/components/layout/AuthModal";
import { useSession, signOut } from "next-auth/react";

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
  const { data: session } = useSession();

  const estaLogueado = !!wallet || !!session?.user;
  const userInicial = wallet?.email?.[0]?.toUpperCase()
    || session?.user?.name?.[0]?.toUpperCase()
    || "U";

  const handleDesconectar = () => {
    if (wallet) disconnect();
    if (session?.user) signOut({ callbackUrl: "/" });
  };

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
            {estaLogueado ? (
              <div className="flex items-center gap-3">
                <Link href="/recompensas"
                  className="flex items-center gap-1.5 bg-[#FDF5F2] border border-[#EDE4D8] px-3 py-1.5 rounded-full hover:bg-[#EDE4D8] transition-colors">
                  <span className="text-xs">🪙</span>
                  <span className="text-xs font-semibold text-[#C4522A]">
                    Tokens
                  </span>
                </Link>
                <div className="relative group">
                  <button className="w-8 h-8 rounded-full bg-[#C4522A] flex items-center justify-center cursor-pointer">
                    <span className="text-xs font-bold text-white">
                      {userInicial}
                    </span>
                  </button>
                  <div className="absolute right-0 top-10 bg-white border border-[#EDE4D8] rounded-xl shadow-md py-2 min-w-40 hidden group-hover:block z-50">
                    <div className="px-4 py-2 border-b border-[#F5F0EA] mb-1">
                      <p className="text-xs font-semibold text-[#1a1a1a]">
                        {session?.user?.name || wallet?.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-[#9a9a9a]">
                        {session?.user?.email || wallet?.email}
                      </p>
                    </div>
                    <Link href="/perfil"
                      className="block px-4 py-2 text-xs text-[#3d3d3d] hover:bg-[#F5F0EA]">
                      Mi perfil
                    </Link>
                    <Link href="/recompensas"
                      className="block px-4 py-2 text-xs text-[#3d3d3d] hover:bg-[#F5F0EA]">
                      Mis tokens
                    </Link>
                    <button onClick={handleDesconectar}
                      className="w-full text-left px-4 py-2 text-xs text-[#C4522A] hover:bg-[#FDF5F2]">
                      Cerrar sesion
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
            {estaLogueado ? (
              <button onClick={handleDesconectar}
                className="text-sm text-[#C4522A] text-left">
                Cerrar sesion
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