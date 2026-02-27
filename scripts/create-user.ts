import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const plan = (process.argv[3] || 'AGENCY').toUpperCase() as 'FREE' | 'PRO' | 'AGENCY'

  if (!email) {
    console.error('Usage: npx tsx scripts/create-user.ts <email> [plan]')
    process.exit(1)
  }

  const apiKey = plan === 'AGENCY' ? `ps_${crypto.randomBytes(24).toString('hex')}` : null

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: email.split('@')[0],
      plan,
      apiKey,
      monthResetAt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
    update: {
      plan,
      apiKey: apiKey ?? undefined,
    },
  })

  console.log(`✅ User created/updated:`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Plan: ${user.plan}`)
  console.log(`   ID: ${user.id}`)
  if (user.apiKey) console.log(`   API Key: ${user.apiKey}`)
  console.log(`\nThe user can sign in via magic link at the app's login page.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
