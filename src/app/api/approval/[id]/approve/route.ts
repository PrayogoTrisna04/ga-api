import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApprovalStatus } from '@prisma/client';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { approvedBy } = await req.json();

    if (!approvedBy) {
        return NextResponse.json({ error: 'approvedBy is required' }, { status: 400 });
    }

    try {
        const approval = await prisma.approval.update({
            where: { id: parseInt(params.id) },
            data: {
                status: ApprovalStatus.approved,
                approvedBy,
                approvedAt: new Date(),
            },
        });

        return NextResponse.json(approval);
    } catch {
        return NextResponse.json('Failed to approve', { status: 500 });
    }
}
