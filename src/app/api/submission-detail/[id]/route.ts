// File: app/api/submission-detail/[id]/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Get SubmissionDetail by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const submission = await prisma.submissionDetail.findUnique({
            where: { id: params.id },
        })
        if (!submission) return NextResponse.json({ message: 'Not found' }, { status: 404 })
        return NextResponse.json(submission)
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT: Update SubmissionDetail
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const data = await req.json()
        const updated = await prisma.submissionDetail.update({
            where: { id: params.id },
            data,
        })
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE: Remove SubmissionDetail
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.submissionDetail.delete({ where: { id: params.id } })
        return NextResponse.json({ message: 'Deleted successfully' })
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
