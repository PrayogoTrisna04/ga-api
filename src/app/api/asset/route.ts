import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get('page') || '1', 10);
		const size = parseInt(searchParams.get('limit') || '10', 10);

		const skip = (page - 1) * size;

		const [assets, total] = await Promise.all([
			prisma.asset.findMany({
				skip,
				take: size,
				orderBy: { createdAt: 'desc' },
			}),
			prisma.asset.count(),
		]);

		return NextResponse.json(
			{
				data: assets ? assets : [],
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

function generateCode(prefix: string) {
	const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0.12);
	const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
	return `${prefix}-${timestamp}-${randomPart}`;
}

export async function POST(request: Request) {
	const { name, categoryId } = await request.json();
	if (!name || !categoryId) {
		return new Response(JSON.stringify({ error: 'Name and categoryId are required' }), { status: 400 });
	}

	const category = await prisma.category.findUnique({ where: { id: categoryId } });
	if (!category) {
		return NextResponse.json({ error: 'Invalid Category' }, { status: 404 });
	}

	const code = generateCode(category.prefix);
	const asset = await prisma.asset.create({
		data: { name, code, categoryId }
	});
	return NextResponse.json(asset, { status: 201 });
}