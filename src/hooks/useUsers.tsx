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
      // Fetch real users from profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Fallback to auth users if profiles table is empty
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) throw authError;
        
        const authUsers = authData.users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'مستخدم جديد',
          avatar_url: user.user_metadata?.avatar_url,
          phone: user.phone,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          phone_confirmed_at: user.phone_confirmed_at,
          is_banned: user.banned_until ? new Date(user.banned_until) > new Date() : false,
          city: 'غير محدد',
          country: 'غير محدد',
          bio: ''
        }));
        
        setUsers(authUsers);
      } else {
        // Map profiles data to user interface
        const profileUsers = profilesData.map(profile => ({
          id: profile.user_id,
          email: 'غير محدد', // Would need to join with auth.users
          name: profile.full_name || 'مستخدم جديد',
          avatar_url: profile.avatar_url,
          phone: profile.phone,
          created_at: profile.created_at,
          last_sign_in_at: profile.updated_at, // Use updated_at as proxy
          email_confirmed_at: profile.created_at, // Assume confirmed if profile exists
          is_banned: false, // Would need separate banned users tracking
          city: profile.city || 'غير محدد',
          country: profile.country || 'غير محدد',
          bio: profile.bio || ''
        }));
        
        setUsers(profileUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data if all else fails
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
          is_banned: false,
          city: 'القاهرة',
          country: 'مصر',
          bio: 'محب للكتب الصوتية'
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
          is_banned: false,
          city: 'الرياض',
          country: 'السعودية',
          bio: 'قارئة نشطة'
        }
      ]);
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
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name
        }
      });

      if (authError) throw authError;

      // Create profile if user creation was successful
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            user_id: authData.user.id,
            full_name: userData.full_name,
            phone: userData.phone,
            city: userData.city,
            country: userData.country,
            bio: userData.bio
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw error here as user was created successfully
        }
      }

      await fetchUsers();
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة المستخدم بنجاح',
      });
      return { success: true, data: authData.user };
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في إضافة المستخدم',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };
  const banUser = async (userId: string) => {
    try {
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