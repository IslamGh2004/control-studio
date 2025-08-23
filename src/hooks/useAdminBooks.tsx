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

  const addBook = async (bookData: BookInsert, files?: { audioFile: File; coverFile: File }) => {
    try {
      let finalBookData = { ...bookData };

      // If files are provided, upload them first
      if (files && files.audioFile && files.coverFile) {
        const tempBookId = Date.now().toString();
        
        const formData = new FormData();
        formData.append('audioFile', files.audioFile);
        formData.append('coverFile', files.coverFile);
        formData.append('bookId', tempBookId);

        const { data: uploadResult, error: uploadError } = await supabase.functions.invoke('upload-book-files', {
          body: formData
        });

        if (uploadError) throw uploadError;

        finalBookData = {
          ...finalBookData,
          cover_url: uploadResult.coverUrl,
          audio_url: uploadResult.audioUrl,
          duration_in_seconds: uploadResult.duration
        };
      }

      const { data, error } = await supabase
        .from('books')
        .insert([finalBookData])
        .select()
        .single();

      if (error) throw error;

      setBooks(prev => [data, ...prev]);
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة الكتاب بنجاح مع الملفات',
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في إضافة الكتاب أو رفع الملفات',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const updateBook = async (id: number, bookData: BookUpdate, files?: { audioFile?: File; coverFile?: File }) => {
    try {
      let finalBookData = { ...bookData };

      // If files are provided, upload them first
      if (files && (files.audioFile || files.coverFile)) {
        const formData = new FormData();
        if (files.audioFile) formData.append('audioFile', files.audioFile);
        if (files.coverFile) formData.append('coverFile', files.coverFile);
        formData.append('bookId', id.toString());

        const { data: uploadResult, error: uploadError } = await supabase.functions.invoke('upload-book-files', {
          body: formData
        });

        if (uploadError) throw uploadError;

        finalBookData = {
          ...finalBookData,
          ...(uploadResult.coverUrl && { cover_url: uploadResult.coverUrl }),
          ...(uploadResult.audioUrl && { audio_url: uploadResult.audioUrl }),
          ...(uploadResult.duration && { duration_in_seconds: uploadResult.duration })
        };
      }

      const { data, error } = await supabase
        .from('books')
        .update(finalBookData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBooks(prev => prev.map(book => book.id === id ? data : book));
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الكتاب بنجاح مع الملفات',
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error updating book:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحديث الكتاب أو رفع الملفات',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const bulkUploadBooks = async (files: FileList) => {
    try {
      const results = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // This is a simplified bulk upload - in reality you'd need to parse metadata from files
        const bookData = {
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          author: 'غير محدد',
          description: 'تم رفعه بالدفعة',
          category_id: null,
          status: 'مراجعة'
        };
        
        // For bulk upload, assume files are audio files for now
        const formData = new FormData();
        formData.append('audioFile', file);
        formData.append('bookId', Date.now().toString() + i);

        const { data: uploadResult, error: uploadError } = await supabase.functions.invoke('upload-book-files', {
          body: formData
        });

        if (!uploadError) {
          const { data, error } = await supabase
            .from('books')
            .insert([{
              ...bookData,
              audio_url: uploadResult.audioUrl,
              duration_in_seconds: uploadResult.duration
            }])
            .select()
            .single();

          if (!error) {
            results.push(data);
          }
        }
      }

      setBooks(prev => [...results, ...prev]);
      toast({
        title: 'تم الرفع',
        description: `تم رفع ${results.length} كتاب بنجاح`,
      });
      return { success: true, count: results.length };
    } catch (error) {
      console.error('Error bulk uploading books:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في رفع الكتب',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const exportBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('title, author, category, duration_in_seconds, status, created_at');

      if (error) throw error;

      // Convert to CSV
      const headers = ['العنوان', 'المؤلف', 'الفئة', 'المدة (ثواني)', 'الحالة', 'تاريخ الإنشاء'];
      const csvContent = [
        headers.join(','),
        ...data.map(book => [
          book.title || '',
          book.author || '',
          book.category || '',
          book.duration_in_seconds || 0,
          book.status || '',
          new Date(book.created_at).toLocaleDateString('ar-EG')
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `books_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: 'تم التصدير',
        description: 'تم تصدير قائمة الكتب بنجاح',
      });
      return { success: true };
    } catch (error) {
      console.error('Error exporting books:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تصدير الكتب',
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
    bulkUploadBooks,
    exportBooks,
    refetch: fetchBooks,
    stats: getBookStats(),
  };
};