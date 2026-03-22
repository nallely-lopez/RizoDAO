"use client";
import { useEffect, useState } from "react";

const estilistas = [
  { id: 1, nombre: "Rizos con Valeria", handle: "@valeria.rizos", especialidad: "Rizos 3A-4C", calificacion: 5, resenas: 89, lat: 19.4326, lng: -99.1332, disponible: true },
  { id: 2, nombre: "Studio Curl CDMX", handle: "@studiocurl", especialidad: "Cortes CGM", calificacion: 4, resenas: 54, lat: 19.4180, lng: -99.1500, disponible: true },
  { id: 3, nombre: "Ondas y Rizos", handle: "@ondasrizos", especialidad: "Coloracion rizos", calificacion: 5, resenas: 112, lat: 19.4450, lng: -99.1200, disponible: false },
  { id: 4, nombre: "Curly Lab MX", handle: "@curlylab", especialidad: "Tratamientos capilares", calificacion: 4, resenas: 37, lat: 19.4100, lng: -99.1700, disponible: true },
];

export default function MapaEstilistas() {
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Carga dinámica para evitar errores de SSR
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([reactLeaflet, L]) => {
      // Fix icono default de leaflet
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const { MapContainer, TileLayer, Marker, Popup } = reactLeaflet;

      const Mapa = () => (
        <MapContainer
          center={[19.4326, -99.1332]}
          zoom={13}
          style={{ height: "100%", width: "100%", borderRadius: "16px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          {estilistas.map((e) => (
            <Marker key={e.id} position={[e.lat, e.lng]}
              eventHandlers={{ click: () => setSeleccionado(e.id) }}>
              <Popup>
                <div style={{ fontFamily: "sans-serif", minWidth: 140 }}>
                  <p style={{ fontWeight: 700, marginBottom: 2 }}>{e.nombre}</p>
                  <p style={{ fontSize: 12, color: "#A1887F" }}>{e.especialidad}</p>
                  <p style={{ fontSize: 12, color: e.disponible ? "#0F6E56" : "#8D6E63", marginTop: 4 }}>
                    {e.disponible ? "Disponible" : "No disponible"}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      );

      setMapComponent(() => Mapa);
    });
  }, []);

  const estilistaSeleccionado = estilistas.find(e => e.id === seleccionado);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3E2723]"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Estilistas cerca de ti
        </h1>
        <p className="text-sm text-[#A1887F] mt-1">
          Encuentra especialistas en cabello rizado verificados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Lista estilistas */}
        <div className="flex flex-col gap-3">
          {estilistas.map((e) => (
            <button key={e.id} onClick={() => setSeleccionado(e.id)}
              className="bg-white rounded-2xl border p-4 text-left transition-all hover:shadow-md"
              style={{ borderColor: seleccionado === e.id ? "#8D6E63" : "#D7CCC8" }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D7CCC8] flex items-center justify-center font-bold text-[#8D6E63] flex-shrink-0">
                  {e.nombre[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#3E2723] truncate">{e.nombre}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: e.disponible ? "#E1F5EE" : "#FAF8F5",
                        color: e.disponible ? "#0F6E56" : "#A1887F"
                      }}>
                      {e.disponible ? "Disponible" : "Ocupado"}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1887F]">{e.handle}</p>
                  <p className="text-xs text-[#6D4C41] mt-1">{e.especialidad}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className="text-xs"
                        style={{ color: star <= e.calificacion ? "#C89B4F" : "#D7CCC8" }}>★</span>
                    ))}
                    <span className="text-xs text-[#A1887F] ml-1">({e.resenas})</span>
                  </div>
                </div>
              </div>
              {seleccionado === e.id && e.disponible && (
                <button className="mt-3 w-full bg-[#8D6E63] text-white py-2 rounded-xl text-xs font-medium hover:bg-[#6D4C41] transition-colors">
                  Agendar cita
                </button>
              )}
            </button>
          ))}
        </div>

        {/* Mapa */}
        <div className="lg:col-span-2">
          <div className="w-full h-96 lg:h-full min-h-80 rounded-2xl overflow-hidden border border-[#D7CCC8] bg-[#D7CCC8]">
            {MapComponent ? (
              <MapComponent />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-sm text-[#A1887F]">Cargando mapa...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}