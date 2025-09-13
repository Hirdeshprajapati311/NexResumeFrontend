import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper';
import React from 'react';



const Layout:React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <SidebarWrapper>
      {children}
      
    </SidebarWrapper>
  );
}

export default Layout;
