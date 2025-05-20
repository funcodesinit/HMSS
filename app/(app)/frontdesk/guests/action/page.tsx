import React from 'react'
import CreateGuest from './components/CreateGuest'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Create Guest',
}

export default async function page() {
  const guest = await prisma.guest.findMany()
  console.log('guest-----------', guest)
  return <CreateGuest />
}