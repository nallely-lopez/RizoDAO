export default function Footer() {
  return (
    <footer className="w-full bg-[#EDE4D8] border-t border-[#DDD0BC] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span
          className="text-xl font-bold text-[#1a1a1a]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          RIZO
        </span>
        <p className="text-xs text-[#7a7a7a]">
          © 2025 RIZO. Todos los derechos reservados.
        </p>
        <div className="flex gap-5">
          <a href="#" className="text-xs text-[#5a5a5a] hover:text-[#C4522A] transition-colors">Instagram</a>
          <a href="#" className="text-xs text-[#5a5a5a] hover:text-[#C4522A] transition-colors">TikTok</a>
          <a href="#" className="text-xs text-[#5a5a5a] hover:text-[#C4522A] transition-colors">Twitter</a>
        </div>
      </div>

    </footer>
  );
}
