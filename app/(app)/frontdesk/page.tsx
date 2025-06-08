'use client'
import React, { useEffect } from 'react'
import LoadingComp from './Loading'
import { useRouter } from 'next/navigation'

export default function page() {
    const router = useRouter();

    useEffect(() => {
        router.push('frontdesk/guests')
    }, [router])
    


  return <LoadingComp />
  
}