import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { name, prefix } = await request.json();
    if (!name || !prefix) {
        return new Response(JSON.stringify({ error: 'Name and prefix are required' }), { status: 400 });
    }
    try {
        const categories = await prisma.category.create({
            data: { name, prefix }
        })
        return NextResponse.json(categories, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}