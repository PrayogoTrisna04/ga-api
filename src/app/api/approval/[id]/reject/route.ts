import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApprovalStatus } from '@prisma/client';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { rejectedBy, notes } = await req.json();

    if (!rejectedBy || !notes) {
        return NextResponse.json({ error: 'rejectedBy and notes are required' }, { status: 400 });
    }

    try {
        const approval = await prisma.approval.update({
            where: { id: parseInt(params.id) },
            data: {
                status: ApprovalStatus.rejected,
                approvedBy: rejectedBy,
                approvedAt: new Date(),
                notes,
            },
        });

        return NextResponse.json(approval);
    } catch {
        return NextResponse.json('Failed to reject', { status: 500 });
    }
}
