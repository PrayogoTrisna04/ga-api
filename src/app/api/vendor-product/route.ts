// app/api/vendor-product/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const products = await prisma.vendorProduct.findMany({ include: { vendor: true } })
        return NextResponse.json(products)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch vendor products' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const product = await prisma.vendorProduct.create({ data })
        return NextResponse.json(product)
    } catch {
        return NextResponse.json({ error: 'Failed to create vendor product' }, { status: 500 })
    }
}