import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export default async function ProductsAdminPage() {
  // 서버 사이드에서 즉시 데이터 페칭
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.productCategory.findMany({
      orderBy: { order: 'asc' }
    })
  ]);

  return (
    <ProductsClient 
      initialProducts={JSON.parse(JSON.stringify(products))} 
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
