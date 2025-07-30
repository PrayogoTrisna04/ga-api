import { prisma } from "@/lib/prisma";
import { jsonCreated, jsonErrorResponse, jsonResponse, jsonValidationError } from "@/lib/response";

export async function GET(request: Request) {
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

    return jsonResponse({
      data: category ? category : [],
      page,
      size,
      total,
    })
  } catch {
    return jsonErrorResponse("Failed to fetch asset");
  }
}

export async function POST(request: Request) {
  try {
    const { name, prefix } = await request.json();
    if (!name || !prefix) {
      return jsonValidationError('Name and prefix are required');
    }
    const categories = await prisma.category.create({
      data: { name, prefix }
    });
    return jsonCreated(categories)
  } catch {
    return jsonErrorResponse("Failed to fetch categories");
  }
}
