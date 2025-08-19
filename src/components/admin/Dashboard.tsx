import { 
  BookOpen, 
  Users, 
  HeadphonesIcon, 
  FolderOpen,
  TrendingUp,
  Download,
  Eye,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { stats, loading } = useAdminStats();

  const statsCards = [
    {
      title: 'إجمالي الكتب',
      value: stats.totalBooks.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers.toString() || 'N/A',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'ساعات الاستماع',
      value: stats.totalListeningHours.toString(),
      change: '+15%',
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

  const recentActivity = [
    { action: 'إضافة كتاب جديد', user: 'النظام', time: 'منذ 5 دقائق', type: 'book' },
    { action: 'تسجيل مستخدم جديد', user: 'النظام', time: 'منذ 15 دقيقة', type: 'user' },
    { action: 'تحديث فئة الكتب', user: 'النظام', time: 'منذ 30 دقيقة', type: 'category' },
    { action: 'رسالة دعم فني جديدة', user: 'النظام', time: 'منذ ساعة', type: 'support' }
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
          <Button variant="outline" className="action-button">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
          <Button className="admin-button">
            <TrendingUp className="w-4 h-4 ml-2" />
            عرض التحليلات
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </Card>
          ))
        ) : (
          statsCards.map((stat, index) => (
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
          ))
        )}
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
              {loading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 space-x-reverse p-4 rounded-xl bg-surface-secondary">
                    <Skeleton className="w-16 h-20 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="text-left">
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </div>
                ))
              ) : stats.recentBooks.length > 0 ? (
                stats.recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center space-x-4 space-x-reverse p-4 rounded-xl bg-surface-secondary hover:bg-card-hover transition-all duration-200">
                    <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-admin">
                      {book.cover_url ? (
                        <img 
                          src={book.cover_url} 
                          alt={book.title}
                          className="w-16 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <BookOpen className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary truncate">{book.title || 'بدون عنوان'}</h3>
                      <p className="text-text-secondary text-sm">{book.author || 'مؤلف غير محدد'}</p>
                      <p className="text-text-muted text-xs">{book.category || 'فئة غير محددة'}</p>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center text-text-secondary text-sm">
                        <Clock className="w-4 h-4 ml-1" />
                        {book.duration_in_seconds ? Math.floor(book.duration_in_seconds / 60) + ' د' : 'غير محدد'}
                      </div>
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 status-active">
                        متاح
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-text-muted" />
                  <p>لا توجد كتب مضافة بعد</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Activity Feed & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">النشاطات الأخيرة</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
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
    </div>
  );
}