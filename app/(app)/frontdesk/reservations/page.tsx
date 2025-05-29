import React from 'react'
import ReserveComp from './components/ReserveComp'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reservations',
}


export default function page() {
  return (
    <>
      <ReserveComp />
    </>
  )
}