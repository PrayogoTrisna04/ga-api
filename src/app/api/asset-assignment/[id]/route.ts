// app/api/asset-assignment/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const one = await prisma.assetAssignment.findUnique({
            where: { id: parseInt(params.id) },
            include: { asset: true, user: true }
        })
        return NextResponse.json(one)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch asset assignment' }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const data = await req.json()
        const updated = await prisma.assetAssignment.update({
            where: { id: parseInt(params.id) },
            data
        })
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Failed to update asset assignment' }, { status: 500 })
    }
}