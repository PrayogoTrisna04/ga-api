import { prisma } from '@/lib/prisma'
import { jsonCreated, jsonErrorResponse, jsonResponse } from '@/lib/response';

// GET: Get all submission details
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const size = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const type = searchParams.get("type");
    const state = searchParams.get("state");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where:any = {};
    if (type) where.submissionType = type;
    if (state === "draft") where.Approval = { none: {} };
    if (state === "pending") where.Approval = { some: { status: "waiting_approval" } };
    if (state === "approved") where.Approval = { some: { status: "approved" } };
    if (state === "rejected") where.Approval = { some: { status: "rejected" } };

    const skip = (page - 1) * size;
    const [rows, total] = await Promise.all([
      prisma.submissionDetail.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: size,
        include: { Approval: true },
      }),
      prisma.submissionDetail.count({ where }),
    ]);

    return jsonResponse({ data: rows, page, size, total });
  } catch (e) {
    console.error(e);
    return jsonErrorResponse("Failed to fetch submissions");
  }
}


// POST: Create new submission detail
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.submissionDetail.create({ data: body });
    return jsonCreated(created);
  } catch (e) {
    console.error(e);
    return jsonErrorResponse("Failed to create submission");
  }
}

