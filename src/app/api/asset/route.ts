import { prisma } from "@/lib/prisma";
import { jsonCreated, jsonErrorResponse, jsonResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get('page') || '1', 10);
		const size = parseInt(searchParams.get('limit') || '10', 10);

		const skip = (page - 1) * size;

		const [assets, total] = await Promise.all([
			prisma.asset.findMany({
				skip,
				select: {
					id: true,
					name: true,
					code: true,
					quantity: true,
					isMaintenance: true,
					createdAt: true,
					category: true
				},
				take: size,
				orderBy: { createdAt: 'desc' },
			}),
			prisma.asset.count(),
		]);

		return jsonResponse({
			data: assets ? assets : [],
			page,
			size,
			total,
		});
	} catch {
		console.error("Failed to fetch asset");
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