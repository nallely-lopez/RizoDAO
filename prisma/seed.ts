import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const productos = [
    {
      name: "Shea Moisture Curl Enhancing Smoothie",
      description: "Crema definidora de rizos con manteca de karité y aceite de argán. Ideal para cabello 3B-4C.",
      price: 12.99,
      tokenPrice: 150,
      brandName: "SheaMoisture",
      rating: 4.8,
      votes: 342,
      category: "Definidores",
      hairTypes: "3B,3C,4A,4B,4C",
      imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
    },
    {
      name: "Cantu Shea Butter Leave-In Conditioning Repair Cream",
      description: "Acondicionador sin enjuague con manteca de karité pura. Repara el cabello dañado y define rizos.",
      price: 8.49,
      tokenPrice: 100,
      brandName: "Cantu",
      rating: 4.6,
      votes: 518,
      category: "Leave-in",
      hairTypes: "3A,3B,3C,4A,4B",
      imageUrl: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400",
    },
    {
      name: "As I Am Coconut CoWash",
      description: "Co-wash de coco para limpiar sin sulfatos. Mantiene la hidratación y el patrón natural del rizo.",
      price: 10.99,
      tokenPrice: 120,
      brandName: "As I Am",
      rating: 4.5,
      votes: 287,
      category: "Co-wash",
      hairTypes: "3A,3B,3C,4A,4B,4C",
      imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
    },
    {
      name: "Ecostyler Krystal Styling Gel",
      description: "Gel fijador de cristal para rizos definidos con hold fuerte. Sin alcohol, sin flaking.",
      price: 6.99,
      tokenPrice: 80,
      brandName: "Ecostyler",
      rating: 4.7,
      votes: 623,
      category: "Geles",
      hairTypes: "2C,3A,3B,3C,4A",
      imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
    },
    {
      name: "Mielle Organics Rosemary Mint Scalp & Hair Strengthening Oil",
      description: "Aceite de romero y menta para estimular el crecimiento y fortalecer el cuero cabelludo.",
      price: 9.99,
      tokenPrice: 110,
      brandName: "Mielle Organics",
      rating: 4.9,
      votes: 891,
      category: "Aceites",
      hairTypes: "3A,3B,3C,4A,4B,4C",
      imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400",
    },
    {
      name: "Kinky-Curly Knot Today Leave-In Detangler",
      description: "Desenredante leave-in con extracto de mango salvaje. Facilita el peinado y reduce la rotura.",
      price: 14.99,
      tokenPrice: 175,
      brandName: "Kinky-Curly",
      rating: 4.7,
      votes: 412,
      category: "Leave-in",
      hairTypes: "3C,4A,4B,4C",
      imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
    },
    {
      name: "DevaCurl SuperCream Coconut Curl Styler",
      description: "Crema de coco para cabello ondulado y rizado. Define sin rigidez y aporta brillo.",
      price: 28.00,
      tokenPrice: 320,
      brandName: "DevaCurl",
      rating: 4.4,
      votes: 256,
      category: "Definidores",
      hairTypes: "2B,2C,3A,3B",
      imageUrl: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400",
    },
    {
      name: "Camille Rose Naturals Almond Jai Twisting Butter",
      description: "Mantequilla de almendras para twists y trenzas. Hidratación profunda y definición de larga duración.",
      price: 16.99,
      tokenPrice: 200,
      brandName: "Camille Rose",
      rating: 4.6,
      votes: 334,
      category: "Mantequillas",
      hairTypes: "4A,4B,4C",
      imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
    },
  ];

  console.log("Sembrando productos...");

  for (const producto of productos) {
    await prisma.product.upsert({
      where: { id: producto.name.toLowerCase().replace(/\s+/g, "-").slice(0, 25) },
      update: {},
      create: {
        ...producto,
        id: producto.name.toLowerCase().replace(/\s+/g, "-").slice(0, 25),
      },
    });
  }

  console.log(`✓ ${productos.length} productos sembrados correctamente`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
