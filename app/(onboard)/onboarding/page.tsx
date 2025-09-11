'use client'
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Onboarding = () => {

  const router = useRouter()
  const { user, loading,setUser } = useUser()

  useEffect(() => {
    if (!loading && user?.seenOnboarding) {
      router.replace("/dashboard");
    }
  }, [user?.seenOnboarding, loading, router])

  const updateOnboardingStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch('http://localhost:5000/api/auth/skip-onboarding', {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (user) {
      setUser({ ...user, seenOnboarding: true });
    }
  }

  const handleCreateResume = async () => {
    await updateOnboardingStatus()
    router.replace("/create-resume")
  }



  const handleSkip = async () => {
    await updateOnboardingStatus()
    router.replace("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome! <span className='underline text-muted-foreground'>{user?.username}</span> 🎉</h1>
      <p className="text-gray-600">Let’s get you started by creating your first resume.</p>
      <div className="flex gap-4 mt-6">
        <Button className='cursor-pointer' onClick={handleCreateResume}>Create Resume</Button>
        <Button className='cursor-pointer' variant="secondary" onClick={handleSkip}>Skip for now</Button>
      </div>
    </div>
  );
}

export default Onboarding;
