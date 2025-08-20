import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Author = Database['public']['Tables']['authors']['Row'];
type AuthorInsert = Database['public']['Tables']['authors']['Insert'];
type AuthorUpdate = Database['public']['Tables']['authors']['Update'];

export const useAdminAuthors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل المؤلفين',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addAuthor = async (authorData: AuthorInsert) => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .insert([authorData])
        .select()
        .single();

      if (error) throw error;

      setAuthors(prev => [data, ...prev]);
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة المؤلف بنجاح',
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error adding author:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في إضافة المؤلف',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const updateAuthor = async (id: string, authorData: AuthorUpdate) => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .update(authorData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAuthors(prev => prev.map(author => author.id === id ? data : author));
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث المؤلف بنجاح',
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error updating author:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحديث المؤلف',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const deleteAuthor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAuthors(prev => prev.filter(author => author.id !== id));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المؤلف بنجاح',
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting author:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف المؤلف',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const getAuthorStats = () => {
    const totalAuthors = authors.length;
    
    return {
      totalAuthors,
    };
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return {
    authors,
    loading,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    refetch: fetchAuthors,
    stats: getAuthorStats(),
  };
};