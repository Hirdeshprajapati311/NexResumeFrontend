import AuthWrapper from '@/components/shared/auth/AuthWrapper';
import SignInForm from '@/components/SignInForm';
import React from 'react';

const SignIn = () => {
  return (
    <AuthWrapper>
      <SignInForm />
    </AuthWrapper>
  );
}

export default SignIn;
