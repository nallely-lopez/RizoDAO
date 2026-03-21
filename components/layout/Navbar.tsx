"use client";
import Link from "next/link";
import { useState } from "react";
import { useAccesly } from "accesly";

const links = [
  { label: "Comunidad", href: "/comunidad" },
  { label: "Tienda", href: "/tienda" },
  { label: "Recompensas", href: "/recompensas" },
  { label: "Estilistas", href: "/estilistas" },
  { label: "Perfil", href: "/perfil" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { wallet, disconnect, connect } = useAccesly();

  return (
    <nav className="w-full bg-[#F5F0EA] border-b border-[#E8DDD0] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#C4522A] text-lg">◎</span>
          <span className="text-xl font-bold text-[#1a1a1a] tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}>
            RIZO
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((item) => (
            <Link key={item.label} href={item.href}
              className="text-sm text-[#3d3d3d] hover:text-[#C4522A] transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {wallet ? (
            <div className="flex items-center gap-3">
              <Link href="/recompensas"
                className="flex items-center gap-1.5 bg-[#FDF5F2] border border-[#EDE4D8] px-3 py-1.5 rounded-full hover:bg-[#EDE4D8] transition-colors">
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
                  <button
                    onClick={() => disconnect()}
                    className="w-full text-left px-4 py-2 text-xs text-[#C4522A] hover:bg-[#F5F0EA]">
                    Desconectar wallet
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={connect}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.75rem',
                background: 'linear-gradient(135deg, rgb(245, 222, 179) 0%, rgb(222, 184, 135) 100%)',
                color: 'rgb(0, 0, 0)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: 'rgba(222, 184, 135, 0.4) 0px 4px 15px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
              </svg>
              Connect Wallet
            </button>
          )}
        </div>

        <button className="md:hidden text-[#3d3d3d]"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#F5F0EA] border-t border-[#E8DDD0] px-6 py-4 flex flex-col gap-4">
          {links.map((item) => (
            <Link key={item.label} href={item.href}
              className="text-sm text-[#3d3d3d]">
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <button
              onClick={connect}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.75rem',
                background: 'linear-gradient(135deg, rgb(245, 222, 179) 0%, rgb(222, 184, 135) 100%)',
                color: 'rgb(0, 0, 0)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: 'rgba(222, 184, 135, 0.4) 0px 4px 15px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
              </svg>
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}