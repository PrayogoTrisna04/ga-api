// app/api/procurement/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const list = await prisma.procurementRequest.findMany({
            include: { quotes: true, purchaseOrder: true }
        })
        return NextResponse.json(list)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch procurement requests' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const created = await prisma.procurementRequest.create({ data })
        return NextResponse.json(created)
    } catch {
        return NextResponse.json({ error: 'Failed to create procurement request' }, { status: 500 })
    }
}