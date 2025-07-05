import { getToken } from "@/lib/auth";
import { authorize } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"
const token = getToken();
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params
    const { name, prefix } = await req.json()

    if (!name || prefix) return NextResponse.json({ error: 'Name and prefix are required' }, { status: 400 })
    try {
        authorize(token, ['ADMIN', 'GA']); // hanya ADMIN atau GA
        const updated = await prisma.category.update({
            where: { id },
            data: { name, prefix }
        });
        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'FORBIDDEN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }


        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Delete Category
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const { id } = params
    try {
        authorize(token, ['ADMIN', 'GA']); // hanya ADMIN atau GA
        await prisma.category.delete({ where: { id } })
        return NextResponse.json({ message: 'Category deleted successfully' })
    } catch (error) {
        return NextResponse.json({ error: ['Failed to delete category', error] }, { status: 500 })
    }
}