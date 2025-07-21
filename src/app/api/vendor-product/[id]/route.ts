// app/api/vendor-product/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const product = await prisma.vendorProduct.findUnique({ where: { id: parseInt(params.id) }, include: { vendor: true } })
        return NextResponse.json(product)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch vendor product' }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const data = await req.json()
        const updated = await prisma.vendorProduct.update({ where: { id: parseInt(params.id) }, data })
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Failed to update vendor product' }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.vendorProduct.delete({ where: { id: parseInt(params.id) } })
        return NextResponse.json({ message: 'Deleted' })
    } catch {
        return NextResponse.json({ error: 'Failed to delete vendor product' }, { status: 500 })
    }
}
