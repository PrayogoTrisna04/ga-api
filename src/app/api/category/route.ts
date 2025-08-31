import { prisma } from "@/lib/prisma";
import { jsonCreated, jsonErrorResponse, jsonResponse, jsonValidationError } from "@/lib/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('keyword')?.trim() || '';

    const skip = (page - 1) * size;

    const whereClause = search
      ? {
        OR: [
          { name: { contains: search } },
          { prefix: { contains: search } },
        ],
      }
      : {};

    const [category, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: size,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.count({
        where: whereClause,
      }),
    ]);

    return jsonResponse({
      data: category || [],
      page,
      size,
      total,
    });
  } catch {
    return jsonErrorResponse('Failed to fetch asset');
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
  } catch (err) {
    console.error("Failed to create category", err);
    return jsonErrorResponse("Failed to create category");
  }
}
