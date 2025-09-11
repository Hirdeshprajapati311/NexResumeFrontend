'use client'
import {  FilePlus, FileText, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

export const useNavigation = () => {

  const pathname = usePathname();

  const paths = useMemo(() => [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard/>,
      active: pathname.startsWith("/dashboard"),
    },
    {
      name: "Create",
      href: "/create-resume",
      icon: <FilePlus />,
      active: pathname === "/create-resume",
    },
    {
      name: "pdf",
      href: "/pdf",
      icon: <FileText />,
      active: pathname === "/pdf",
    
    }
  ],

    [pathname]);
  return paths
}

