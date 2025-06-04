import { Metadata } from 'next'
import React from 'react'
import BillingComp from './components/OrderComp'
import OrdersComp from './components/OrderComp'

export const metadata: Metadata = {
  title: 'Orders',
}

export default function page() {
  return <OrdersComp />
   
}