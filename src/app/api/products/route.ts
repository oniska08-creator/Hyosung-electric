import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadBase64Image } from "@/lib/storage";

// 제품 목록 조회
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: "제품 목록을 불러오는 중 오류가 발생했습니다." }, { status: 500 });
  }
}

// 제품 등록 (이미지 최적화 포함)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, category, spec, price, images } = body;

    let imageUrls: string[] = [];

    if (images && Array.isArray(images)) {
      for (const img of images) {
        const url = await uploadBase64Image(img.base64, "products", img.name || name);
        imageUrls.push(url);
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        spec,
        price: parseInt(String(price)) || 0,
        imageUrls,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: "제품 등록 중 오류가 발생했습니다." }, { status: 500 });
  }
}
