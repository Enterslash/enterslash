import React from 'react';
import { useAuthStore } from '../store/authStore';
import AuthError from './AuthError';

type Props = {
  children: JSX.Element;
};

export default function Private({ children }: Props) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <AuthError />;
  } else {
    return children;
  }
}
