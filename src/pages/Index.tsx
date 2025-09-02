import { HeadphonesIcon, BookOpen, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UserNavigation from '@/components/UserNavigation';
import { useAuth } from '@/hooks/useAuth';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { BooksGrid } from '@/components/BooksGrid';
import { CategoriesGrid } from '@/components/CategoriesGrid';

const Index = () => {
  const { user } = useAuth();
  const { books, loading: booksLoading } = useBooks();
  const { categories, loading: categoriesLoading } = useCategories();

  const handleNavigate = (page: string) => {
    // Handle navigation to different user pages
    window.location.href = `/${page}`;
  };

  const handlePlayBook = (book: any) => {
    console.log('Playing book:', book);
    // TODO: Implement audio player
  };

  const handleCategoryClick = (category: any) => {
    console.log('Category clicked:', category);
    // TODO: Navigate to category page
  };

  // Get featured books (first 4 books)
  const featuredBooks = books.slice(0, 4);
  
  // Get featured categories (first 6 categories)
  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark">
      {/* Navigation */}
      <UserNavigation onNavigate={handleNavigate} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              اكتشف عالم
              <br />
              <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
                الكتب الصوتية
              </span>
            </h1>
            <p className="text-xl text-primary-light mb-8 max-w-3xl mx-auto leading-relaxed">
              منصة شاملة لأفضل الكتب الصوتية العربية مع مكتبة واسعة من المؤلفين والفئات المتنوعة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Button size="lg" className="admin-button text-lg px-8 py-4" onClick={() => handleNavigate('library')}>
                  ابدأ الاستماع الآن
                </Button>
              ) : (
                <Button size="lg" className="admin-button text-lg px-8 py-4" asChild>
                  <a href="/auth">ابدأ الاستماع الآن</a>
                </Button>
              )}
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                تعرف على المزيد
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">تصفح الفئات</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              اكتشف مجموعة متنوعة من الفئات والمواضيع المختلفة
            </p>
          </div>
          
          <CategoriesGrid 
            categories={featuredCategories}
            loading={categoriesLoading}
            onCategoryClick={handleCategoryClick}
          />
          
          {categories.length > 6 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" onClick={() => handleNavigate('categories')}>
                عرض جميع الفئات
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="bg-surface-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">الكتب المميزة</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              مجموعة مختارة من أفضل الكتب الصوتية المتاحة
            </p>
          </div>
          
          <BooksGrid 
            books={featuredBooks}
            loading={booksLoading}
            onPlay={handlePlayBook}
          />
          
          {books.length > 4 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" onClick={() => handleNavigate('books')}>
                عرض جميع الكتب
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">لماذا مكتبة الصوت؟</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              نقدم تجربة استماع فريدة مع محتوى عربي أصيل وجودة صوتية عالية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="stat-card group text-center hover:scale-105">
              <div className="h-16 w-16 rounded-xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">مكتبة ضخمة</h3>
              <p className="text-text-secondary">{books.length} كتاب صوتي في {categories.length} فئة مختلفة</p>
            </Card>

            <Card className="stat-card group text-center hover:scale-105">
              <div className="h-16 w-16 rounded-xl bg-gradient-success mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">مؤلفون مميزون</h3>
              <p className="text-text-secondary">أفضل المؤلفين والرواة في العالم العربي</p>
            </Card>

            <Card className="stat-card group text-center hover:scale-105">
              <div className="h-16 w-16 rounded-xl bg-purple-500 mx-auto mb-6 flex items-center justify-center">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">تجربة مخصصة</h3>
              <p className="text-text-secondary">إعدادات متقدمة وتوصيات شخصية لكل مستخدم</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Admin Demo Section */}
      <div className="bg-sidebar py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            لوحة التحكم الإدارية
          </h2>
          <p className="text-sidebar-foreground text-lg mb-8 max-w-2xl mx-auto">
            إدارة شاملة للمحتوى والمستخدمين مع واجهة حديثة ومتطورة
          </p>
          <Button asChild size="lg" className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-white px-8 py-4">
            <a href="/admin/login">دخول لوحة التحكم</a>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <HeadphonesIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">مكتبة الصوت</span>
          </div>
          <p className="text-text-secondary">© 2024 مكتبة الصوت. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
