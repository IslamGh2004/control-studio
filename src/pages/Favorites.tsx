import { useState } from 'react';
import { Search, Heart, Grid3X3, List, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import UserNavigation from '@/components/UserNavigation';
import { BooksGrid } from '@/components/BooksGrid';
import { useBooks } from '@/hooks/useBooks';
import { useFavorites } from '@/hooks/useFavorites';
import BookDetails from '@/components/BookDetails';

const Favorites = () => {
  const { books, loading: booksLoading } = useBooks();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const handleNavigate = (page: string) => {
    console.log(`Navigate to: ${page}`);
  };

  const handlePlayBook = (book: any) => {
    setSelectedBook(book);
  };

  // Get favorite books
  const favoriteBooks = books.filter(book => 
    favorites.some(fav => fav.book_id === book.id)
  );

  // Filter favorite books based on search
  const filteredFavoriteBooks = favoriteBooks.filter(book => 
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loading = booksLoading || favoritesLoading;

  return (
    <div className="min-h-screen bg-surface">
      <UserNavigation onNavigate={handleNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary">المفضلة</h1>
          </div>
          <p className="text-text-secondary">الكتب التي أضفتها إلى قائمة المفضلة</p>
        </div>

        {/* Search and View Options */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
              <Input
                placeholder="البحث في المفضلة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{favoriteBooks.length}</h3>
                <p className="text-text-secondary">كتاب مفضل</p>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-success flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">
                  {Math.round(favoriteBooks.reduce((acc, book) => acc + (book.duration_in_seconds || 0), 0) / 3600)}
                </h3>
                <p className="text-text-secondary">ساعة صوتية</p>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{filteredFavoriteBooks.length}</h3>
                <p className="text-text-secondary">نتيجة البحث</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Favorite Books Grid */}
        {filteredFavoriteBooks.length > 0 ? (
            <BooksGrid 
              books={filteredFavoriteBooks}
              loading={loading}
              onPlay={handlePlayBook}
            />
        ) : (
          <Card className="text-center py-12">
            <Heart className="h-16 w-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {favoriteBooks.length === 0 ? 'لا توجد كتب مفضلة' : 'لا توجد نتائج'}
            </h3>
            <p className="text-text-secondary mb-4">
              {favoriteBooks.length === 0 
                ? 'ابدأ بإضافة كتب إلى قائمة المفضلة لتظهر هنا'
                : 'لم يتم العثور على كتب بالبحث المحدد'
              }
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')}>مسح البحث</Button>
            )}
          </Card>
        )}
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default Favorites;