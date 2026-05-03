import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'product' or 'project'

  try {
    if (type === "product") {
      const categories = await prisma.productCategory.findMany({
        orderBy: { order: "asc" },
      });
      return NextResponse.json(categories);
    } else if (type === "project") {
      const categories = await prisma.projectCategory.findMany({
        orderBy: { order: "asc" },
      });
      return NextResponse.json(categories);
    } else {
      const [productCats, projectCats] = await Promise.all([
        prisma.productCategory.findMany({ orderBy: { order: "asc" } }),
        prisma.projectCategory.findMany({ orderBy: { order: "asc" } }),
      ]);
      return NextResponse.json({ product: productCats, project: projectCats });
    }
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
