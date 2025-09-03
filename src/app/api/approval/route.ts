import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonCreated, jsonErrorResponse, jsonResponse } from '@/lib/response';
import { safeJsonParse } from '@/lib/utils';

export async function POST(req: Request) {
  const body = await req.json();

  const { submissionType, status, notes, approvedBy, assetsRequest, createdBy, requestedBy } = body;

  const data = {
    submissionType,
    status,
    notes,
    approvedBy: JSON.stringify(approvedBy),
    assetsRequest: JSON.stringify(assetsRequest),
    requestedBy,
    createdBy
  }

  // if (!submissionId || !submissionType || !requestedBy) {
  //   return jsonActionFailed("All fields are required.");
  // }

  try {
    const approval = await prisma.approval.create({ data });

    return jsonCreated(approval);
  } catch (error) {
    console.error("Failed to create approval", error);
    return jsonErrorResponse("Failed to create approval.");
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * size;

    // Filter kondisi
    const filters: any = {};
    if (status) {
      filters.status = status;
    }

    const [approvals, total] = await Promise.all([
      prisma.approval.findMany({
        where: filters,
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
      }),
      prisma.approval.count({ where: filters }),
    ]);

    const data = approvals.map((a) => ({
      ...a,
      approvedBy: safeJsonParse(a.approvedBy),
      assetsRequest: safeJsonParse(a.assetsRequest),
    }));

    return jsonResponse({
      data,
      page,
      size,
      total,
    });
  } catch (error) {
    console.error("Failed to fetch approvals", error);
    return jsonErrorResponse("Failed to fetch approvals");
  }
}
