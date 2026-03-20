const features = [
  {
    icon: "🛍️",
    bg: "#FBEAF2",
    iconColor: "#C4522A",
    title: "Tienda curada",
    desc: "Productos seleccionados por expertos para cada tipo de rizo. Las marcas pueden crear su perfil y vender directamente.",
  },
  {
    icon: "👥",
    bg: "#F5EDD8",
    iconColor: "#C89B4F",
    title: "Comunidad viva",
    desc: "Comparte rutinas, fotos, reseñas y tips. Sigue a estilistas, conecta con personas que entienden tu cabello.",
  },
  {
    icon: "💬",
    bg: "#EDE8F5",
    iconColor: "#9B7FA6",
    title: "Chat directo",
    desc: "Mensajería privada y canales por tipo de rizo, región o interés. Conexiones reales con tu comunidad.",
  },
  {
    icon: "🪙",
    bg: "#E8F5EE",
    iconColor: "#2E8B6E",
    title: "Tokens y recompensas",
    desc: "Gana tokens en Stellar por publicar, comentar y reseñar. Canjéalos por descuentos, productos y beneficios exclusivos.",
  },
];

export default function Features() {
  return (
    <section className="w-full bg-[#F5F0EA] py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest text-[#C4522A] uppercase mb-3">
            Todo en un solo lugar
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold text-[#1a1a1a]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Un ecosistema hecho para ti
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-8 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: f.bg }}
              >
                {f.icon}
              </div>
              <h3
                className="text-xl font-bold text-[#1a1a1a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm text-[#5a5a5a] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}