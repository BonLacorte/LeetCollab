'use client'

import React, { useState } from 'react'
import Link from 'next/link'
// import GoogleSignInButton from '.../'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'

type Props = {}

// Infer the type from the schema
type SignInFormData = z.infer<typeof signInSchema>

// Define the Zod schema for sign-in form data
const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

const SignInForm = (props: Props) => {
    const router = useRouter()
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<Partial<SignInFormData>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
        // Clear the error for this field when the user starts typing
        setErrors({
            ...errors,
            [name]: undefined,
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            // Validate the form data
            signInSchema.parse(formData)
            
            // // If validation passes, attempt to sign in
            // const signInData = await signIn('credentials', {
            //     email: formData.email,
            //     password: formData.password,
            //     redirect: false,
            // })

            // if (signInData?.error) {
            //     toast({
            //         title: 'Error',
            //         description: "Something went wrong",
            //         variant: 'destructive',
            //     })
            //     console.log(signInData.error)
            //     setErrors({ password: 'Invalid email or password' })
            // } else {
            //     router.refresh()
            //     router.push('/')
            // }

            // If validation passes, attempt to sign in
            signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            }).then((signInData) => {
                if (signInData?.error) {
                    toast({
                        title: 'Error',
                        description: "Something went wrong",
                        variant: 'destructive',
                    })
                    console.log(signInData.error)
                    setErrors({ password: 'Invalid email or password' })
                } else {
                    router.refresh()
                    router.push('/')
                }
            })

        } catch (error) {
            if (error instanceof z.ZodError) {
                // Set form errors
                const fieldErrors: Partial<SignInFormData> = {}
                error.errors.forEach((err) => {
                    if (err.path[0] as keyof SignInFormData) {
                        fieldErrors[err.path[0] as keyof SignInFormData] = err.message
                    }
                })
                setErrors(fieldErrors)
            }
        }
    }

    const labelCssStyles = "block text-sm font-medium text-gray-700"
    const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
    const errorCssStyles = "text-red-500 text-sm mt-1"

    return (
        <div className="flex flex-col items-center">
            <div className="mb-6">
                {/* <img src="" alt="Logo" className="w-12 h-12 border-2 border-gray-500 rounded-full" /> */}
                <h2 className="text-2xl font-bold mt-2">Sign in</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    {/* Email */}
                    <label htmlFor="email" className="w-full max-w-sm">
                        Email
                    </label>
                    <input
                        type='text'
                        name='email'
                        value={formData.email}
                        placeholder='Email'
                        onChange={handleChange}
                        className={inputCssStyles}
                    />
                    {errors.email && <p className={errorCssStyles}>{errors.email}</p>}

                    {/* Password */}
                    <label htmlFor="password" className={labelCssStyles}>
                        Password
                    </label>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        placeholder='Password'
                        onChange={handleChange}
                        className={inputCssStyles}
                    />
                    {errors.password && <p className={errorCssStyles}>{errors.password}</p>}
                </div>

                <button type="submit" className="w-full bg-black text-white font-semibold py-2 px-4 rounded-md mb-4">
                    Continue
                </button>

                <div className="text-center text-sm text-gray-500 mb-4">OR</div>

                <button type="button" className="w-full border border-gray-300 text-black font-semibold py-2 px-4 rounded-md mb-2 flex items-center justify-center">
                    <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
                    Continue with Google
                </button>

                <p className="text-center text-sm text-gray-600">
                    Don't have an account? <Link href="/sign-up" className="text-blue-600 hover:underline">Sign up</Link>
                </p>
            </form>
        </div>
    )
}

export default SignInForm