'use client'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import * as Yup from 'yup';
import { Formik } from 'formik'
import { signIn, SignInResponse } from "next-auth/react";
import React from 'react'
import FormikInput from '@/components/app/FormikField'
import { useRouter } from "next/navigation";

let LoginSchema = Yup.object({
  email: Yup.string().required("First name is required."),
  password: Yup.string().required("Password is required."),
});

export default function SignInComp() {

  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter();


  const handleSubmit = async (values: any) => {
    setLoading(true);
    // const signInData =  {
    //   email: values.email,
    //   password: values.password,
    //   redirect: false, 
    //   callbackUrl: '/frontdesk',
    // }
    const signInData = {
      email: values.email,
      password: values.password,
      // redirect: false, // Prevent automatic redirection
      callbackUrl: '/frontdesk', // Specify the callback URL
     };


    const signin = await signIn('credentials', signInData) as any;//as  SignInResponse;

    if (signin.error) {
      console.log("Signin Error:", signin); // Log the error object for debugging
      setError("Invalid Credentials, please check your phone number and password.");
      setLoading(false); // Reset loading state when error occurs
    } else {
      router.push('/frontdesk');
    }
    setLoading(false);

  }


  return (
    <AuthLayout>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}

      >
        {({
          touched,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form method="post" onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
            {/* <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" /> */}

            <Heading>Frontdesk signin</Heading>

            {error && (
              <div className="text-red-500 text-sm ">
                {error} testing
              </div>
            )}

            <FormikInput name="email" type="email" label="Email" />

            <FormikInput name="password" type="password" label="Password" />


            {/* <div className="flex items-center justify-between">
              <CheckboxField>
                <Checkbox name="remember" />
                <Label>Remember me</Label>
              </CheckboxField>
              <Text>
                <TextLink href="#">
                  <Strong>Forgot password?</Strong>
                </TextLink>
              </Text>
            </div> */}

            <Button type="submit" disabled={isSubmitting || loading}>
              {loading ? "Loading..." : "Login"}
            </Button>


            <Text>
              Only staff and admin authentication{' '}

            </Text>
          </form>
        )}
      </Formik>
    </AuthLayout>
  )
}