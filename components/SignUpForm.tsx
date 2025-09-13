'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { register as Register } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'


const schema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be at most 20 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(20, { message: 'Password must be at most 20 characters' }),
})

type FormValues = z.infer<typeof schema>

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await Register(data)
      toast.success("Account created successfully!")
      console.log(res);
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        // fallback for non-Error values
        toast.error("An unknown error occurred");
        console.error(err);
      }
    }
  }

  return (
    <Card className="w-[500px] min-w-[300px] p-6 dark:bg-muted bg-zinc-100 shadow-lg rounded-xl gap-4">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Username */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full cursor-pointer">
            Sign Up
          </Button>
        </form>

        <p className='flex gap-1 self-end mt-2 text-sm'>Already registered |
          <Link className='text-blue-500 hover:underline' href="/signin"> Sign In</Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignUpForm
