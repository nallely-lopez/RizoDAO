/**
 * seed-products.ts
 * Borra todos los productos existentes e inserta los 6 productos reales
 * de Rizos Mexicanos con sus imágenes del CDN oficial.
 *
 * Ejecutar con:
 *   npx tsx scripts/seed-products.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTOS = [
  {
    name: "Shampoo Arroz Quinoa y Soja",
    description:
      "Shampoo sin sulfatos con proteínas hidrolizadas de arroz, quinoa y soja. Limpieza suave que evita resequedad, ideal para rizos teñidos o dañados. 500 ml.",
    price: 18,
    tokenPrice: 85,
    imageUrl:
      "https://acdn-us.mitiendanube.com/stores/006/692/292/products/shampoo-arroz-500ml-1eb226244fe5235ee317578008784168-480-0.webp",
    brandName: "Rizos Mexicanos",
    category: "Shampoo",
    hairTypes: "2A,2B,3A,3B,3C,4A,4B,4C",
    rating: 4.8,
    votes: 124,
  },
  {
    name: "Acondicionador con Proteína de Arroz, Quinoa y Soya",
    description:
      "Acondicionador hidratante que nutre, repara y suaviza sin pesar el cabello. Enriquecido con proteínas vegetales, ácido hialurónico y pantenol. 500 ml.",
    price: 18,
    tokenPrice: 85,
    imageUrl:
      "https://acdn-us.mitiendanube.com/stores/006/692/292/products/acondicionador-arroz-500ml-e94f70b10c81b2ff4417578054742322-480-0.webp",
    brandName: "Rizos Mexicanos",
    category: "Acondicionador",
    hairTypes: "2A,2B,3A,3B,3C,4A,4B,4C",
    rating: 4.9,
    votes: 98,
  },
  {
    name: "Crema de Peinar Arroz, Quinoa y Soja",
    description:
      "Crema de peinar con proteínas hidrolizadas que penetran profundamente. Rica en antioxidantes que reducen el daño de procesos químicos. Ideal para rizos teñidos. 500 ml.",
    price: 19,
    tokenPrice: 90,
    imageUrl:
      "https://acdn-us.mitiendanube.com/stores/006/692/292/products/crema-arroz-500ml-4c73391f771034de2317578068523167-480-0.webp",
    brandName: "Rizos Mexicanos",
    category: "Crema",
    hairTypes: "2A,2B,3A,3B,3C,4A,4B,4C",
    rating: 4.9,
    votes: 87,
  },
  {
    name: "Gel para Controlar Rizos Arroz, Quinoa y Soja",
    description:
      "Gel definidor sin alcohol. Restaura vitalidad, movimiento y control a los rizos. Anti-frizz, no endurece ni deja residuos. Devuelve elasticidad y movimiento. 500 ml.",
    price: 19,
    tokenPrice: 90,
    imageUrl:
      "https://acdn-us.mitiendanube.com/stores/006/692/292/products/jelly-rizos-mexicanos-500ml-a833b08214b1926dd717578077113872-480-0.webp",
    brandName: "Rizos Mexicanos",
    category: "Gel",
    hairTypes: "2A,2B,3A,3B,3C,4A,4B,4C",
    rating: 4.7,
    votes: 156,
  },
  {
    name: "Mascarilla Capilar Reparación Arroz, Quinoa y Soja 250ml",
    description:
      "Mascarilla con proteínas hidrolizadas de quinoa, soja y arroz. La quinoa aporta antioxidantes que protegen contra radicales libres y reparan el daño capilar.",
    price: 12,
    tokenPrice: 60,
    imageUrl:
      "https://acdn-us.mitiendanube.com/stores/006/692/292/products/mascarilla-arroz-500ml-2fcf052b759b627cdc17578094948040-480-0.webp",
    brandName: "Rizos Mexicanos",
    category: "Mascarilla",
    hairTypes: "2A,2B,3A,3B,3C,4A,4B,4C",
    rating: 4.8,
    votes: 73,
  },
  {
    name: "Duo Crema Rizos Naturales y Spray Rosas Abeja Reyna",
    description:
      "Kit especial: Crema para Peinar Rizos Naturales + Spray de Rosas Abeja Reyna. Hidratación profunda y definición duradera para rizos naturales. Edición limitada.",
    price: 23,
    tokenPrice: 110,
    imageUrl:
      "https://acdn-us.mitiendanube.com/stores/006/692/292/products/crema-rizos-naturales-480ml-f269847eb24c12bbc117578056880549-480-0.webp",
    brandName: "Rizos Mexicanos",
    category: "Crema",
    hairTypes: "2A,2B,3A,3B,3C,4A,4B,4C",
    rating: 4.9,
    votes: 41,
  },
];

async function main() {
  console.log("🗑️  Borrando productos existentes...");
  const deleted = await prisma.product.deleteMany();
  console.log(`   ${deleted.count} productos eliminados.`);

  console.log("🌱 Insertando productos de Rizos Mexicanos...");
  for (const p of PRODUCTOS) {
    const created = await prisma.product.create({ data: p });
    console.log(`   ✅ ${created.name} (id: ${created.id})`);
  }

  console.log(`\n✨ Seed completado — ${PRODUCTOS.length} productos insertados.`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
