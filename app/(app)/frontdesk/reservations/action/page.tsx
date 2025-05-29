import React from 'react'
import { Metadata } from 'next'
import CreateReserve from './components/CreateComp'

export const metadata: Metadata = {
  title: 'Create reservation',
}

export default async function page() { 
  return <CreateReserve />
}