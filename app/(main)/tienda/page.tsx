"use client";
import { useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import FiltrosTienda from "@/components/shop/FiltrosTienda";

const productos = [
  { id: 1, nombre: "Gel Definidor Fuerte", marca: "CurlsMX", precio: 189, calificacion: 5, resenas: 48, tipo: "marca" as const, categoria: "Gel", tipoRizo: ["3A", "3B", "3C"], color: "#E8F5EE" },
  { id: 2, nombre: "Shampoo Sin Sulfatos", marca: "CurlsMX", precio: 220, calificacion: 4, resenas: 32, tipo: "marca" as const, categoria: "Shampoo", tipoRizo: ["2A", "2B", "3A"], color: "#EEEDFE" },
  { id: 3, nombre: "Mascarilla Hidratante", marca: "Rizos con Valeria", precio: 310, calificacion: 5, resenas: 67, tipo: "estilista" as const, categoria: "Mascarilla", tipoRizo: ["3B", "3C", "4A"], color: "#FBEAF2" },
  { id: 4, nombre: "Aceite de Argán Puro", marca: "CurlsMX", precio: 275, calificacion: 4, resenas: 21, tipo: "marca" as const, categoria: "Aceite", tipoRizo: ["4A", "4B", "4C"], color: "#FAEEDA" },
  { id: 5, nombre: "Crema para Peinar", marca: "Rizos con Valeria", precio: 195, calificacion: 5, resenas: 89, tipo: "estilista" as const, categoria: "Crema", tipoRizo: ["2B", "3A", "3B"], color: "#E1F5EE" },
  { id: 6, nombre: "Acondicionador Profundo", marca: "CurlsMX", precio: 240, calificacion: 4, resenas: 15, tipo: "marca" as const, categoria: "Acondicionador", tipoRizo: ["2A", "2B"], color: "#FAECE7" },
];

export default function TiendaPage() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [tipoRizoActivo, setTipoRizoActivo] = useState("Todos");

  const productosFiltrados = productos.filter((p) => {
    const porCategoria = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
    const porTipo = tipoRizoActivo === "Todos" || p.tipoRizo.includes(tipoRizoActivo);
    return porCategoria && porTipo;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Tienda
        </h1>
        <p className="text-sm text-[#9a9a9a] mt-1">
          Productos seleccionados para tu tipo de rizo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Filtros */}
        <div className="lg:col-span-1">
          <FiltrosTienda
            categoriaActiva={categoriaActiva}
            setCategoriaActiva={setCategoriaActiva}
            tipoRizoActivo={tipoRizoActivo}
            setTipoRizoActivo={setTipoRizoActivo}
          />
        </div>

        {/* Productos */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#9a9a9a]">
              {productosFiltrados.length} productos encontrados
            </p>
            <select className="text-sm bg-white border border-[#EDE4D8] rounded-xl px-3 py-2 text-[#5a5a5a] focus:outline-none focus:border-[#C4522A]">
              <option>Mas valorados</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Mas recientes</option>
            </select>
          </div>

          {productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {productosFiltrados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-4">🔍</span>
              <p className="text-sm font-semibold text-[#1a1a1a]">No hay productos</p>
              <p className="text-xs text-[#9a9a9a] mt-1">Intenta con otro filtro</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}