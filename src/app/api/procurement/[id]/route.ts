// app/api/procurement/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const pr = await prisma.procurementRequest.findUnique({
            where: { id: parseInt(params.id) },
            include: { quotes: true, purchaseOrder: true }
        })
        return NextResponse.json(pr)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch procurement request' }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const data = await req.json()
        const updated = await prisma.procurementRequest.update({
            where: { id: parseInt(params.id) },
            data
        })
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Failed to update procurement request' }, { status: 500 })
    }
}
