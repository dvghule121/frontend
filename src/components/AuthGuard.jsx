import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from '@tanstack/react-router';

const AuthGuard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => {
    console.log('AuthGuard - useSelector state.auth:', state.auth);
    return state.auth;
  });

  useEffect(() => {
    console.log('AuthGuard - isAuthenticated changed:', isAuthenticated);
    if (!isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, navigate]);

  console.log('AuthGuard - isAuthenticated (render):', isAuthenticated);

  if (!isAuthenticated) {
    return null; // Return null while navigation is happening
  }

  return <Outlet />;
};

export default AuthGuard;