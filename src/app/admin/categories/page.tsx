import { prisma } from "@/lib/prisma";
import CategoriesClient from "./CategoriesClient";

export default async function AdminCategoriesPage() {
  const [productCategories, projectCategories] = await Promise.all([
    prisma.productCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.projectCategory.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return (
    <CategoriesClient 
      productCategories={JSON.parse(JSON.stringify(productCategories))} 
      projectCategories={JSON.parse(JSON.stringify(projectCategories))} 
    />
  );
}
