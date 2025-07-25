import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('limit') || '10', 10);

    const skip = (page - 1) * size;

    const [category, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.count(),
    ]);

    return NextResponse.json(
      {
        data: category ? category : [],
        success: true,
        code: 200,
        meta: {
          page,
          size,
          totalPages: Math.ceil(total / size),
        },
      }
    );
  } catch {
    console.error("Failed to fetch asset");
    return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
