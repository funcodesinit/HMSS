import type { Metadata } from 'next'
import UserListComp from './components/UserList'

export const metadata: Metadata = {
  title: 'Staff users',
  description: 'List of guests',
}

export default async function Customers() {
  return <UserListComp  />
}
 
