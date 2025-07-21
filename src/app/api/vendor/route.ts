// app/api/vendor/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const vendors = await prisma.vendor.findMany({ include: { products: true } })
        return NextResponse.json(vendors)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const vendor = await prisma.vendor.create({ data })
        return NextResponse.json(vendor)
    } catch {
        return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
    }
}