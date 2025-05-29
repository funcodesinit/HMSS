import { Metadata } from 'next'
import React from 'react'
import BillingComp from './components/BillingComp'

export const metadata: Metadata = {
  title: 'Billing',
}

export default function page() {
  return <BillingComp />
   
}