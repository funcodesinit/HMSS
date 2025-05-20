 
 
import type { Metadata } from 'next'
import CustomerListComp from './components/CustomerList'

export const metadata: Metadata = {
  title: 'Customers',
}

export default async function Customers() {

  return <CustomerListComp  />
    
}
 
