import {  ArrowRightIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Welcome to the Front Desk</h1>
        <Link href={'/frontdesk/guests'}>
            <div className='flex gap-2 my-4'><span>Continue to dashboard </span><ArrowRightIcon className='size-6'/></div>
        </Link>
    </div>
  )
}