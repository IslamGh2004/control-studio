import { useState } from 'react';
import { Play, Pause, Volume2, Heart, Share2, Download, User, Calendar, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface BookDetailsProps {
  book: {
    id: number;
    title: string;
    author: string;
    description?: string;
    cover_url?: string;
    audio_url?: string;
    duration_in_seconds?: number;
    category?: string;
    status?: string;
    created_at: string;
  };
  onClose: () => void;
}

export default function BookDetails({ book, onClose }: BookDetailsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'منشور': return 'default';
      case 'مسودة': return 'secondary';
      case 'مراجعة': return 'outline';
      default: return 'secondary';
    }
  };

  const progress = book.duration_in_seconds ? (currentTime / book.duration_in_seconds) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-elegant">
        <CardContent className="p-0">
          {/* Header with close button */}
          <div className="sticky top-0 bg-surface-primary border-b p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-text-primary">تفاصيل الكتاب</h2>
            <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              ✕
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Book Cover and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={book.cover_url || '/placeholder.svg'}
                  alt={book.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-elegant"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">{book.title}</h1>
                  <div className="flex items-center gap-2 text-text-secondary mb-4">
                    <User className="h-4 w-4" />
                    <span className="text-lg">{book.author}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.category && (
                      <Badge variant="outline" className="text-primary">
                        {book.category}
                      </Badge>
                    )}
                    {book.status && (
                      <Badge variant={getStatusColor(book.status)}>
                        {book.status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Audio Player Controls */}
                {book.audio_url && (
                  <div className="bg-surface-secondary rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => setIsPlaying(!isPlaying)}
                          size="lg"
                          className="h-12 w-12 rounded-full bg-gradient-primary hover:bg-gradient-primary/80"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-text-secondary" />
                          <span className="text-sm text-text-secondary">
                            {formatDuration(currentTime)} / {formatDuration(book.duration_in_seconds || 0)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsFavorite(!isFavorite)}
                          className={isFavorite ? 'text-red-500' : 'text-text-secondary'}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {/* Book Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <span className="font-medium">تاريخ النشر:</span>
                      <p>{formatDate(book.created_at)}</p>
                    </div>
                  </div>
                  
                  {book.duration_in_seconds && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock className="h-4 w-4" />
                      <div>
                        <span className="font-medium">المدة:</span>
                        <p>{formatDuration(book.duration_in_seconds)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Eye className="h-4 w-4" />
                    <div>
                      <span className="font-medium">المشاهدات:</span>
                      <p>{Math.floor(Math.random() * 1000) + 100}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {book.description && (
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">الوصف</h3>
                <p className="text-text-secondary leading-relaxed">{book.description}</p>
              </div>
            )}

            <Separator />

            {/* Related Books Section */}
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">كتب مشابهة</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-elegant transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <img
                        src="/placeholder.svg"
                        alt={`كتاب مشابه ${index}`}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                      <h4 className="text-sm font-medium text-text-primary truncate">كتاب مشابه {index}</h4>
                      <p className="text-xs text-text-secondary truncate">مؤلف الكتاب</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}