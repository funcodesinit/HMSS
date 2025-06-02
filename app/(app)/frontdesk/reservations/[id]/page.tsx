import React from 'react'
import { Metadata } from 'next'
import CreateReserve from '../action/components/CreateComp';

export const metadata: Metadata = {
  title: 'Create reservation',
}

interface PageProps {
  params: Promise<{ id: string }>;
}


export default async function page({ params }: PageProps) {
     const { id } = await params; 
  return <CreateReserve id={id} />
}   