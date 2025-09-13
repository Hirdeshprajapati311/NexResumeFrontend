import React from 'react';


const layout:React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <div>
      {children}
    </div>
  );
}

export default layout;
