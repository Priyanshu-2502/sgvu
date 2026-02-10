import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.passwordHash) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 })
  }

  return Response.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
    },
  })
}
