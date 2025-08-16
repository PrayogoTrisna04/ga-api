// app/api/approval/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonDeleted } from '@/lib/response'

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const approval = await prisma.approval.findUnique({ where: { id: parseInt(params.id) } })
        return NextResponse.json(approval)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch approval' }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const data = await req.json()
        const approval = await prisma.approval.update({ where: { id: parseInt(params.id) }, data })
        return NextResponse.json(approval)
    } catch {
        return NextResponse.json({ error: 'Failed to update approval' }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.approval.delete({ where: { id: parseInt(params.id) } })
        return NextResponse.json({ message: 'Deleted' })
    } catch {
        return jsonDeleted();
    }
}
