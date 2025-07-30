import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApprovalStatus, Prisma } from '@prisma/client'
import { jsonActionFailed, jsonCreated, jsonErrorResponse, jsonResponse } from '@/lib/response';

export async function POST(req: Request) {
  const body = await req.json();
  const { submissionId, submissionType, requestedBy } = body;

  if (!submissionId || !submissionType || !requestedBy) {
    return jsonActionFailed("All fields are required.");
  }

  try {
    const approval = await prisma.approval.create({
      data: {
        submissionId,
        submissionType,
        requestedBy,
      },
    });

    return jsonCreated(approval);
  } catch (error) {
    console.error("Failed to create approval", error);
    return jsonErrorResponse("Failed to create approval.");
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
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('limit') || '10', 10);

    const skip = (page - 1) * size;

    const [approvals, total] = await Promise.all([
      prisma.approval.findMany({
        where: filters,
        include: {
          submission: true,
        },
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count(),
    ]);

    return jsonResponse({
      data: approvals ? approvals : [],
      page,
      size,
      total,
    });
  } catch {
    return jsonErrorResponse("Failed to fetch approvals");
  }
}
