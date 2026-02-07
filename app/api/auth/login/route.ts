import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Convert to Form Data for OAuth2
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    const res = await fetch('http://localhost:8001/api/v1/auth/login/access-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || 'Login failed' }, { status: res.status })
    }

    // Fetch user details
    const userRes = await fetch('http://localhost:8001/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${data.access_token}`
      }
    })
    
    if (userRes.ok) {
        const userData = await userRes.json()
        return NextResponse.json({
            user: {
                role: 'local',
                name: userData.full_name || userData.email,
                email: userData.email,
                phone: userData.phone,
                latitude: userData.latitude,
                longitude: userData.longitude,
                profile_picture: userData.profile_picture
            },
            token: data.access_token
        })
    }

    return NextResponse.json({ 
        token: data.access_token,
        user: { email, role: 'local', name: 'User' } // Fallback
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
