import React from 'react'
import CreateGuest from '../../guests/action/components/CreateGuest';

interface PageProps {
  params: Promise<{ id: string }>;
}


export default async function page({ params }: PageProps) {
  const { id } = await params;
  return  <CreateGuest id={id} />
}
