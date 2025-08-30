import { prisma } from "@/lib/prisma";
import { jsonDeleted, jsonDetail, jsonErrorResponse, jsonNotFound, jsonUpdated } from "@/lib/response";
import { NextRequest } from "next/server";
// Get by Id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!asset) return jsonNotFound();

    return jsonDetail(asset);
  } catch (e) {
    console.error('Get asset by ID error:', e)
    return jsonErrorResponse('Get asset by ID error');
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params; // ← ambil id dari context
  const { name, categoryId } = await req.json();

  const updated = await prisma.asset.update({
    where: { id },
    data: { name, categoryId },
  });

  return jsonUpdated(updated);
}

// Delete Asset
export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.asset.update({
      where: { id },
      data: { is_deleted: true },
    })

    return jsonDeleted()
  } catch {
    return jsonErrorResponse('failed to delete category!')
  }
}