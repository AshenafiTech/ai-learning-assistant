import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../layout/AppLayout';
import Spinner from '../common/Spinner';

const ProtectedRoute = () => {
    const {isAuthenticated, loading} = useAuth()  

    if (loading) {
        return (
          <div className='flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50'>
            <div className='text-center'>
              <Spinner />
              <p className='text-indigo-600/80 mt-4 text-sm font-medium'>Loading...</p>
            </div>
          </div>
        );
      }

  return isAuthenticated ? (
    <AppLayout>
        <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" replace />
    );
}

export default ProtectedRoute
