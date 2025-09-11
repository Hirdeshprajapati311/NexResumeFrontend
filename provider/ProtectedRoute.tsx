'use client'
import FallbackLogo from '@/components/shared/FallbackLogo';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


interface Props {
  children: React.ReactNode;
}


const ProtectedRoute = ({ children }:Props) => {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname()


  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      const publicPath = ['/signin', '/signup'];

      const isPublic = publicPath.some(path => pathname.startsWith(path))

      if (isPublic) {
        if (token) {
          router.replace('/dashboard')
        }
        setIsLoading(false);
        return;
      }


      if (!token) {
        router.push('/signin');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = await res.json();

        if (res.ok) {
          if (!user.seenOnboarding && pathname !== "/onboarding") {
            router.replace('/onboarding')
            return;
          }
        } else {
          localStorage.removeItem('token');
          router.push('/signin')
        }
      } catch (err) {
        console.log("Auth check failed", err);
        localStorage.removeItem('token');
        router.push('/signin')

      } finally {
        setIsLoading(false)
      }
    }
    checkAuth();

  }, [pathname,router]);

  if(isLoading) return <FallbackLogo/>

  return (
    <>
      {children}
    </>
  );
}

export default ProtectedRoute;
