import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import Sidebar from "@/components/feed/Sidebar";

const posts = [
  {
    id: 1,
    autor: "Mariana López",
    handle: "@mariana.rizos",
    avatar: "M",
    tiempo: "hace 5 min",
    contenido: "¡Por fin encontré la rutina perfecta para mis rizos 3B! Llevo 3 semanas con el método CGM y los resultados son increíbles 🌀 Les comparto mis productos favoritos abajo 👇",
    imagen: "🌀",
    likes: 42,
    comentarios: 8,
    tipo: "rizada" as const,
  },
  {
    id: 2,
    autor: "Rizos con Valeria",
    handle: "@valeria.rizos",
    avatar: "V",
    tiempo: "hace 23 min",
    contenido: "Tip del día: nunca cepilles el cabello rizado en seco. Siempre hazlo con acondicionador y desde las puntas hacia las raíces. Tu rizo te lo agradecerá ✨",
    likes: 128,
    comentarios: 24,
    tipo: "estilista" as const,
  },
  {
    id: 3,
    autor: "CurlsMX",
    handle: "@curlsmx",
    avatar: "C",
    tiempo: "hace 1 hora",
    contenido: "Presentamos nuestra nueva línea de geles sin alcohol para rizos 3A-4C. Formulados especialmente para el clima de México 🇲🇽 Disponibles en nuestra tienda RIZO.",
    imagen: "✨",
    likes: 89,
    comentarios: 15,
    tipo: "marca" as const,
  },
  {
    id: 4,
    autor: "Sofía Ondas",
    handle: "@sofia.ondas",
    avatar: "S",
    tiempo: "hace 2 horas",
    contenido: "Pregunta para la comunidad: ¿cuál es su producto favorito para definir rizos en días de humedad? El mío es el gel de linaza casero pero quiero probar algo nuevo 💭",
    likes: 67,
    comentarios: 31,
    tipo: "rizada" as const,
  },
];

export default function ComunidadPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Feed principal */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-[#1a1a1a]"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Comunidad
          </h1>
          <CreatePost />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

      </div>
    </div>
  );
}