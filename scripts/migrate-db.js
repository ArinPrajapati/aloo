#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * This script helps ensure your database is properly set up for the new chat system.
 * Run this after setting up your DATABASE_URL environment variable.
 */

const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()

  try {
    console.log('🔄 Checking database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Check if tables exist by trying to count chats
    const chatCount = await prisma.chat.count()
    console.log(`✅ Chat table exists with ${chatCount} records`)

    const messageCount = await prisma.message.count()
    console.log(`✅ Message table exists with ${messageCount} records`)

    console.log('\n🎉 Database is ready for the new chat system!')
    console.log('\nNext steps:')
    console.log('1. Start your application: npm run dev')
    console.log('2. Login to your app - any existing localStorage data will be automatically migrated')
    console.log('3. Your chat history will now be stored in the database')

  } catch (error) {
    console.error('❌ Database setup error:', error)
    console.log('\nTroubleshooting:')
    console.log('1. Make sure your DATABASE_URL environment variable is set correctly')
    console.log('2. Ensure your MongoDB database is running and accessible')
    console.log('3. Run "npx prisma generate" to generate the Prisma client')
    console.log('4. Run "npx prisma db push" to sync your database schema')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('Script error:', error)
    process.exit(1)
  })
