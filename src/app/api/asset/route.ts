import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const assets = await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(assets, { status: 200 });
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