import AuthWrapper from '@/components/shared/auth/AuthWrapper';
import SignUpForm from '@/components/SignUpForm';
import React from 'react';

const SignUp = () => {
  return (
    <AuthWrapper>
      <SignUpForm />
    </AuthWrapper>
  );
}

export default SignUp;
