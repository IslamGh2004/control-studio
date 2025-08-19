import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Heart, Clock, User } from 'lucide-react';
import { Book } from '@/hooks/useBooks';
import { useFavorites } from '@/hooks/useFavorites';
import { useListeningProgress } from '@/hooks/useListeningProgress';

interface BookCardProps {
  book: Book;
  onPlay?: (book: Book) => void;
}

export const BookCard = ({ book, onPlay }: BookCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getProgressPercentage } = useListeningProgress();
  const [imageError, setImageError] = useState(false);

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '--:--';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')} ساعة`;
    }
    return `${minutes} دقيقة`;
  };

  const progressPercentage = getProgressPercentage(book.id, book.duration_in_seconds || undefined);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(book.id);
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay(book);
    }
  };

  return (
    <Card className="stat-card group overflow-hidden">
      <div className="relative aspect-[3/4] mb-4">
        {!imageError && book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title || 'غلاف الكتاب'}
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-text-muted">
              <div className="w-16 h-16 rounded-xl bg-gradient-primary mx-auto mb-2 flex items-center justify-center">
                <Play className="h-8 w-8 text-white" />
              </div>
              <span className="text-sm">غلاف الكتاب</span>
            </div>
          </div>
        )}
        
        {/* Progress overlay */}
        {progressPercentage > 0 && (
          <div className="absolute bottom-2 left-2 right-2">
            <Progress value={progressPercentage} className="h-2" />
            <span className="text-xs text-white bg-black/50 px-2 py-1 rounded mt-1 inline-block">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        )}

        {/* Favorite button */}
        <Button
          variant="outline"
          size="sm"
          className={`absolute top-2 right-2 w-8 h-8 p-0 ${
            isFavorite(book.id) 
              ? 'bg-destructive text-white border-destructive hover:bg-destructive/90' 
              : 'bg-white/80 text-text-secondary hover:bg-white'
          }`}
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite(book.id) ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-text-primary line-clamp-2 mb-2">
            {book.title || 'عنوان غير محدد'}
          </h3>
          
          {book.author && (
            <div className="flex items-center text-text-secondary text-sm mb-2">
              <User className="h-3 w-3 ml-1" />
              {book.author}
            </div>
          )}

          {book.category && (
            <Badge variant="secondary" className="text-xs mb-2">
              {book.category}
            </Badge>
          )}
        </div>

        {book.description && (
          <p className="text-text-secondary text-sm line-clamp-2">
            {book.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center text-text-muted text-xs">
            <Clock className="h-3 w-3 ml-1" />
            {formatDuration(book.duration_in_seconds)}
          </div>

          <Button
            size="sm"
            onClick={handlePlay}
            className="admin-button text-xs px-4 py-2"
            disabled={!book.audio_url}
          >
            <Play className="h-3 w-3 ml-1" />
            استمع الآن
          </Button>
        </div>
      </div>
    </Card>
  );
};