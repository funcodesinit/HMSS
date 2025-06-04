import React from 'react'
import DetailsProdFormComp from './component/DetailsProdFormComp';


interface PageProps {
  params: Promise<{ id: string }>;
}



export default async function page({ params }: PageProps) {
  const { id } = await params;

  return <DetailsProdFormComp id={id} />
}