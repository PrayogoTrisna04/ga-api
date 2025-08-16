// import { getToken } from "@/lib/auth";
// import { authorize } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import { jsonActionFailed, jsonDeleted, jsonDetail, jsonErrorResponse, jsonUpdated } from "@/lib/response";

// update category
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { name, prefix } = await req.json();

    if (!name || !prefix) return jsonActionFailed('Name and prefix are required');

    try {
        // const token = getToken();
        // authorize(token, ['ADMIN', 'GA']); // hanya ADMIN atau GA
        const updated = await prisma.category.update({
            where: { id },
            data: { name, prefix }
        });
        return jsonUpdated(updated);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'FORBIDDEN') {
                return jsonActionFailed('forbidden', 403)
            }
            return jsonActionFailed(error.message, 500);
        }

        return jsonActionFailed('Internal Server Error', 500);
    }
}

// Delete Category
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        // const token = getToken();
        // authorize(token, ['ADMIN', 'GA']); // hanya ADMIN atau GA
        await prisma.category.delete({ where: { id } });
        return jsonDeleted();
    } catch {
        return jsonErrorResponse('failed to delete category!');
    }
}

// Get by Id
export async function GET(_: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const category = await prisma.category.findUnique({
            where: { id }
        });

        if (!category) {
            return jsonErrorResponse('Category not found');
        }

        return jsonDetail(category);
    } catch {
        return jsonErrorResponse('Failed to fetch category');
    }
}
