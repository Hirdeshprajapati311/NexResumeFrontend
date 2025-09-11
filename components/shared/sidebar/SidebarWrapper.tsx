import React, { PropsWithChildren } from 'react';
import DesktopNav from './nav/DesktopNav';
import MobileNav from './nav/MobileNav';

type Props = PropsWithChildren<{}>

const SidebarWrapper = ({children}:Props) => {
  return (
    <div className='w-full h-full p-4 flex flex-col lg:flex-row gap-4'>
      <DesktopNav />
      <MobileNav/>

      <main className='h-[calc(100%-80px)] lg:h-full w-full flex flex-row'>
        {children}
      </main>
      
    </div>
  );
}

export default SidebarWrapper;
