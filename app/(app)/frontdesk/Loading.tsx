import React from 'react'
import Image from 'next/image'

export default function LoadingComp() {
  return <div className=' gap-2 justify-items-center content-center h-screen'>
  <div className='animate-bounce '> 
    <Image src="/logo.png" width={100} height={100} alt='logo' />
  </div>
</div>

}