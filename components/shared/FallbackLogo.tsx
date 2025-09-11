import Image from 'next/image';
import React from 'react';



const FallbackLogo = () => {
  return (
    <div className='flex justify-center items-center h-screen w-screen'>
      <Image src="/logo2.svg" alt='logo' height={100} width={100} sizes='icon' />
      
    </div>
  );
}

export default FallbackLogo;
