import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemStats {
  totalBooks: number;
  totalUsers: number;
  totalCategories: number;
  totalAuthors: number;
  totalListeningTime: number;
  totalDownloads: number;
  monthlyGrowth: {
    books: number;
    users: number;
    listeningTime: number;
  };
  recentBooks: any[];
  recentActivity: any[];
}

export const useStats = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalBooks: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalAuthors: 0,
    totalListeningTime: 0,
    totalDownloads: 0,
    monthlyGrowth: {
      books: 0,
      users: 0,
      listeningTime: 0,
    },
    recentBooks: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Get total counts
      const [
        { count: totalBooks },
        { count: totalUsers },
        { count: totalCategories },
        { count: totalAuthors },
      ] = await Promise.all([
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('admins').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('authors').select('*', { count: 'exact', head: true }),
      ]);

      // Get total listening time (sum of all book durations)
      const { data: booksData } = await supabase
        .from('books')
        .select('duration_in_seconds');
      
      const totalListeningTime = booksData?.reduce((sum, book) => 
        sum + (book.duration_in_seconds || 0), 0) || 0;

      // Get recent books
      const { data: recentBooks } = await supabase
        .from('books')
        .select('id, title, author, cover_url, created_at, category')
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate monthly growth (books created in last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const { count: recentBooksCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: previousBooksCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      const booksGrowth = previousBooksCount > 0 
        ? Math.round(((recentBooksCount || 0) - previousBooksCount) / previousBooksCount * 100)
        : 100;

      // Get recent activity from books created recently
      const recentActivity = recentBooks?.slice(0, 3).map((book, index) => ({
        action: `إضافة كتاب "${book.title}"`,
        user: 'النظام',
        time: index === 0 ? 'منذ دقائق' : index === 1 ? 'منذ ساعة' : 'منذ ساعتين',
        type: 'book'
      })) || [
        { 
          action: 'إضافة كتاب جديد', 
          user: 'النظام', 
          time: 'منذ دقائق', 
          type: 'book' 
        },
        { 
          action: 'تحديث فئة الكتب', 
          user: 'الإدارة', 
          time: 'منذ ساعة', 
          type: 'category' 
        },
      ];

      setStats({
        totalBooks: totalBooks || 0,
        totalUsers: totalUsers || 0,
        totalCategories: totalCategories || 0,
        totalAuthors: totalAuthors || 0,
        totalListeningTime: Math.round(totalListeningTime / 3600), // Convert to hours
        totalDownloads: 0, // This would need a downloads tracking system
        monthlyGrowth: {
          books: booksGrowth,
          users: 8, // Mock data
          listeningTime: 15, // Mock data
        },
        recentBooks: recentBooks || [],
        recentActivity,
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل الإحصائيات',
        variant: 'destructive',
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