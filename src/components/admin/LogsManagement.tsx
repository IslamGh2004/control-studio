import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  User,
  Activity,
  Database,
  Shield,
  Eye,
  Trash2,
  Settings,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function LogsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Mock logs data
  const logs = [
    {
      id: '1',
      timestamp: '2024-01-15T14:30:25Z',
      level: 'info',
      category: 'user',
      message: 'تسجيل دخول مستخدم جديد',
      user: 'ahmed@example.com',
      ip: '192.168.1.100',
      details: 'User logged in successfully from mobile device'
    },
    {
      id: '2',
      timestamp: '2024-01-15T14:28:15Z',
      level: 'warning',
      category: 'security',
      message: 'محاولة تسجيل دخول فاشلة',
      user: 'unknown@test.com',
      ip: '10.0.0.50',
      details: 'Failed login attempt - invalid password'
    },
    {
      id: '3',
      timestamp: '2024-01-15T14:25:45Z',
      level: 'success',
      category: 'book',
      message: 'تم رفع كتاب جديد',
      user: 'admin@example.com',
      ip: '192.168.1.10',
      details: 'Book "تاريخ الأدب العربي" uploaded successfully'
    },
    {
      id: '4',
      timestamp: '2024-01-15T14:20:12Z',
      level: 'error',
      category: 'system',
      message: 'خطأ في قاعدة البيانات',
      user: 'system',
      ip: 'localhost',
      details: 'Database connection timeout after 30 seconds'
    },
    {
      id: '5',
      timestamp: '2024-01-15T14:15:33Z',
      level: 'info',
      category: 'admin',
      message: 'تحديث إعدادات النظام',
      user: 'admin@example.com',
      ip: '192.168.1.10',
      details: 'System settings updated - notification preferences changed'
    },
    {
      id: '6',
      timestamp: '2024-01-15T14:10:28Z',
      level: 'warning',
      category: 'performance',
      message: 'استخدام ذاكرة عالي',
      user: 'system',
      ip: 'localhost',
      details: 'Memory usage reached 85% - cleanup recommended'
    }
  ];

  const systemLogs = [
    {
      id: '1',
      timestamp: '2024-01-15T14:30:00Z',
      component: 'Database',
      status: 'healthy',
      message: 'Connection pool optimized',
      cpu: '45%',
      memory: '67%',
      disk: '32%'
    },
    {
      id: '2',
      timestamp: '2024-01-15T14:25:00Z',
      component: 'API Server',
      status: 'healthy',
      message: 'Response time optimal',
      cpu: '52%',
      memory: '58%',
      disk: '32%'
    },
    {
      id: '3',
      timestamp: '2024-01-15T14:20:00Z',
      component: 'File Storage',
      status: 'warning',
      message: 'Storage space running low',
      cpu: '23%',
      memory: '41%',
      disk: '78%'
    },
    {
      id: '4',
      timestamp: '2024-01-15T14:15:00Z',
      component: 'Cache',
      status: 'healthy',
      message: 'Cache hit ratio excellent',
      cpu: '18%',
      memory: '34%',
      disk: '12%'
    }
  ];

  const auditLogs = [
    {
      id: '1',
      timestamp: '2024-01-15T14:30:00Z',
      action: 'DELETE_USER',
      resource: 'User #12345',
      user: 'admin@example.com',
      result: 'success',
      details: 'User account deleted permanently'
    },
    {
      id: '2',
      timestamp: '2024-01-15T14:25:00Z',
      action: 'UPDATE_BOOK',
      resource: 'Book #678',
      user: 'editor@example.com',
      result: 'success',
      details: 'Book metadata updated'
    },
    {
      id: '3',
      timestamp: '2024-01-15T14:20:00Z',
      action: 'CHANGE_SETTINGS',
      resource: 'System Settings',
      user: 'admin@example.com',
      result: 'success',
      details: 'Email notification settings changed'
    },
    {
      id: '4',
      timestamp: '2024-01-15T14:15:00Z',
      action: 'EXPORT_DATA',
      resource: 'User Reports',
      user: 'manager@example.com',
      result: 'failed',
      details: 'Export failed due to insufficient permissions'
    }
  ];

  const levels = [
    { value: 'all', label: 'جميع المستويات' },
    { value: 'info', label: 'معلومات', color: 'blue' },
    { value: 'success', label: 'نجاح', color: 'green' },
    { value: 'warning', label: 'تحذير', color: 'yellow' },
    { value: 'error', label: 'خطأ', color: 'red' }
  ];

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'user', label: 'المستخدمين' },
    { value: 'book', label: 'الكتب' },
    { value: 'admin', label: 'الإدارة' },
    { value: 'security', label: 'الأمان' },
    { value: 'system', label: 'النظام' },
    { value: 'performance', label: 'الأداء' }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث السجلات بنجاح',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = async (type: string) => {
    setLoading(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let csvContent = '';
      let filename = '';
      
      switch (type) {
        case 'activity':
          csvContent = [
            'الوقت,المستوى,الفئة,الرسالة,المستخدم,IP',
            ...filteredLogs.map(log => 
              `${new Date(log.timestamp).toLocaleString('ar-EG')},${log.level},${log.category},${log.message},${log.user},${log.ip}`
            )
          ].join('\n');
          filename = 'activity_logs';
          break;
        case 'system':
          csvContent = [
            'الوقت,المكون,الحالة,الرسالة,المعالج,الذاكرة,القرص',
            ...systemLogs.map(log => 
              `${new Date(log.timestamp).toLocaleString('ar-EG')},${log.component},${log.status},${log.message},${log.cpu},${log.memory},${log.disk}`
            )
          ].join('\n');
          filename = 'system_logs';
          break;
        case 'audit':
          csvContent = [
            'الوقت,الإجراء,المورد,المستخدم,النتيجة,التفاصيل',
            ...auditLogs.map(log => 
              `${new Date(log.timestamp).toLocaleString('ar-EG')},${log.action},${log.resource},${log.user},${log.result},${log.details}`
            )
          ].join('\n');
          filename = 'audit_logs';
          break;
        default:
          csvContent = 'لا توجد بيانات';
          filename = 'logs';
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: 'تم التصدير',
        description: 'تم تصدير السجلات بنجاح',
      });
    } finally {
      setLoading(false);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return Info;
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return XCircle;
      default: return Info;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'default';
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  const stats = {
    total: logs.length,
    errors: logs.filter(log => log.level === 'error').length,
    warnings: logs.filter(log => log.level === 'warning').length,
    info: logs.filter(log => log.level === 'info').length,
    success: logs.filter(log => log.level === 'success').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">سجلات النظام</h1>
          <p className="text-text-secondary mt-1">مراقبة وتحليل أنشطة وأحداث النظام</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="action-button"
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 ml-2" />
            )}
            تحديث
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">إجمالي السجلات</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">أخطاء</p>
                <p className="text-2xl font-bold text-red-900">{stats.errors}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">تحذيرات</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.warnings}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">نجح</p>
                <p className="text-2xl font-bold text-green-900">{stats.success}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">معلومات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.info}</p>
              </div>
              <Info className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Tabs */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            سجلات النشاط
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            سجلات النظام
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            سجلات التدقيق
          </TabsTrigger>
        </TabsList>

        {/* Activity Logs */}
        <TabsContent value="activity">
          <Card className="shadow-admin">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-text-primary">سجلات النشاط</CardTitle>
                  <CardDescription className="text-text-secondary">
                    جميع أنشطة المستخدمين والأحداث في النظام
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <Input
                      placeholder="البحث في السجلات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 w-full sm:w-80"
                    />
                  </div>
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => handleExport('activity')}
                    variant="outline"
                    className="action-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 ml-2" />
                    )}
                    تصدير
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-surface-secondary">
                      <TableHead className="text-right font-semibold">الوقت</TableHead>
                      <TableHead className="text-right font-semibold">المستوى</TableHead>
                      <TableHead className="text-right font-semibold">الفئة</TableHead>
                      <TableHead className="text-right font-semibold">الرسالة</TableHead>
                      <TableHead className="text-right font-semibold">المستخدم</TableHead>
                      <TableHead className="text-right font-semibold">عنوان IP</TableHead>
                      <TableHead className="text-right font-semibold">التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const LevelIcon = getLevelIcon(log.level);
                      return (
                        <TableRow key={log.id} className="hover:bg-surface-secondary/50 transition-colors">
                          <TableCell className="text-text-secondary">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(log.timestamp).toLocaleString('ar-EG')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getLevelColor(log.level)} className="flex items-center gap-1 w-fit">
                              <LevelIcon className="h-3 w-3" />
                              {levels.find(l => l.value === log.level)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {categories.find(c => c.value === log.category)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-text-primary">
                            {log.message}
                          </TableCell>
                          <TableCell className="text-text-secondary">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {log.user}
                            </div>
                          </TableCell>
                          <TableCell className="text-text-secondary font-mono">
                            {log.ip}
                          </TableCell>
                          <TableCell className="text-text-secondary max-w-xs truncate">
                            {log.details}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Logs */}
        <TabsContent value="system">
          <Card className="shadow-admin">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-text-primary">سجلات النظام</CardTitle>
                  <CardDescription className="text-text-secondary">
                    مراقبة أداء مكونات النظام
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => handleExport('system')}
                  variant="outline"
                  className="action-button"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 ml-2" />
                  )}
                  تصدير
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-surface-secondary">
                      <TableHead className="text-right font-semibold">الوقت</TableHead>
                      <TableHead className="text-right font-semibold">المكون</TableHead>
                      <TableHead className="text-right font-semibold">الحالة</TableHead>
                      <TableHead className="text-right font-semibold">الرسالة</TableHead>
                      <TableHead className="text-right font-semibold">المعالج</TableHead>
                      <TableHead className="text-right font-semibold">الذاكرة</TableHead>
                      <TableHead className="text-right font-semibold">القرص</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-surface-secondary/50 transition-colors">
                        <TableCell className="text-text-secondary">
                          {new Date(log.timestamp).toLocaleString('ar-EG')}
                        </TableCell>
                        <TableCell className="font-medium text-text-primary">
                          {log.component}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(log.status)}>
                            {log.status === 'healthy' ? 'سليم' : 
                             log.status === 'warning' ? 'تحذير' : 'خطأ'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-text-secondary">
                          {log.message}
                        </TableCell>
                        <TableCell className="text-text-secondary font-mono">
                          {log.cpu}
                        </TableCell>
                        <TableCell className="text-text-secondary font-mono">
                          {log.memory}
                        </TableCell>
                        <TableCell className="text-text-secondary font-mono">
                          {log.disk}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit">
          <Card className="shadow-admin">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-text-primary">سجلات التدقيق</CardTitle>
                  <CardDescription className="text-text-secondary">
                    تدقيق الإجراءات الإدارية والتغييرات الهامة
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => handleExport('audit')}
                  variant="outline"
                  className="action-button"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 ml-2" />
                  )}
                  تصدير
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-surface-secondary">
                      <TableHead className="text-right font-semibold">الوقت</TableHead>
                      <TableHead className="text-right font-semibold">الإجراء</TableHead>
                      <TableHead className="text-right font-semibold">المورد</TableHead>
                      <TableHead className="text-right font-semibold">المستخدم</TableHead>
                      <TableHead className="text-right font-semibold">النتيجة</TableHead>
                      <TableHead className="text-right font-semibold">التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-surface-secondary/50 transition-colors">
                        <TableCell className="text-text-secondary">
                          {new Date(log.timestamp).toLocaleString('ar-EG')}
                        </TableCell>
                        <TableCell className="font-medium text-text-primary font-mono">
                          {log.action}
                        </TableCell>
                        <TableCell className="text-text-secondary">
                          {log.resource}
                        </TableCell>
                        <TableCell className="text-text-secondary">
                          {log.user}
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.result === 'success' ? 'default' : 'destructive'}>
                            {log.result === 'success' ? 'نجح' : 'فشل'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-text-secondary max-w-xs truncate">
                          {log.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}