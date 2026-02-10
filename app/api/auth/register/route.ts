import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { email, password, name, phone } = await req.json()

  if (!email || !password) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  // 1️ hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // 2️ save to passwordHash
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      phone,
    },
  })

  return Response.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
    },
  })
}
