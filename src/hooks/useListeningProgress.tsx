import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';

export interface ListeningProgress {
  id: number;
  book_id: number | null;
  user_id: string | null;
  progress_in_seconds: number | null;
  last_listened_at: string | null;
  created_at: string;
}

export const useListeningProgress = () => {
  const [progressData, setProgressData] = useState<ListeningProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProgress = async () => {
    if (!user) {
      setProgressData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listening_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_listened_at', { ascending: false });

      if (error) throw error;
      setProgressData(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "خطأ في تحميل التقدم",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (bookId: number, progressInSeconds: number) => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يجب عليك تسجيل الدخول لحفظ التقدم",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Check if progress exists for this book
      const existingProgress = progressData.find(p => p.book_id === bookId);

      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('listening_progress')
          .update({
            progress_in_seconds: progressInSeconds,
            last_listened_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from('listening_progress')
          .insert([{
            book_id: bookId,
            user_id: user.id,
            progress_in_seconds: progressInSeconds,
            last_listened_at: new Date().toISOString(),
          }]);

        if (error) throw error;
      }

      await fetchProgress();
      return true;
    } catch (err: any) {
      toast({
        title: "خطأ في حفظ التقدم",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const getBookProgress = (bookId: number): ListeningProgress | null => {
    return progressData.find(p => p.book_id === bookId) || null;
  };

  const getProgressPercentage = (bookId: number, totalDuration?: number): number => {
    if (!totalDuration) return 0;
    
    const progress = getBookProgress(bookId);
    if (!progress?.progress_in_seconds) return 0;
    
    return Math.min((progress.progress_in_seconds / totalDuration) * 100, 100);
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  return {
    progressData,
    loading,
    error,
    fetchProgress,
    updateProgress,
    getBookProgress,
    getProgressPercentage,
  };
};