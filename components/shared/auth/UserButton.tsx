'use client'
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useUser from '@/hooks/useUser';

const UserButton = () => {

  const { user, loading,logout } = useUser()
  
  const handleLogOut = async () => {
    await logout()
    window.location.href = '/signin';
  }

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>

            <Button className='rounded-full cursor-pointer flex justify-center items-center h-8 w-8'>
              <User/>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side='right'>
          <p>{user?.username || "User"}</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent align="start" className="w-fit min-w-60">
        

        {loading ? (
          <>
            <span className='font-bold '>Manage User</span>
            <p className='text-sm text-muted-foreground'>Loading...</p></>
        ) : user ? (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2">
              <User className="w-8 h-8 rounded-full bg-zinc-100 p-1" />
              <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
              </div>
            </div>
            <Button onClick={handleLogOut} variant="outline" className="mt-4 cursor-pointer w-full">
                Sign Out
                <LogOut/>
            </Button>
          </div>
          ) : (
              <p></p>
        )}
        
      </PopoverContent>
    </Popover>
  );
};

export default UserButton;
