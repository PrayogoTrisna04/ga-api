import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    const isValid = await compare(password, user.password);
    if (!isValid) {
        return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    return NextResponse.json({ token });


}