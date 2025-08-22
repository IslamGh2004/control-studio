import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'] & { book_count?: number };
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export const useAdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_categories_with_book_count');

      if (error) throw error;
      setCategories((data || []).map((item: any) => ({
        ...item,
        description: item.description || '' // Ensure description field exists
      })));
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل الفئات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: CategoryInsert) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      await fetchCategories(); // Refresh to get book count
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة الفئة بنجاح',
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في إضافة الفئة',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const updateCategory = async (id: number, categoryData: CategoryUpdate) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchCategories(); // Refresh to get book count
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الفئة بنجاح',
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحديث الفئة',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(category => category.id !== id));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الفئة بنجاح',
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف الفئة',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const getCategoryStats = () => {
    const totalCategories = categories.length;
    const totalBooks = categories.reduce((sum, cat: any) => sum + (cat.book_count || 0), 0);
    const avgBooksPerCategory = totalBooks / totalCategories || 0;
    
    return {
      totalCategories,
      totalBooks,
      avgBooksPerCategory: Math.round(avgBooksPerCategory),
    };
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
    stats: getCategoryStats(),
  };
};