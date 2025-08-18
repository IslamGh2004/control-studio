import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to auth page if authentication is required but user is not logged in
        navigate('/auth');
      } else if (!requireAuth && user && location.pathname === '/auth') {
        // Redirect to home if user is logged in but trying to access auth page
        navigate('/');
      }
    }
  }, [user, loading, requireAuth, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  // Don't render children if auth is required but user is not authenticated
  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
};

export default Layout;