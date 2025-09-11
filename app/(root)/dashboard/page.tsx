'use client'
import AllResumes from '@/components/AllResumes';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useResume } from '@/hooks/useResume';




const Dashboard = () => {
  const router = useRouter()




  const  {resumes} = useResume()

  return (
    <div className='w-full min-h-0 h-full flex flex-col  gap-4 mt-6'>
      {
        resumes.length === 0 && (
          <Card onClick={() => router.push('/create-resume')} className='cursor-pointer  hover:scale-[101%] h-24 border-8 flex justify-center gap-0 items-center'>
            <h1 className='flex font-semibold text-muted-foreground items-center text-xl'> <Plus /> Create Resume</h1>
            <p className='text-sm'>let's create your first resume</p>
          </Card>
        )

      }

      <AllResumes name='Resumes'/>
      

      <h1 className='underline font-semibold'>Templates</h1>
      <p>soon..</p>
      
    </div>
  );
}

export default Dashboard;
