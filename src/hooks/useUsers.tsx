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
  city?: string;
  country?: string;
  bio?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Check if current user is admin first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: adminCheck } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (!adminCheck) {
        throw new Error('User not authorized for admin access');
      }

      // Use edge function to get real admin data
      const response = await fetch(`https://fgtvwbacqqudezispdgy.supabase.co/functions/v1/get-admin-dashboard-data?type=users`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users data');
      }

      const { users: fetchedUsers } = await response.json();
      setUsers(fetchedUsers || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل المستخدمين',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData: {
    email: string;
    password: string;
    full_name?: string;
    phone?: string;
    city?: string;
    country?: string;
    bio?: string;
  }) => {
    try {
      // Check admin privileges
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: adminCheck } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (!adminCheck) {
        throw new Error('User not authorized for admin operations');
      }

      // Use edge function to create user with admin privileges
      const response = await fetch(`https://fgtvwbacqqudezispdgy.supabase.co/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const { user: newUser } = await response.json();

      await fetchUsers();
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة المستخدم بنجاح',
      });
      return { success: true, data: newUser };
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ في إضافة المستخدم',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const banUser = async (userId: string) => {
    try {
      // Check admin privileges
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: adminCheck } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (!adminCheck) {
        throw new Error('User not authorized for admin operations');
      }

      // Update user ban status in auth
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: '876000h' // Very long ban duration
      });

      if (error) throw error;

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
      // Check admin privileges
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: adminCheck } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (!adminCheck) {
        throw new Error('User not authorized for admin operations');
      }

      // Remove ban from user
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: 'none'
      });

      if (error) throw error;

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
      // Check admin privileges
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: adminCheck } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (!adminCheck) {
        throw new Error('User not authorized for admin operations');
      }

      // Delete user from auth
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

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
    addUser,
    banUser,
    unbanUser,
    deleteUser,
    refetch: fetchUsers,
    stats: getUserStats(),
  };
};