'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link';
import leetcollabLogo from '@/lib/problems/images/leetcollab-no-bg.png'
import Image from 'next/image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type Props = {}

// Define the Zod schema for sign-up form data
const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Infer the type from the schema
type SignUpFormData = z.infer<typeof signUpSchema>

const SignUpForm = (props: Props) => {
    const router = useRouter();
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        image: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    });
    const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear the error for this field when the user starts typing
        setErrors({
            ...errors,
            [name]: undefined,
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrors({});

        try {
            // Validate the form data
            signUpSchema.parse(formData);

            // If validation passes, attempt to register
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                toast({
                    title: 'Error',
                    description: "Something went wrong",
                    className: "bg-white text-gray-900 border border-gray-200 shadow-xl rounded-xl"
                })
                const data = await res.json();
                setErrors({ email: data.error || 'An error occurred' });
            } else {
                router.push('/sign-in');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Set form errors
                const fieldErrors: Partial<SignUpFormData> = {};
                error.errors.forEach((err) => {
                    if (err.path[0] as keyof SignUpFormData) {
                        fieldErrors[err.path[0] as keyof SignUpFormData] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
        }
    }

    const labelCssStyles = "block text-sm font-medium text-gray-700";
    const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";
    const errorCssStyles = "text-red-500 text-sm mt-1";

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="flex flex-col items-center bg-white p-16 rounded-xl shadow-xl w-full md:w-3/5 xl:w-2/5">
                <div className="mb-6">
                    <Image src={leetcollabLogo} alt="Logo" width={50} height={50} />
                </div>
                <h2 className="text-2xl font-bold mb-8">Sign up</h2>
                <form onSubmit={handleSubmit} className='w-full'>
                    <div className="flex flex-col gap-4 mb-8">
                        {/* Name */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="name" className={labelCssStyles}>
                                Name
                            </label>
                            <Input
                                type='text'
                                name='name'
                                value={formData.name}
                                placeholder='Name'
                                onChange={handleChange}
                                // required
                            />
                            {errors.name && <p className={errorCssStyles}>{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="email" className={labelCssStyles}>
                                Email
                            </label>
                            <Input
                                type='email'
                                name='email'
                                value={formData.email}
                                placeholder='Email'
                                onChange={handleChange}
                                // required
                            />
                            {errors.email && <p className={errorCssStyles}>{errors.email}</p>}   
                        </div>

                        {/* Username */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="username" className={labelCssStyles}>
                                Username
                            </label>
                            <Input
                                type='text'
                                name='username'
                                value={formData.username}
                                placeholder='Username'
                                onChange={handleChange}
                                // required
                            />
                            {errors.username && <p className={errorCssStyles}>{errors.username}</p>}
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
                                // required
                            />
                            {errors.password && <p className={errorCssStyles}>{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="confirmPassword" className={labelCssStyles}>
                                Confirm Password
                            </label>
                            <Input
                                type='password'
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                placeholder='Confirm Password'
                                onChange={handleChange}
                                // required
                            />
                            {errors.confirmPassword && <p className={errorCssStyles}>{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className='flex justify-center w-full'>
                        <Button type="submit" className="w-full items-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50">
                            Continue
                        </Button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account? <Link href="/sign-in" className="text-blue-600 hover:underline">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUpForm