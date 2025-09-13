import React from 'react';


const PDFLayout:React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <div className='flex w-full h-full flex-col gap-4'>
      {children}
    </div>
  );
}

export default PDFLayout;
