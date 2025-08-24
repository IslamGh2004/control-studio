import { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  HeadphonesIcon, 
  FolderOpen,
  TrendingUp,
  Download,
  Eye,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStats } from '@/hooks/useStats';
import { useAdminBooks } from '@/hooks/useAdminBooks';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import AnalyticsDialog from '@/components/admin/AnalyticsDialog';
import bookCover1 from '@/assets/book-cover-1.jpg';
import bookCover2 from '@/assets/book-cover-2.jpg';
import bookCover3 from '@/assets/book-cover-3.jpg';

export default function Dashboard() {
  const { stats, loading } = useStats();
  const { books } = useAdminBooks();
  const { categories } = useAdminCategories();
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'إجمالي الكتب',
      value: stats.totalBooks.toLocaleString(),
      change: `+${stats.monthlyGrowth.books}%`,
      changeType: 'positive' as const,
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'المستخدمين النشطين',
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.monthlyGrowth.users}%`,
      changeType: 'positive' as const,
      icon: Users,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'ساعات الاستماع',
      value: stats.totalListeningTime.toLocaleString(),
      change: `+${stats.monthlyGrowth.listeningTime}%`,
      changeType: 'positive' as const,
      icon: HeadphonesIcon,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'الفئات المتاحة',
      value: stats.totalCategories.toString(),
      change: '+3%',
      changeType: 'positive' as const,
      icon: FolderOpen,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  // Use real recent books or fallback to static data
  const recentBooks = stats.recentBooks.length > 0 ? stats.recentBooks.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author || 'غير محدد',
    category: book.category || 'غير محدد',
    cover: book.cover_url || bookCover1,
    downloads: 0, // Would need download tracking
    status: 'منشور'
  })) : [
    {
      id: 1,
      title: 'أسرار التطوير الشخصي',
      author: 'د. محمد العربي',
      category: 'التنمية البشرية',
      cover: bookCover1,
      downloads: 1234,
      status: 'منشور'
    },
    {
      id: 2,
      title: 'تاريخ الحضارة الإسلامية',
      author: 'أ. فاطمة حسن',
      category: 'التاريخ',
      cover: bookCover2,
      downloads: 987,
      status: 'منشور'
    },
    {
      id: 3,
      title: 'قصص من التراث',
      author: 'أحمد الكاتب',
      category: 'الأدب',
      cover: bookCover3,
      downloads: 756,
      status: 'مراجعة'
    }
  ];
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">لوحة الإحصائيات</h1>
          <p className="text-text-secondary mt-1">نظرة شاملة على أداء المنصة</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline" className="action-button" onClick={() => {
            // Export general report
            const reportData = {
              totalBooks: stats.totalBooks,
              totalUsers: stats.totalUsers,
              totalCategories: stats.totalCategories,
              totalAuthors: stats.totalAuthors,
              totalListeningTime: stats.totalListeningTime,
              monthlyGrowth: stats.monthlyGrowth,
              generatedAt: new Date().toISOString()
            };
            
            const csvContent = [
              'نوع البيانات,القيمة',
              `إجمالي الكتب,${stats.totalBooks}`,
              `المستخدمين النشطين,${stats.totalUsers}`,
              `ساعات الاستماع,${stats.totalListeningTime}`,
              `الفئات المتاحة,${stats.totalCategories}`,
              `نمو الكتب الشهري,${stats.monthlyGrowth.books}%`,
              `نمو المستخدمين الشهري,${stats.monthlyGrowth.users}%`,
              `نمو الاستماع الشهري,${stats.monthlyGrowth.listeningTime}%`
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
          }}>
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
          <Button 
            className="admin-button"
            onClick={() => setIsAnalyticsOpen(true)}
          >
            <TrendingUp className="w-4 h-4 ml-2" />
            عرض التحليلات
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="stat-card group cursor-pointer hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-success ml-1" />
                  <span className="text-success text-sm font-medium">{stat.change}</span>
                  <span className="text-text-muted text-sm mr-1">من الشهر الماضي</span>
                </div>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Books */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">أحدث الكتب المضافة</h2>
              <Button variant="outline" size="sm" className="action-button">
                عرض الكل
              </Button>
            </div>
            <div className="space-y-4">
              {recentBooks.map((book) => (
                <div key={book.id} className="flex items-center space-x-4 space-x-reverse p-4 rounded-xl bg-surface-secondary hover:bg-card-hover transition-all duration-200">
                  <img 
                    src={book.cover} 
                    alt={book.title}
                    className="w-16 h-20 rounded-lg object-cover shadow-admin"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{book.title}</h3>
                    <p className="text-text-secondary text-sm">{book.author}</p>
                    <p className="text-text-muted text-xs">{book.category}</p>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center text-text-secondary text-sm">
                      <Download className="w-4 h-4 ml-1" />
                      {book.downloads}
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                      book.status === 'منشور' ? 'status-active' : 'status-inactive'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Activity Feed & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">النشاطات الأخيرة</h2>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 space-x-reverse">
                  <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
                    {activity.type === 'book' && <BookOpen className="h-4 w-4 text-primary" />}
                    {activity.type === 'user' && <Users className="h-4 w-4 text-primary" />}
                    {activity.type === 'category' && <FolderOpen className="h-4 w-4 text-primary" />}
                    {activity.type === 'support' && <MessageSquare className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{activity.action}</p>
                    <p className="text-xs text-text-secondary">بواسطة {activity.user}</p>
                    <p className="text-xs text-text-muted">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* System Health */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">حالة النظام</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">استخدام الخادم</span>
                  <span className="text-text-primary font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">مساحة التخزين</span>
                  <span className="text-text-primary font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">عرض النطاق</span>
                  <span className="text-text-primary font-medium">82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Analytics Dialog */}
      <AnalyticsDialog 
        open={isAnalyticsOpen} 
        onOpenChange={setIsAnalyticsOpen}
        books={books}
        categories={categories}
      />
    </div>
  );
}