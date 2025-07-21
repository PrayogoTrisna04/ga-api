// app/api/vendor/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const vendor = await prisma.vendor.findUnique({ where: { id: parseInt(params.id) }, include: { products: true } })
        return NextResponse.json(vendor)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const data = await req.json()
        const vendor = await prisma.vendor.update({ where: { id: parseInt(params.id) }, data })
        return NextResponse.json(vendor)
    } catch {
        return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.vendor.delete({ where: { id: parseInt(params.id) } })
        return NextResponse.json({ message: 'Deleted' })
    } catch {
        return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 })
    }
}