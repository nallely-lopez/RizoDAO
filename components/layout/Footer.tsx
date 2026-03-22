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

      {/* Stellar branding */}
      <div className="max-w-6xl mx-auto px-6 mt-6 pt-6 border-t border-[#BCAAA4]/40 flex justify-center">
        <a
          href="https://stellar.expert/explorer/testnet"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-[#8D6E63]/70 hover:text-[#8D6E63] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12h20M2 12l4-4m-4 4 4 4M22 12l-4-4m4 4-4 4"/>
          </svg>
          Powered by Stellar Network
        </a>
      </div>
    </footer>
  );
}
