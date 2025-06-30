import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password are required.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        // Here you would typically hash the password and save the user to the database.
        // For demonstration purposes, we'll just return a success message.
    }
    console.log(Object.keys(prisma));
    const isValid = await compare(password, user.password);
    if (!isValid) {
        return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }
    return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    })
}