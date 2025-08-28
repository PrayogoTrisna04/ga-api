import { prisma } from "@/lib/prisma";
import { jsonCreated, jsonErrorResponse, jsonResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('limit') || '10', 10);

    const skip = (page - 1) * size;

    // ambil semua group dulu buat tau total
    const groupedAll = await prisma.asset.groupBy({
      by: ['name', 'categoryId'],
      where: { is_deleted: false },
      _count: { id: true },
    });

    const totalGroups = groupedAll.length;

    // ambil data paginated
    const groupedAssets = await prisma.asset.groupBy({
      by: ['name', 'categoryId'],
      where: { is_deleted: false },
      orderBy: { name: 'asc' },
      skip,
      take: size,
      _count: { id: true },
    });

    // enrich data: ambil detail category + status isMaintenance + createdAt
    const assets = await Promise.all(
      groupedAssets.map(async (g) => {
        const asset = await prisma.asset.findFirst({
          where: { name: g.name, categoryId: g.categoryId },
          select: {
            isMaintenance: true,
            createdAt: true,
            category: true,
          },
        });

        return {
          name: g.name,
          categoryId: g.categoryId,
          quantity: g._count.id,
          isMaintenance: asset?.isMaintenance,
          createdAt: asset?.createdAt,
          category: asset?.category,
        };
      })
    );

    return jsonResponse({
      data: assets,
      page,
      size,
      total: totalGroups, // jumlah group (bukan jumlah row)
    });
  } catch (e) {
    console.error("Failed to fetch asset", e);
    return jsonErrorResponse("Failed to fetch asset");
  }
}

function generateCode(prefix: string) {
	const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0.12);
	const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
	return `${prefix}-${timestamp}-${randomPart}`;
}

export async function POST(request: Request) {
	try {
		const { name, categoryId, quantity } = await request.json();
		if (!name || !categoryId) {
			return new Response(JSON.stringify({ error: 'Name and categoryId are required' }), { status: 400 });
		}

		const category = await prisma.category.findUnique({ where: { id: categoryId } });
		if (!category) {
			return jsonErrorResponse('Invalid Category', 400);
		}

		const code = generateCode(category.prefix);
		const asset = await prisma.asset.create({
			data: { name, code, categoryId, quantity }
		});
		return jsonCreated(asset);
	} catch {
		return jsonErrorResponse('failed to insert asset');
	}
}