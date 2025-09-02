import { useState } from 'react';
import { Search, BookOpen, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UserNavigation from '@/components/UserNavigation';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { BooksGrid } from '@/components/BooksGrid';
import { useCategories } from '@/hooks/useCategories';
import { useBooks } from '@/hooks/useBooks';
import BookDetails from '@/components/BookDetails';

const Categories = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { books, loading: booksLoading } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const handleNavigate = (page: string) => {
    console.log(`Navigate to: ${page}`);
  };

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
  };

  const handlePlayBook = (book: any) => {
    setSelectedBook(book);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name?.localeCompare(b.name) || 0;
      case 'books':
        return (b.book_count || 0) - (a.book_count || 0);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  // Get books for selected category
  const categoryBooks = selectedCategory 
    ? books.filter(book => book.category_id === selectedCategory.id)
    : [];

  if (selectedCategory) {
    // Show books in selected category
    return (
      <div className="min-h-screen bg-surface">
        <UserNavigation onNavigate={handleNavigate} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={handleBackToCategories}
              className="mb-4"
            >
              ← العودة للفئات
            </Button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">{selectedCategory.name}</h1>
                <p className="text-text-secondary">{selectedCategory.description}</p>
                <Badge variant="secondary" className="mt-2">
                  {categoryBooks.length} كتاب
                </Badge>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          {categoryBooks.length > 0 ? (
            <BooksGrid 
              books={categoryBooks}
              loading={booksLoading}
              onPlay={handlePlayBook}
            />
          ) : (
            <Card className="text-center py-12">
              <BookOpen className="h-16 w-16 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">لا توجد كتب</h3>
              <p className="text-text-secondary">لم يتم إضافة كتب لهذه الفئة بعد</p>
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
  }

  // Show categories list
  return (
    <div className="min-h-screen bg-surface">
      <UserNavigation onNavigate={handleNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">جميع الفئات</h1>
          <p className="text-text-secondary">اكتشف مجموعة متنوعة من المواضيع والأقسام</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
              <Input
                placeholder="البحث في الفئات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">الاسم</SelectItem>
                <SelectItem value="books">عدد الكتب</SelectItem>
                <SelectItem value="newest">الأحدث</SelectItem>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{categories.length}</h3>
                <p className="text-text-secondary">إجمالي الفئات</p>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-success flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{filteredCategories.length}</h3>
                <p className="text-text-secondary">نتائج البحث</p>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{books.length}</h3>
                <p className="text-text-secondary">إجمالي الكتب</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Categories Grid */}
        {sortedCategories.length > 0 ? (
            <CategoriesGrid 
              categories={sortedCategories}
              loading={categoriesLoading}
              onCategoryClick={handleCategoryClick}
            />
        ) : (
          <Card className="text-center py-12">
            <BookOpen className="h-16 w-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">لا توجد فئات</h3>
            <p className="text-text-secondary mb-4">لم يتم العثور على فئات بالبحث المحدد</p>
            <Button onClick={() => setSearchTerm('')}>مسح البحث</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Categories;