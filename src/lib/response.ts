import { NextResponse } from 'next/server'

interface JsonResponseOptions<T> {
    data: T
    page?: number
    size?: number
    total?: number
    success?: boolean
    code?: number
}

export function jsonResponse<T>({
    data,
    page,
    size,
    total,
    success = true,
    code = 200,
}: JsonResponseOptions<T>) {
    const hasPagination =
        typeof page === 'number' && typeof size === 'number' && typeof total === 'number'

    return NextResponse.json(
        {
            data: data ?? [],
            success,
            code,
            ...(hasPagination && {
                meta: {
                    page,
                    size,
                    total,
                    totalPages: Math.ceil(total / size),
                },
            }),
        },
        { status: code }
    )
}

export function jsonErrorResponse(message: string, code = 500) {
    return NextResponse.json(
        {
            data: [],
            success: false,
            code,
            error: message,
        },
        { status: code }
    )
}

export function jsonValidationError(message: string) {
    return NextResponse.json(
        {
            data: [],
            success: false,
            code: 422,
            message,
        },
        { status: 422 }
    )
}

export function jsonCreated<T>(data: T, message = 'Created') {
    return NextResponse.json(
        {
            data,
            success: true,
            code: 201,
            message,
        },
        { status: 201 }
    )
}

export function jsonUpdated<T>(data: T, message = 'Updated') {
    return NextResponse.json(
        {
            data,
            success: true,
            code: 200,
            message,
        },
        { status: 200 }
    )
}

export function jsonActionFailed(message = 'Action failed', code = 400) {
    return NextResponse.json(
        {
            data: [],
            success: false,
            code,
            error: message,
        },
        { status: code }
    )
}

export function jsonDetail<T>(data: T | null, message = 'OK') {
    return NextResponse.json(
        {
            data,
            success: true,
            code: 200,
            message,
        },
        { status: 200 }
    )
}

export function jsonNotFound(message = 'Data not found') {
    return NextResponse.json(
        {
            data: null,
            success: false,
            code: 404,
            error: message,
        },
        { status: 404 }
    )
}

