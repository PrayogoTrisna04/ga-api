import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const asset = await prisma.asset.findUnique({
            where: { id: params.id },
            include: { category: true },
        });

        if (!asset) return NextResponse.json({ error: 'Asset not found!' }, { status: 404 });

        return NextResponse.json(asset);
    } catch (e) {
        console.error('Get asset by ID error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { name, categoryId } = await req.json();
    const updated = await prisma.asset.update({
        where: { id: params.id },
        data: { name, categoryId },
    });
    return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await prisma.asset.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deleted" });
}