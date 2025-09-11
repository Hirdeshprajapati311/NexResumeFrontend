import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{}>

const AuthWrapper = ({ children }: Props) => {


  return (
    <div className='w-full h-screen flex items-center justify-center p-10'>
      {children}

    </div>
  );
}

export default AuthWrapper;
