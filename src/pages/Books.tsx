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
import UserNavigation from '@/components/UserNavigation';
import { BooksGrid } from '@/components/BooksGrid';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import BookDetails from '@/components/BookDetails';

const Books = () => {
  const { books, loading: booksLoading } = useBooks();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
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
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category_id?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title?.localeCompare(b.title) || 0;
      case 'author':
        return a.author?.localeCompare(b.author) || 0;
      case 'duration':
        return (b.duration_in_seconds || 0) - (a.duration_in_seconds || 0);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  // Calculate total duration
  const totalDuration = filteredBooks.reduce((acc, book) => acc + (book.duration_in_seconds || 0), 0);
  const totalHours = Math.round(totalDuration / 3600);

  return (
    <div className="min-h-screen bg-surface">
      <UserNavigation onNavigate={handleNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">جميع الكتب</h1>
          <p className="text-text-secondary">اكتشف مكتبة واسعة من الكتب الصوتية</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
              <Input
                placeholder="البحث في الكتب والمؤلفين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="oldest">الأقدم</SelectItem>
                <SelectItem value="title">الاسم</SelectItem>
                <SelectItem value="author">المؤلف</SelectItem>
                <SelectItem value="duration">المدة</SelectItem>
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{books.length}</h3>
                <p className="text-text-secondary">إجمالي الكتب</p>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-success flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{filteredBooks.length}</h3>
                <p className="text-text-secondary">نتائج البحث</p>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{totalHours}</h3>
                <p className="text-text-secondary">ساعة صوتية</p>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{categories.length}</h3>
                <p className="text-text-secondary">فئة مختلفة</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Books Grid */}
        {sortedBooks.length > 0 ? (
          <BooksGrid 
            books={sortedBooks}
            loading={booksLoading}
            onPlay={handlePlayBook}
          />
        ) : (
          <Card className="text-center py-12">
            <BookOpen className="h-16 w-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">لا توجد كتب</h3>
            <p className="text-text-secondary mb-4">لم يتم العثور على كتب بالمعايير المحددة</p>
            <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
              مسح الفلاتر
            </Button>
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

export default Books;