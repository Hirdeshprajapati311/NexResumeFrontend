'use client'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigation } from '@/hooks/useNavigation';
import Link from 'next/link';
import React from 'react';
import UserButton from '../../auth/UserButton';
import { ModeToggle } from '../../ToggleButton';

const MobileNav = () => {

  const path = useNavigation()

  return (
    <Card className='lg:hidden flex items-center h-16 p-2 fixed bottom-4 w-[calc(100vw-32px)]  justify-center'>

      <nav className='w-full'>
        <ul className='flex justify-evenly w-full items-center'>
          {path.map((path, id) => {
            return (
              <li key={id} className='relative'>
                <Link href={path.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className='cursor-pointer' size="icon" variant={path.active ? "default" : "outline"}>
                        {path.icon}
                      </Button>

                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{path.name}</p>
                    </TooltipContent>

                  </Tooltip>
                
                </Link>

              </li>
            )
          })}
          
            <ModeToggle />
            <UserButton />
         

        </ul>

      </nav>
      
    </Card>
  );
}

export default MobileNav;
