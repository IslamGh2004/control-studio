import { BookCard } from './BookCard';
import { Book } from '@/hooks/useBooks';
import { BookOpen } from 'lucide-react';

interface BooksGridProps {
  books: Book[];
  loading?: boolean;
  onPlay?: (book: Book) => void;
}

export const BooksGrid = ({ books, loading, onPlay }: BooksGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-surface-secondary rounded-2xl p-6">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          لا توجد كتب متاحة
        </h3>
        <p className="text-text-secondary">
          لم يتم العثور على أي كتب في هذا القسم حالياً
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book} 
          onPlay={onPlay}
        />
      ))}
    </div>
  );
};