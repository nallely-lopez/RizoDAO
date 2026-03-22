export default function Footer() {
  return (
    <footer className="w-full bg-[#D7CCC8] border-t border-[#D7CCC8] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span
          className="text-xl font-bold text-[#3E2723]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          RIZO
        </span>
        <p className="text-xs text-[#8D6E63]">
          © 2025 RIZO. Todos los derechos reservados.
        </p>
        <div className="flex gap-5">
          <a href="#" className="text-xs text-[#6D4C41] hover:text-[#8D6E63] transition-colors">Instagram</a>
          <a href="#" className="text-xs text-[#6D4C41] hover:text-[#8D6E63] transition-colors">TikTok</a>
          <a href="#" className="text-xs text-[#6D4C41] hover:text-[#8D6E63] transition-colors">Twitter</a>
        </div>
      </div>

    </footer>
  );
}
