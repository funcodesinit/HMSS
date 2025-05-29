 

import React from 'react'
import SignInComp from './components/SignIn'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Sign-in Frontdesk",
  description: "Rustiek hotel frontdesk signin.",
};


export default function page() {
  return (
    <>
      <SignInComp />
    </>
  )
}