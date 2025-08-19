import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  totalBooks: number;
  totalCategories: number;
  totalUsers: number;
  totalListeningHours: number;
  recentBooks: any[];
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalBooks: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalListeningHours: 0,
    recentBooks: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch total books
      const { count: booksCount, error: booksError } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });

      if (booksError) throw booksError;

      // Fetch total categories
      const { count: categoriesCount, error: categoriesError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      if (categoriesError) throw categoriesError;

      // Fetch recent books with covers
      const { data: recentBooksData, error: recentBooksError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentBooksError) throw recentBooksError;

      // Calculate total listening hours from progress
      const { data: progressData, error: progressError } = await supabase
        .from('listening_progress')
        .select('progress_in_seconds');

      if (progressError) throw progressError;

      const totalSeconds = progressData?.reduce((sum, item) => 
        sum + (item.progress_in_seconds || 0), 0) || 0;
      const totalHours = Math.round(totalSeconds / 3600);

      setStats({
        totalBooks: booksCount || 0,
        totalCategories: categoriesCount || 0,
        totalUsers: 0, // We can't count auth.users directly, so we'll show 0 or use a different approach
        totalListeningHours: totalHours,
        recentBooks: recentBooksData || [],
      });

    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "خطأ في تحميل الإحصائيات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
};