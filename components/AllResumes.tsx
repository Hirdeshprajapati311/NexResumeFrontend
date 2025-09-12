'use client'
import React from 'react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { useResume } from '@/hooks/useResume';
import { EllipsisVertical } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from './ui/popover';
import { useRouter } from 'next/navigation';
import { deleteResume } from '@/lib/api';
import useUser from '@/hooks/useUser';

const AllResumes = ({ name, className }: { name: string; className?: string }) => {
  const { resumes, loading, error,setResumes } = useResume();
  const {token} = useUser()
  const router = useRouter(); 

  const handleDelete = async (id: string) => {
    if (!token) {
      console.error("No token available");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      await deleteResume(token, id);
      setResumes((prev: any[]) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      console.error("Delete failed:", err.message);
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <>
      <h1 className="underline font-semibold">{name}</h1>

      <Card className={cn(`bg-blend-exclusion w-full p-2 min-h-72 ${className}`)}>
        {loading ? (
          <Card className="h-full flex items-center justify-center bg-muted rounded-xl">
            Loading...
          </Card>
        ) : error ? (
          <Card className="h-full flex items-center justify-center bg-muted rounded-xl">
            {error}
          </Card>
        ) : resumes.length === 0 ? (
          <Card className="h-full flex items-center justify-center bg-muted rounded-xl">
            No resumes as of yet...
          </Card>
        ) : (
          <div className="h-full flex   flex-wrap lg:gap-2 justify-evenly lg:justify-normal overflow-y-auto bg-muted rounded-xl p-2">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="p-2 w-34 h-20 rounded dark:bg-black bg-slate-200 border-black dark:border-white dark:hover:bg-gray-900 cursor-pointer flex justify-between flex-col border-2 hover:bg-accent"
              >
                <div className='flex flex-row justify-between'>
                  <h2 className="font-bold truncate">{resume.title}</h2>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className='cursor-pointer' onClick={(e) => e.stopPropagation()}>
                        <EllipsisVertical className="w-5 h-5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" className="w-40 p-1">
                      <div className="space-y-1">
                        <button
                          onClick={() => router.push(`/edit-resume/${resume._id}`)}
                          className="w-full text-left cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(resume._id)} className="w-full text-left cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500">
                          Delete
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current Version: {(resume.currentVersionId as any)?.version}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default AllResumes;
