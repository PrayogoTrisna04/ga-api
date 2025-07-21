// app/api/asset-assignment/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const all = await prisma.assetAssignment.findMany({
            include: { asset: true, user: true }
        })
        return NextResponse.json(all)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch asset assignments' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const created = await prisma.assetAssignment.create({ data })
        return NextResponse.json(created)
    } catch {
        return NextResponse.json({ error: 'Failed to create asset assignment' }, { status: 500 })
    }
}