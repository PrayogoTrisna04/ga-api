// File: app/api/approval/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApprovalStatus, Prisma } from '@prisma/client'


export async function POST(req: Request) {
  const body = await req.json();
  const { submissionId, submissionType, requestedBy } = body;

  if (!submissionId || !submissionType || !requestedBy) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  try {
    const approval = await prisma.approval.create({
      data: {
        submissionId,
        submissionType,
        requestedBy,
      },
    });

    return NextResponse.json(approval, { status: 201 });
  } catch (error) {
    console.error("Failed to create approval", error);
    return NextResponse.json({ error: "Failed to create approval." }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const requestedBy = searchParams.get("requestedBy");
  const submissionId = searchParams.get("submissionId");

 const filters: Prisma.ApprovalWhereInput = {};
if (status) filters.status = status as ApprovalStatus;
  if (requestedBy) filters.requestedBy = requestedBy;
  if (submissionId) filters.submissionId = submissionId;

  try {
    const approvals = await prisma.approval.findMany({
      where: filters,
      include: {
        submission: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(approvals);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch approvals", details: err }, { status: 500 });
  }
}

