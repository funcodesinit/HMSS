import React from 'react'
import CreateGuest from './components/CreateGuest'
import { Metadata } from 'next'
<<<<<<< HEAD
=======
import { prisma } from '@/lib/prisma'
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f

export const metadata: Metadata = {
  title: 'Create Guest',
}

<<<<<<< HEAD
export default async function page() { 
=======
export default async function page() {
  const guest = await prisma.guest.findMany()
  console.log('guest-----------', guest)
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
  return <CreateGuest />
}