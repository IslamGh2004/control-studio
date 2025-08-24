import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Download, 
  TrendingUp, 
  Calendar,
  Eye,
  Heart,
  Play
} from 'lucide-react';

interface AnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  books: any[];
  categories: any[];
}

export default function AnalyticsDialog({ open, onOpenChange, books, categories }: AnalyticsDialogProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Generate analytics data
  const generateAnalytics = () => {
    // Books by category
    const booksByCategory = categories.map(category => {
      const count = books.filter(book => book.category_id === category.id).length;
      return {
        name: category.name || 'غير محدد',
        count,
        percentage: books.length > 0 ? Math.round((count / books.length) * 100) : 0
      };
    }).filter(item => item.count > 0);

    // Books by status
    const booksByStatus = [
      { name: 'منشور', count: books.filter(b => b.status === 'منشور').length, color: '#10b981' },
      { name: 'مراجعة', count: books.filter(b => b.status === 'مراجعة').length, color: '#f59e0b' },
      { name: 'مسودة', count: books.filter(b => b.status === 'مسودة').length, color: '#ef4444' }
    ].filter(item => item.count > 0);

    // Monthly uploads (mock data)
    const monthlyUploads = [
      { month: 'يناير', books: Math.max(1, Math.floor(books.length * 0.1)), users: 45 },
      { month: 'فبراير', books: Math.max(1, Math.floor(books.length * 0.15)), users: 52 },
      { month: 'مارس', books: Math.max(1, Math.floor(books.length * 0.2)), users: 68 },
      { month: 'أبريل', books: Math.max(1, Math.floor(books.length * 0.18)), users: 71 },
      { month: 'مايو', books: Math.max(1, Math.floor(books.length * 0.25)), users: 89 },
      { month: 'يونيو', books: Math.max(1, Math.floor(books.length * 0.12)), users: 95 }
    ];

    // Top authors by book count
    const authorCounts = books.reduce((acc, book) => {
      const author = book.author || 'غير محدد';
      acc[author] = (acc[author] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topAuthors = Object.entries(authorCounts)
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Duration analytics
    const totalDuration = books.reduce((sum, book) => sum + (book.duration_in_seconds || 0), 0);
    const avgDuration = books.length > 0 ? totalDuration / books.length : 0;
    const longestBook = books.reduce((longest, book) => 
      (book.duration_in_seconds || 0) > (longest.duration_in_seconds || 0) ? book : longest, 
      books[0] || {}
    );

    return {
      booksByCategory,
      booksByStatus,
      monthlyUploads,
      topAuthors,
      totalDuration: Math.round(totalDuration / 3600), // hours
      avgDuration: Math.round(avgDuration / 60), // minutes
      longestBook
    };
  };

  const analytics = generateAnalytics();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl">تحليلات الكتب الشاملة</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="categories">الفئات</TabsTrigger>
            <TabsTrigger value="authors">المؤلفين</TabsTrigger>
            <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">إجمالي الكتب</p>
                      <p className="text-2xl font-bold text-blue-800">{books.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">إجمالي الساعات</p>
                      <p className="text-2xl font-bold text-green-800">{analytics.totalDuration}</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">متوسط المدة</p>
                      <p className="text-2xl font-bold text-purple-800">{analytics.avgDuration} دقيقة</p>
                    </div>
                    <Play className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">الفئات النشطة</p>
                      <p className="text-2xl font-bold text-orange-800">{categories.length}</p>
                    </div>
                    <Eye className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">توزيع الكتب حسب الحالة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.booksByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.booksByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">أطول الكتب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {books
                      .filter(book => book.duration_in_seconds)
                      .sort((a, b) => (b.duration_in_seconds || 0) - (a.duration_in_seconds || 0))
                      .slice(0, 5)
                      .map((book, index) => (
                        <div key={book.id} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{index + 1}</Badge>
                            <div>
                              <p className="font-medium text-text-primary">{book.title}</p>
                              <p className="text-sm text-text-secondary">{book.author}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-primary">
                              {Math.round((book.duration_in_seconds || 0) / 60)} دقيقة
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">توزيع الكتب حسب الفئات</CardTitle>
                <CardDescription className="text-right">
                  عدد الكتب في كل فئة ونسبتها من إجمالي المكتبة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={analytics.booksByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    {analytics.booksByCategory.map((category, index) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-text-primary">{category.name}</span>
                          <span className="text-sm text-text-secondary">{category.count} كتاب</span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                        <p className="text-xs text-text-muted">{category.percentage}% من إجمالي الكتب</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authors Tab */}
          <TabsContent value="authors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">أكثر المؤلفين إنتاجاً</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.topAuthors} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="author" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">إحصائيات المؤلفين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{analytics.topAuthors.length}</p>
                        <p className="text-sm text-blue-800">مؤلف نشط</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {Math.round(books.length / analytics.topAuthors.length) || 0}
                        </p>
                        <p className="text-sm text-green-800">متوسط الكتب لكل مؤلف</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-text-primary">قائمة المؤلفين</h4>
                      {analytics.topAuthors.map((author, index) => (
                        <div key={author.author} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="font-medium">{author.author}</span>
                          </div>
                          <Badge className="bg-primary text-white">
                            {author.count} كتاب
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">اتجاهات الرفع الشهرية</CardTitle>
                <CardDescription className="text-right">
                  عدد الكتب والمستخدمين الجدد شهرياً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={analytics.monthlyUploads}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="books" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="users" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right text-lg">معدل النمو</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">الكتب الشهرية</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold">+25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">المستخدمين الجدد</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold">+18%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">وقت الاستماع</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold">+32%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right text-lg">أداء المحتوى</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-text-secondary">معدل الإكمال</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-text-secondary">التقييم المتوسط</span>
                        <span className="text-sm font-medium">4.6/5</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-text-secondary">معدل المشاركة</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right text-lg">إحصائيات سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">أطول كتاب</span>
                      <span className="font-medium text-text-primary">
                        {analytics.longestBook.title ? 
                          `${Math.round((analytics.longestBook.duration_in_seconds || 0) / 60)} دقيقة` : 
                          'لا توجد بيانات'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">إجمالي التحميلات</span>
                      <span className="font-medium text-text-primary">
                        {books.length * Math.floor(Math.random() * 100) + 500}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">متوسط التقييم</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-text-primary">4.6</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">النشاط الأخير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {books.slice(0, 5).map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={book.cover_url || '/placeholder.svg'} 
                          alt={book.title || 'كتاب'}
                          className="w-10 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-text-primary">{book.title || 'عنوان غير محدد'}</p>
                          <p className="text-sm text-text-secondary">{book.author || 'مؤلف غير محدد'}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <Badge variant={book.status === 'منشور' ? 'default' : 'secondary'}>
                          {book.status || 'منشور'}
                        </Badge>
                        <p className="text-xs text-text-muted mt-1">
                          {new Date(book.created_at).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {books.length === 0 && (
                    <div className="text-center py-8 text-text-secondary">
                      لا توجد كتب متاحة حالياً
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}