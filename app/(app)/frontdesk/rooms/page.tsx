import React from 'react'
import RoomComp from './components/RoomComp'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rooms',
}

export default function page() {
  return (
    <>
      <RoomComp />
    </>
  )
}