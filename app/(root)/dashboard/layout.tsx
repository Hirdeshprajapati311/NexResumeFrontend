'use client'
import useUser from '@/hooks/useUser';
import React from 'react';

type Props = React.PropsWithChildren<{}>

const DashboardLayout = ({ children }: Props) => {
  
  const {user} = useUser()

  return (
    <div className='w-full h-full'>
      <p className='w-fit font-serif mt-6 underline'>Hello! <span className='text-md font-semibold text-muted-foreground slide-in-from-end-translate-full transition-all font-sans underline duration-500'>{user?.username}</span></p>
      {children}
    </div>
  );
}

export default DashboardLayout;
