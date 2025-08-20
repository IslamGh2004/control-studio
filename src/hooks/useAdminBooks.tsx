import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Book = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];
type BookUpdate = Database['public']['Tables']['books']['Update'];

export const useAdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل الكتب',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData: BookInsert) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([bookData])
        .select()
        .single();

      if (error) throw error;

      setBooks(prev => [data, ...prev]);
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة الكتاب بنجاح',
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في إضافة الكتاب',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const updateBook = async (id: number, bookData: BookUpdate) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .update(bookData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBooks(prev => prev.map(book => book.id === id ? data : book));
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الكتاب بنجاح',
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error updating book:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحديث الكتاب',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const deleteBook = async (id: number) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBooks(prev => prev.filter(book => book.id !== id));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الكتاب بنجاح',
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف الكتاب',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const getBookStats = () => {
    const totalBooks = books.length;
    const totalDownloads = books.reduce((sum, book) => sum + (book.id || 0), 0); // This would need a downloads field
    const avgDuration = books.reduce((sum, book) => sum + (book.duration_in_seconds || 0), 0) / totalBooks;
    
    return {
      totalBooks,
      totalDownloads,
      avgDuration: Math.round(avgDuration / 60), // in minutes
    };
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    refetch: fetchBooks,
    stats: getBookStats(),
  };
};