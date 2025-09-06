import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Headphones,
  Eye,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Loader2,
  Clock,
  MapPin,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function ReportsManagement() {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedReport, setSelectedReport] = useState('overview');
  const { toast } = useToast();

  const reportTypes = [
    { id: 'overview', name: 'نظرة عامة', icon: Eye },
    { id: 'users', name: 'تقرير المستخدمين', icon: Users },
    { id: 'books', name: 'تقرير الكتب', icon: BookOpen },
    { id: 'listening', name: 'إحصائيات الاستماع', icon: Headphones },
    { id: 'geographic', name: 'التوزيع الجغرافي', icon: MapPin },
    { id: 'activity', name: 'نشاط المنصة', icon: Activity }
  ];

  const periods = [
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'quarter', label: 'هذا الربع' },
    { value: 'year', label: 'هذا العام' },
    { value: 'custom', label: 'فترة مخصصة' }
  ];

  // Mock data for demonstrations
  const overviewStats = [
    { title: 'إجمالي المستخدمين', value: '5,247', change: '+12%', icon: Users, color: 'blue' },
    { title: 'الكتب المنشورة', value: '1,893', change: '+8%', icon: BookOpen, color: 'green' },
    { title: 'ساعات الاستماع', value: '24,567', change: '+15%', icon: Headphones, color: 'purple' },
    { title: 'التحميلات', value: '89,432', change: '+23%', icon: Download, color: 'orange' }
  ];

  const topBooks = [
    { title: 'أسرار التطوير الشخصي', listens: 2450, downloads: 1890, rating: 4.8 },
    { title: 'تاريخ الحضارة الإسلامية', listens: 2120, downloads: 1650, rating: 4.7 },
    { title: 'قصص من التراث', listens: 1980, downloads: 1420, rating: 4.6 },
    { title: 'علوم القرآن', listens: 1850, downloads: 1380, rating: 4.9 },
    { title: 'الفلسفة الإسلامية', listens: 1720, downloads: 1250, rating: 4.5 }
  ];

  const userGrowth = [
    { month: 'يناير', users: 3200, growth: 8 },
    { month: 'فبراير', users: 3450, growth: 7.8 },
    { month: 'مارس', users: 3890, growth: 12.7 },
    { month: 'أبريل', users: 4320, growth: 11.1 },
    { month: 'مايو', users: 4680, growth: 8.3 },
    { month: 'يونيو', users: 5247, growth: 12.1 }
  ];

  const listeningByCategory = [
    { category: 'التنمية البشرية', hours: 8450, percentage: 34 },
    { category: 'التاريخ', hours: 6320, percentage: 25 },
    { category: 'الأدب', hours: 4890, percentage: 20 },
    { category: 'العلوم', hours: 3210, percentage: 13 },
    { category: 'أخرى', hours: 1980, percentage: 8 }
  ];

  const geographicData = [
    { country: 'المملكة العربية السعودية', users: 1890, percentage: 36 },
    { country: 'مصر', users: 1230, percentage: 23 },
    { country: 'الإمارات العربية المتحدة', users: 890, percentage: 17 },
    { country: 'الأردن', users: 520, percentage: 10 },
    { country: 'الكويت', users: 380, percentage: 7 },
    { country: 'دول أخرى', users: 337, percentage: 7 }
  ];

  const handleExportReport = async (type: string) => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let csvContent = '';
      let filename = '';
      
      switch (type) {
        case 'overview':
          csvContent = [
            'المؤشر,القيمة,النمو',
            ...overviewStats.map(stat => `${stat.title},${stat.value},${stat.change}`)
          ].join('\n');
          filename = 'overview_report';
          break;
        case 'users':
          csvContent = [
            'الشهر,المستخدمين,النمو%',
            ...userGrowth.map(item => `${item.month},${item.users},${item.growth}%`)
          ].join('\n');
          filename = 'users_report';
          break;
        case 'books':
          csvContent = [
            'العنوان,الاستماعات,التحميلات,التقييم',
            ...topBooks.map(book => `${book.title},${book.listens},${book.downloads},${book.rating}`)
          ].join('\n');
          filename = 'books_report';
          break;
        case 'geographic':
          csvContent = [
            'الدولة,المستخدمين,النسبة%',
            ...geographicData.map(item => `${item.country},${item.users},${item.percentage}%`)
          ].join('\n');
          filename = 'geographic_report';
          break;
        default:
          csvContent = 'البيانات,القيمة\nلا توجد بيانات متاحة,0';
          filename = 'report';
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: 'تم تصدير التقرير',
        description: 'تم تصدير التقرير بنجاح كملف CSV',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">التقارير والإحصائيات</h1>
          <p className="text-text-secondary mt-1">تحليل شامل لأداء المنصة والمستخدمين</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => handleExportReport(selectedReport)}
            className="bg-gradient-primary hover:bg-gradient-primary/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري التصدير...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 ml-2" />
                تصدير التقرير
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <Card className="shadow-admin">
        <CardHeader>
          <CardTitle className="text-text-primary">نوع التقرير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {reportTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedReport === type.id ? "default" : "outline"}
                className={`h-20 flex flex-col items-center gap-2 ${
                  selectedReport === type.id 
                    ? "bg-gradient-primary text-white" 
                    : "hover:bg-surface-secondary"
                }`}
                onClick={() => setSelectedReport(type.id)}
              >
                <type.icon className="h-5 w-5" />
                <span className="text-xs text-center">{type.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports Content */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        {/* Overview Report */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => (
                <Card key={index} className="stat-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-secondary">{stat.title}</p>
                        <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-success ml-1" />
                          <span className="text-success text-sm font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center shadow-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Top Books */}
            <Card className="shadow-admin">
              <CardHeader>
                <CardTitle className="text-text-primary">أكثر الكتب استماعاً</CardTitle>
                <CardDescription>الكتب الأكثر شعبية خلال {periods.find(p => p.value === selectedPeriod)?.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topBooks.map((book, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-surface-secondary">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">{book.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Headphones className="h-4 w-4" />
                              {book.listens.toLocaleString()} استماع
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {book.downloads.toLocaleString()} تحميل
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-primary">
                        ⭐ {book.rating}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Report */}
        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-admin">
              <CardHeader>
                <CardTitle className="text-text-primary">نمو المستخدمين</CardTitle>
                <CardDescription>إحصائيات نمو المستخدمين الشهرية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userGrowth.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                      <div>
                        <p className="font-medium text-text-primary">{item.month}</p>
                        <p className="text-sm text-text-secondary">{item.users.toLocaleString()} مستخدم</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-success">+{item.growth}%</p>
                        <Progress value={item.growth * 5} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-admin">
              <CardHeader>
                <CardTitle className="text-text-primary">إحصائيات المستخدمين</CardTitle>
                <CardDescription>توزيع وتحليل بيانات المستخدمين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">المستخدمين النشطين</span>
                      <span className="text-sm font-medium text-text-primary">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">المستخدمين المحققين</span>
                      <span className="text-sm font-medium text-text-primary">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">معدل الاحتفاظ</span>
                      <span className="text-sm font-medium text-text-primary">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">المستخدمين الجدد</span>
                      <span className="text-sm font-medium text-text-primary">24%</span>
                    </div>
                    <Progress value={24} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Books Report */}
        <TabsContent value="books">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-admin">
              <CardHeader>
                <CardTitle className="text-text-primary">إحصائيات الكتب</CardTitle>
                <CardDescription>تحليل أداء مكتبة الكتب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-surface-secondary">
                      <p className="text-2xl font-bold text-text-primary">1,893</p>
                      <p className="text-sm text-text-secondary">إجمالي الكتب</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-surface-secondary">
                      <p className="text-2xl font-bold text-text-primary">156</p>
                      <p className="text-sm text-text-secondary">كتب جديدة</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-surface-secondary">
                      <p className="text-2xl font-bold text-text-primary">4.6</p>
                      <p className="text-sm text-text-secondary">متوسط التقييم</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-surface-secondary">
                      <p className="text-2xl font-bold text-text-primary">89%</p>
                      <p className="text-sm text-text-secondary">معدل الإكمال</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-admin">
              <CardHeader>
                <CardTitle className="text-text-primary">الفئات الأكثر شعبية</CardTitle>
                <CardDescription>إحصائيات الاستماع حسب الفئة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listeningByCategory.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-text-primary">{category.category}</span>
                        <span className="text-sm text-text-secondary">{category.hours.toLocaleString()} ساعة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={category.percentage} className="flex-1 h-2" />
                        <span className="text-xs text-text-muted w-8">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Listening Report */}
        <TabsContent value="listening">
          <Card className="shadow-admin">
            <CardHeader>
              <CardTitle className="text-text-primary">إحصائيات الاستماع</CardTitle>
              <CardDescription>تحليل شامل لأنماط الاستماع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">الأوقات الذروة</h3>
                  <div className="space-y-2">
                    {[
                      { time: '9:00 - 10:00', percentage: 85 },
                      { time: '14:00 - 15:00', percentage: 72 },
                      { time: '20:00 - 21:00', percentage: 93 },
                      { time: '22:00 - 23:00', percentage: 68 }
                    ].map((slot, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-text-secondary">{slot.time}</span>
                          <span className="text-sm font-medium text-text-primary">{slot.percentage}%</span>
                        </div>
                        <Progress value={slot.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">الأجهزة المستخدمة</h3>
                  <div className="space-y-3">
                    {[
                      { device: 'الهاتف المحمول', percentage: 68, color: 'blue' },
                      { device: 'الحاسوب', percentage: 22, color: 'green' },
                      { device: 'التابلت', percentage: 10, color: 'orange' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                        <span className="text-sm font-medium text-text-primary">{item.device}</span>
                        <Badge variant="outline" className="text-primary">
                          {item.percentage}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">أيام الأسبوع</h3>
                  <div className="space-y-2">
                    {[
                      { day: 'الأحد', hours: 3450 },
                      { day: 'الإثنين', hours: 4230 },
                      { day: 'الثلاثاء', hours: 3890 },
                      { day: 'الأربعاء', hours: 4100 },
                      { day: 'الخميس', hours: 3780 },
                      { day: 'الجمعة', hours: 5200 },
                      { day: 'السبت', hours: 4870 }
                    ].map((day, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded bg-surface-secondary">
                        <span className="text-sm text-text-secondary">{day.day}</span>
                        <span className="text-sm font-medium text-text-primary">{day.hours.toLocaleString()}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Report */}
        <TabsContent value="geographic">
          <Card className="shadow-admin">
            <CardHeader>
              <CardTitle className="text-text-primary">التوزيع الجغرافي</CardTitle>
              <CardDescription>إحصائيات المستخدمين حسب البلدان</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-surface-secondary">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{country.country}</p>
                        <p className="text-sm text-text-secondary">{country.users.toLocaleString()} مستخدم</p>
                      </div>
                    </div>
                    <div className="text-left min-w-24">
                      <Badge variant="outline" className="text-primary">
                        {country.percentage}%
                      </Badge>
                      <Progress value={country.percentage} className="w-20 h-2 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Report */}
        <TabsContent value="activity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-admin">
              <CardHeader>
                <CardTitle className="text-text-primary">نشاط المنصة</CardTitle>
                <CardDescription>الأنشطة الحديثة على المنصة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'تسجيل مستخدم جديد', count: 234, time: 'اليوم' },
                    { action: 'رفع كتاب جديد', count: 12, time: 'اليوم' },
                    { action: 'تحميل كتب', count: 1456, time: 'اليوم' },
                    { action: 'تقييمات جديدة', count: 89, time: 'اليوم' },
                    { action: 'تعليقات جديدة', count: 156, time: 'اليوم' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                      <div>
                        <p className="font-medium text-text-primary">{activity.action}</p>
                        <p className="text-sm text-text-secondary">{activity.time}</p>
                      </div>
                      <Badge variant="outline" className="text-primary">
                        {activity.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-admin">
              <CardHeader>
                <CardTitle className="text-text-primary">الأداء العام</CardTitle>
                <CardDescription>مؤشرات الأداء الرئيسية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">معدل الرضا</span>
                      <span className="text-sm font-medium text-text-primary">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">سرعة التحميل</span>
                      <span className="text-sm font-medium text-text-primary">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">استقرار النظام</span>
                      <span className="text-sm font-medium text-text-primary">99%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">معدل الاستخدام</span>
                      <span className="text-sm font-medium text-text-primary">76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}