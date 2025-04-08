"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { signIn } from 'next-auth/react'
function Page() {


  const handleLogin =()=>{
  signIn('google',{
    callbackUrl:'/'
   })
  }

  return (

    <div className=' flex  justify-center items-center min-h-screen'>
      
      <Button onClick={handleLogin}>
        LOGIN WITH GOOGLE
      </Button>
    </div>
  )
}

export default Page
