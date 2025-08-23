import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  is_banned?: boolean;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Use mock data for now since we don't have profiles table yet
      setUsers([
          {
            id: '1',
            email: 'ahmed.mohammed@email.com',
            name: 'أحمد محمد علي',
            avatar_url: '/placeholder.svg',
            phone: '+20123456789',
            created_at: '2024-01-15T00:00:00Z',
            last_sign_in_at: '2024-08-16T10:30:00Z',
            email_confirmed_at: '2024-01-15T01:00:00Z',
            is_banned: false
          },
          {
            id: '2',
            email: 'fatima.khaled@email.com',
            name: 'فاطمة خالد',
            avatar_url: '/placeholder.svg',
            phone: '+966123456789',
            created_at: '2024-01-10T00:00:00Z',
            last_sign_in_at: '2024-08-15T14:20:00Z',
            email_confirmed_at: '2024-01-10T02:00:00Z',
            is_banned: false
          },
          {
            id: '3',
            email: 'mohammed.abdullah@email.com',
            name: 'محمد عبدالله',
            avatar_url: '/placeholder.svg',
            phone: '+971123456789',
            created_at: '2024-01-08T00:00:00Z',
            last_sign_in_at: '2024-08-10T09:15:00Z',
            email_confirmed_at: '2024-01-08T03:00:00Z',
            is_banned: true
          },
          {
            id: '4',
            email: 'nour.alhuda@email.com',
            name: 'نور الهدى',
            avatar_url: '/placeholder.svg',
            phone: '+962123456789',
            created_at: '2024-01-05T00:00:00Z',
            last_sign_in_at: '2024-08-12T16:45:00Z',
            email_confirmed_at: '2024-01-05T04:00:00Z',
            is_banned: false
          },
          {
            id: '5',
            email: 'omar.hassan@email.com',
            name: 'عمر حسن',
            avatar_url: '/placeholder.svg',
            phone: '+212123456789',
            created_at: '2024-01-03T00:00:00Z',
            last_sign_in_at: '2024-08-14T11:30:00Z',
            email_confirmed_at: null,
            is_banned: false
          }
        ]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل المستخدمين',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId: string) => {
    try {
      // This would need to be implemented with admin functions
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_banned: true } : user
      ));
      
      toast({
        title: 'تم الحظر',
        description: 'تم حظر المستخدم بنجاح',
      });
      return { success: true };
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حظر المستخدم',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_banned: false } : user
      ));
      
      toast({
        title: 'تم إلغاء الحظر',
        description: 'تم إلغاء حظر المستخدم بنجاح',
      });
      return { success: true };
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في إلغاء حظر المستخدم',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المستخدم بنجاح',
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف المستخدم',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => !u.is_banned).length;
    const bannedUsers = users.filter(u => u.is_banned).length;
    const verifiedUsers = users.filter(u => u.email_confirmed_at).length;
    
    return {
      totalUsers,
      activeUsers,
      bannedUsers,
      verifiedUsers,
    };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    banUser,
    unbanUser,
    deleteUser,
    refetch: fetchUsers,
    stats: getUserStats(),
  };
};