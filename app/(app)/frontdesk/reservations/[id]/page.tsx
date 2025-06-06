import React from 'react'
import { Metadata } from 'next'
import ResDetailComp from './components/resDetailComp';

export const metadata: Metadata = {
  title: 'view reservation',
}

interface PageProps {
  params: Promise<{ id: string }>;
}


export default async function page({ params }: PageProps) {
  const { id } = await params;
  return <ResDetailComp id={id} />
}   