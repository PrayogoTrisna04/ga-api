import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
        }
        //cek duplikat
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 });
        }

        const hashed = await hash(password,10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                name: 'New User',
                role: 'USER'
            },
        });
        return NextResponse.json({ id: user.id, email: user.email })
    } catch (error) {
        console.error('Registration error:', error);
        return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 500 });
    }
}