import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{}>

const layout = ({children}:Props) => {
  return (
    <div>
      {children}
    </div>
  );
}

export default layout;
