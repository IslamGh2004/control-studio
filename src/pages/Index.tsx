import { HeadphonesIcon, BookOpen, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark">
      {/* Navigation */}
      <nav className="bg-surface/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <HeadphonesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">مكتبة الصوت</h1>
                <p className="text-xs text-text-secondary">منصة الكتب الصوتية العربية</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button variant="outline" className="action-button">
                تسجيل الدخول
              </Button>
              <Button asChild className="admin-button">
                <a href="/admin/login">لوحة التحكم</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

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
              <Button size="lg" className="admin-button text-lg px-8 py-4">
                ابدأ الاستماع الآن
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                تعرف على المزيد
              </Button>
            </div>
          </div>
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
              <p className="text-text-secondary">آلاف الكتب الصوتية في جميع المجالات والفئات</p>
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
