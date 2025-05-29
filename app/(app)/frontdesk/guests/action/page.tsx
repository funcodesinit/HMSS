import React from 'react'
import CreateGuest from './components/CreateGuest'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Guest',
}

export default async function page() { 
  return <CreateGuest />
}