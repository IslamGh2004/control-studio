import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';

export interface Favorite {
  id: number;
  book_id: number;
  user_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "خطأ في تحميل المفضلة",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (bookId: number) => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يجب عليك تسجيل الدخول لإضافة كتب للمفضلة",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{ book_id: bookId, user_id: user.id }]);

      if (error) throw error;
      
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الكتاب للمفضلة بنجاح",
      });
      
      await fetchFavorites();
      return true;
    } catch (err: any) {
      toast({
        title: "خطأ في الإضافة",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const removeFromFavorites = async (bookId: number) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('book_id', bookId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف الكتاب من المفضلة بنجاح",
      });
      
      await fetchFavorites();
      return true;
    } catch (err: any) {
      toast({
        title: "خطأ في الحذف",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const isFavorite = (bookId: number): boolean => {
    return favorites.some(fav => fav.book_id === bookId);
  };

  const toggleFavorite = async (bookId: number) => {
    if (isFavorite(bookId)) {
      return await removeFromFavorites(bookId);
    } else {
      return await addToFavorites(bookId);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
};