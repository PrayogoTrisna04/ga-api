// File: app/api/submission-detail/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Get all submission details
export async function GET() {
    try {
        const all = await prisma.submissionDetail.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(all)
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST: Create new submission detail
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const created = await prisma.submissionDetail.create({
            data: body,
        })
        return NextResponse.json(created, { status: 201 })
    } catch {
        return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
    }
}
