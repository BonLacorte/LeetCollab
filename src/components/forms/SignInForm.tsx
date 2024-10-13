'use client'

import React, { useState } from 'react'
import Link from 'next/link'
// import GoogleSignInButton from '.../'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { Input } from '../ui/input'
import leetcollabLogo from '@/lib/problems/images/leetcollab-no-bg.png'
import Image from 'next/image'
import { Button } from '../ui/button'

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
                        className: "bg-white text-gray-900 border border-gray-200 shadow-xl rounded-xl",
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

    const labelCssStyles = "block text-sm font-medium text-gray-900"
    const errorCssStyles = "text-red-500 text-sm mt-1"

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="flex flex-col items-center justify-center bg-white p-16 rounded-xl shadow-xl w-full md:w-3/5 lg:w-2/5">
                <div className=" mb-6">
                    <Image src={leetcollabLogo} alt="Logo" width={50} height={50} />
                </div>
                <h2 className="text-2xl font-bold mb-8">Sign in</h2>
                <form onSubmit={handleSubmit} className='w-full'>
                    <div className="flex flex-col gap-8 mb-8">
                        <div className='flex flex-col gap-2'>
                            {/* Email */}
                            <label htmlFor="email" className="w-full max-w-sm">
                                Email
                            </label>
                            <Input
                                type='text'
                                name='email'
                                value={formData.email}
                                placeholder='Email'
                                onChange={handleChange}
                            />
                            {errors.email && <p className={errorCssStyles}>{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="password" className={labelCssStyles}>
                                Password
                            </label>
                            <Input
                                type='password'
                                name='password'
                                value={formData.password}
                                placeholder='Password'
                                onChange={handleChange}
                            />
                            {errors.password && <p className={errorCssStyles}>{errors.password}</p>}
                        </div>
                    </div>

                    <div className='flex justify-center w-full'>
                        <Button type="submit" className="w-full items-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50">
                            Continue
                        </Button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account? <Link href="/sign-up" className="text-blue-600 hover:underline">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignInForm