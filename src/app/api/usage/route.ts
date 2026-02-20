import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { analysisCount: true, monthResetAt: true },
  })

  return NextResponse.json(user || { analysisCount: 0, monthResetAt: new Date().toISOString() })
}
