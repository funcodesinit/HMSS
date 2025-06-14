import type { Metadata } from 'next'
import CustomerListComp from './components/GuestList'

export const metadata: Metadata = {
  title: 'Guests',
  description: 'List of guests',
}

export default async function Customers() {
  return <CustomerListComp  />
}
 
