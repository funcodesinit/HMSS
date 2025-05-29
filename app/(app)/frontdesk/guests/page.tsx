<<<<<<< HEAD
import type { Metadata } from 'next'
import CustomerListComp from './components/GuestList'

export const metadata: Metadata = {
  title: 'Guests',
  description: 'List of guests',
}

export default async function Customers() {
  return <CustomerListComp  />
=======
 
 
import type { Metadata } from 'next'
import CustomerListComp from './components/CustomerList'

export const metadata: Metadata = {
  title: 'Customers',
}

export default async function Customers() {

  return <CustomerListComp  />
    
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
}
 
