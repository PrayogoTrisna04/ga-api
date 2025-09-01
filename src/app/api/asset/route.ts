import { prisma } from "@/lib/prisma";
import { jsonCreated, jsonErrorResponse, jsonResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get('page') || '1', 10);
		const size = parseInt(searchParams.get('limit') || '10', 10);
		const search = searchParams.get('keyword')?.trim() || '';

		const skip = (page - 1) * size;

		const whereClause = {
			is_deleted: false,
			...(search
				? {
					OR: [
					  { name: { contains: search } },
					],
				}
				: {}),
		};

		// ambil semua group dulu buat tau total
		const groupedAll = await prisma.asset.groupBy({
			by: ['name', 'categoryId'],
			where: whereClause,
			_count: { id: true },
		});

		const totalGroups = groupedAll.length;

		// ambil data paginated
		const groupedAssets = await prisma.asset.groupBy({
			by: ['name', 'categoryId'],
			where: whereClause,
			orderBy: { name: 'asc' },
			skip,
			take: size,
			_count: { id: true },
		});

		const categories = await prisma.category.findMany({
			where: { id: { in: groupedAssets.map(a => a.categoryId) } },
		})

		// enrich data: ambil detail category + status isMaintenance + createdAt
		const assets = await Promise.all(
			groupedAssets.map(async (g) => {
				const asset = await prisma.asset.findFirst({
					where: { name: g.name, categoryId: g.categoryId },
					select: {
						id: true,
						isMaintenance: true,
						createdAt: true,
						category: true,
					},
				});

				const category = categories.find(c => c.id === asset?.category.id);

				return {
					id: asset?.id,
					name: g.name,
					quantity: g._count.id,
					category: {
						id: category?.id,
						name: category?.name
					}
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
		const { name, categoryId } = await request.json();
		if (!name || !categoryId) {
			return new Response(JSON.stringify({ error: 'Name and categoryId are required' }), { status: 400 });
		}

		const category = await prisma.category.findUnique({ where: { id: categoryId } });
		if (!category) {
			return jsonErrorResponse('Invalid Category', 400);
		}

		const code = generateCode(category.prefix);
		const asset = await prisma.asset.create({
			data: { name, code, categoryId }
		});
		return jsonCreated(asset);
	} catch {
		return jsonErrorResponse('failed to insert asset');
	}
}