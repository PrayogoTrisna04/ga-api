import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, jsonErrorResponse } from "@/lib/response"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ name: string }> } 
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get('keyword')?.trim() || '';
    const skip = (page - 1) * size;

    const { name } = await context.params;
    const decodedName = decodeURIComponent(name);

    const whereClause = {
      is_deleted: false,
      ...(search
        ? {
          OR: [
            { code: { contains: search } },
            { serial_number: { contains: search } },
          ],
        }
        : {})
      };

    const total = await prisma.asset.count({
      where: { name: decodedName, ...whereClause },
    });

    const assets = await prisma.asset.findMany({
      where: { name: decodedName, ...whereClause },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: size,
    });

    return jsonResponse({
      data: assets,
      page,
      size,
      total,
    });
  } catch (e) {
    console.error("Failed to fetch asset by name", e);
    return jsonErrorResponse("Failed to fetch asset by name");
  }
}
