import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadBase64Image } from "@/lib/storage";

// 시공 사례 목록 조회
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET Projects Error:", error);
    return NextResponse.json({ error: "시공 사례를 불러오는 중 오류가 발생했습니다." }, { status: 500 });
  }
}

// 시공 사례 등록 (이미지 최적화 포함)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, capacity, location, tags, images } = body;

    let imageUrls: string[] = [];

    if (images && Array.isArray(images)) {
      for (const img of images) {
        const url = await uploadBase64Image(img.base64, "projects", img.name || title);
        imageUrls.push(url);
      }
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        capacity,
        location,
        tags: Array.isArray(tags) ? tags : [],
        imageUrls,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("POST Project Error:", error);
    return NextResponse.json({ error: "시공 사례 등록 중 오류가 발생했습니다." }, { status: 500 });
  }
}
