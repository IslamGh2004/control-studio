import { useState } from 'react';
import { Search, Filter, Grid3X3, List, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserNavigation from '@/components/UserNavigation';
import { BooksGrid } from '@/components/BooksGrid';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';
import { useListeningProgress } from '@/hooks/useListeningProgress';
import BookDetails from '@/components/BookDetails';

const Library = () => {
  const { user } = useAuth();
  const { books, loading: booksLoading } = useBooks();
  const { categories } = useCategories();
  const { progressData: progress } = useListeningProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const handleNavigate = (page: string) => {
    console.log(`Navigate to: ${page}`);
  };

  const handlePlayBook = (book: any) => {
    setSelectedBook(book);
  };

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category_id?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get books with progress
  const booksWithProgress = filteredBooks.map(book => ({
    ...book,
    progress: progress.find(p => p.book_id === book.id)?.progress_in_seconds || 0
  }));

  // Get currently reading books
  const currentlyReading = booksWithProgress.filter(book => 
    book.progress > 0 && book.progress < (book.duration_in_seconds || 0)
  );

  // Get completed books
  const completedBooks = booksWithProgress.filter(book => 
    book.progress >= (book.duration_in_seconds || 0)
  );

  // Get unstarted books
  const unstartedBooks = booksWithProgress.filter(book => book.progress === 0);

  return (
    <div className="min-h-screen bg-surface">
      <UserNavigation onNavigate={handleNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">مكتبتي</h1>
          <p className="text-text-secondary">مجموعة كتبك الصوتية الشخصية</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
              <Input
                placeholder="البحث في الكتب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

        {/* Books Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              الكل ({filteredBooks.length})
            </TabsTrigger>
            <TabsTrigger value="reading" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              قيد القراءة ({currentlyReading.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              مكتملة ({completedBooks.length})
            </TabsTrigger>
            <TabsTrigger value="unstarted">
              لم تبدأ ({unstartedBooks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <BooksGrid 
              books={booksWithProgress}
              loading={booksLoading}
              onPlay={handlePlayBook}
            />
          </TabsContent>

          <TabsContent value="reading" className="mt-6">
            <BooksGrid 
              books={currentlyReading}
              loading={booksLoading}
              onPlay={handlePlayBook}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <BooksGrid 
              books={completedBooks}
              loading={booksLoading}
              onPlay={handlePlayBook}
            />
          </TabsContent>

          <TabsContent value="unstarted" className="mt-6">
            <BooksGrid 
              books={unstartedBooks}
              loading={booksLoading}
              onPlay={handlePlayBook}
            />
          </TabsContent>
        </Tabs>

        {filteredBooks.length === 0 && !booksLoading && (
          <Card className="text-center py-12">
            <BookOpen className="h-16 w-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">لا توجد كتب</h3>
            <p className="text-text-secondary mb-4">لم يتم العثور على كتب بالمعايير المحددة</p>
            <Button onClick={() => setSearchTerm('')}>مسح البحث</Button>
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

export default Library;