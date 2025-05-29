import React from 'react'
import SalesComp from './components/SalesComp'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'POS Transaction',
}


export default function page() {
  return  <SalesComp />
}