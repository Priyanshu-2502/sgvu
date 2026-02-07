import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Frontend sends: name, email, phone, password, otp
    
    // Default lat/lon if missing (to avoid errors if frontend isn't updated yet)
    // We will update frontend to send them next.
    const payload = {
        email: body.email,
        password: body.password,
        phone: body.phone,
        full_name: body.name,
        latitude: body.latitude || 0.0,
        longitude: body.longitude || 0.0
    }

    const res = await fetch('http://localhost:8001/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || 'Registration failed' }, { status: res.status })
    }

    return NextResponse.json({ success: true, user: data })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
