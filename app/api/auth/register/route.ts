import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const payload = {
      email: body.email,
      password: body.password,
      phone: body.phone,
      name: body.name, // matches Prisma User.name
      latitude: body.latitude ?? 0.0,
      longitude: body.longitude ?? 0.0,
    }

    const res = await fetch('http://localhost:8001/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      const errorMessage =
        data?.detail || data?.message || data?.error || 'Registration failed'

      return NextResponse.json(
        { error: errorMessage },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true, user: data })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
