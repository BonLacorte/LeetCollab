'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link';

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
                    variant: 'destructive',
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
        <div className="flex flex-col items-center">
            <div className="mb-6">
                {/* <img src="" alt="Logo" className="w-12 h-12 border-2 border-gray-500 rounded-full" /> */}
                <h2 className="text-2xl font-bold mt-2">Sign up</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    {/* Name */}
                    <label htmlFor="name" className={labelCssStyles}>
                        Name
                    </label>
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        placeholder='Name'
                        onChange={handleChange}
                        className={inputCssStyles}
                        required
                    />
                    {errors.name && <p className={errorCssStyles}>{errors.name}</p>}

                    {/* Email */}
                    <label htmlFor="email" className={labelCssStyles}>
                        Email
                    </label>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        placeholder='Email'
                        onChange={handleChange}
                        className={inputCssStyles}
                        required
                    />
                    {errors.email && <p className={errorCssStyles}>{errors.email}</p>}   

                    {/* Username */}
                    <label htmlFor="username" className={labelCssStyles}>
                        Username
                    </label>
                    <input
                        type='text'
                        name='username'
                        value={formData.username}
                        placeholder='Username'
                        onChange={handleChange}
                        className={inputCssStyles}
                        required
                    />
                    {errors.username && <p className={errorCssStyles}>{errors.username}</p>}

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
                        required
                    />
                    {errors.password && <p className={errorCssStyles}>{errors.password}</p>}

                    {/* Confirm Password */}
                    <label htmlFor="confirmPassword" className={labelCssStyles}>
                        Confirm Password
                    </label>
                    <input
                        type='password'
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        placeholder='Confirm Password'
                        onChange={handleChange}
                        className={inputCssStyles}
                        required
                    />
                    {errors.confirmPassword && <p className={errorCssStyles}>{errors.confirmPassword}</p>}
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
                    Already have an account? <Link href="/sign-in" className="text-blue-600 hover:underline">Sign in</Link>
                </p>
            </form>
        </div>
    )
}

export default SignUpForm