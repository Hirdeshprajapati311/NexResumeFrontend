'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'





const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
})

type FormValues = z.infer<typeof schema>




const SignInForm = () => {

  const router = useRouter()

  const { register, handleSubmit, formState: { errors,isSubmitting },
    reset  } = useForm<FormValues>({
    resolver:zodResolver(schema)
    })
  



  const onSubmit = async (data: FormValues) => {
    try {
      const {token,user} = await login(data)
      localStorage.setItem("token",token)
      reset()

      if (user.seenOnboarding) {
        router.replace("/dashboard")
      } else {
        router.replace("/onboarding")
      }

      toast.success("Login successfull!")
      console.log("Token:",token);
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <Card className="w-[500px] min-w-[300px] p-6 dark:bg-muted bg-zinc-100 shadow-lg rounded-xl gap-4">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>

      <CardContent className='flex flex-col'>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className='gap-1 flex-col flex'>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <p className='text-sm text-red-500'>{errors.email?.message}</p>}
          </div>

          <div className='gap-1 flex-col flex'>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full cursor-pointer">
            {isSubmitting? "Signing In...":"Sign In"}
          </Button>
        </form>

        <p className='flex gap-1 self-end mt-2 text-sm'>Don't have an account |
        <a className='text-blue-500 hover:underline' href="/signup"> Sign Up</a>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignInForm
