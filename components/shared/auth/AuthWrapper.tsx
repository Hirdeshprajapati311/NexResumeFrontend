


const AuthWrapper:React.FC<React.PropsWithChildren> = ({ children }) => {


  return (
    <div className='w-full h-screen flex items-center justify-center p-10'>
      {children}

    </div>
  );
}

export default AuthWrapper;
