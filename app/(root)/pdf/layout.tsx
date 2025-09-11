import React from 'react';

type Props = React.PropsWithChildren<{}>

const PDFLayout = ({children}:Props) => {
  return (
    <div className='flex w-full h-full flex-col gap-4'>
      {children}
    </div>
  );
}

export default PDFLayout;
