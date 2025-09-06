import { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  Edit,
  BellRing,
  Mail,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    scheduleType: 'now',
    scheduledDate: '',
    scheduledTime: '',
    enablePush: true,
    enableEmail: false,
    enableInApp: true
  });

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      title: 'كتب جديدة متاحة الآن',
      message: 'تم إضافة 15 كتاب جديد في قسم التنمية البشرية',
      type: 'info',
      status: 'sent',
      targetAudience: 'all',
      sentAt: '2024-01-15T10:30:00Z',
      recipients: 5247,
      opened: 3456,
      clicked: 892
    },
    {
      id: '2',
      title: 'تحديث في النظام',
      message: 'سيتم إجراء صيانة للنظام يوم الجمعة من 2-4 صباحاً',
      type: 'warning',
      status: 'scheduled',
      targetAudience: 'active',
      scheduledFor: '2024-01-20T02:00:00Z',
      recipients: 4532,
      opened: 0,
      clicked: 0
    },
    {
      id: '3',
      title: 'عرض خاص لأعضاء VIP',
      message: 'استمتع بخصم 50% على جميع الكتب المدفوعة',
      type: 'success',
      status: 'draft',
      targetAudience: 'premium',
      recipients: 892,
      opened: 0,
      clicked: 0
    },
    {
      id: '4',
      title: 'تذكير بالكتب المحفوظة',
      message: 'لديك 5 كتب محفوظة لم تستمع إليها بعد',
      type: 'info',
      status: 'sent',
      targetAudience: 'inactive',
      sentAt: '2024-01-10T18:00:00Z',
      recipients: 1235,
      opened: 567,
      clicked: 234
    }
  ];

  const audienceOptions = [
    { value: 'all', label: 'جميع المستخدمين' },
    { value: 'active', label: 'المستخدمين النشطين' },
    { value: 'inactive', label: 'المستخدمين غير النشطين' },
    { value: 'premium', label: 'أعضاء VIP' },
    { value: 'new', label: 'المستخدمين الجدد' }
  ];

  const notificationTypes = [
    { value: 'info', label: 'معلومات', icon: Info, color: 'blue' },
    { value: 'success', label: 'نجاح', icon: CheckCircle, color: 'green' },
    { value: 'warning', label: 'تحذير', icon: AlertCircle, color: 'yellow' },
    { value: 'error', label: 'خطأ', icon: X, color: 'red' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateNotification = async () => {
    setSending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'تم إنشاء الإشعار',
        description: 'تم إنشاء الإشعار بنجاح وسيتم إرساله حسب التوقيت المحدد',
      });
      
      setIsCreateDialogOpen(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all',
        scheduleType: 'now',
        scheduledDate: '',
        scheduledTime: '',
        enablePush: true,
        enableEmail: false,
        enableInApp: true
      });
    } catch (error) {
      toast({
        title: 'خطأ في الإنشاء',
        description: 'حدث خطأ أثناء إنشاء الإشعار',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedNotifications.length === 0) {
      toast({
        title: 'لم يتم تحديد إشعارات',
        description: 'يرجى تحديد إشعار واحد على الأقل',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم تنفيذ العملية',
        description: `تم ${action} ${selectedNotifications.length} إشعار بنجاح`,
      });
      
      setSelectedNotifications([]);
    } catch (error) {
      toast({
        title: 'خطأ في العملية',
        description: 'حدث خطأ أثناء تنفيذ العملية',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'تم الإرسال';
      case 'scheduled': return 'مجدول';
      case 'draft': return 'مسودة';
      case 'failed': return 'فشل';
      default: return 'غير محدد';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeObj = notificationTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : Info;
  };

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    drafts: notifications.filter(n => n.status === 'draft').length,
    totalRecipients: notifications.reduce((sum, n) => sum + n.recipients, 0),
    totalOpened: notifications.reduce((sum, n) => sum + n.opened, 0),
    totalClicked: notifications.reduce((sum, n) => sum + n.clicked, 0)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">إدارة الإشعارات</h1>
          <p className="text-text-secondary mt-1">إرسال وإدارة إشعارات المستخدمين</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-elegant">
              <Plus className="w-4 h-4 ml-2" />
              إنشاء إشعار جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right">إنشاء إشعار جديد</DialogTitle>
              <DialogDescription className="text-right">
                قم بإنشاء وإرسال إشعار للمستخدمين
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الإشعار</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  placeholder="أدخل عنوان الإشعار"
                  className="text-right"
                />
              </div>
              
              <div>
                <Label htmlFor="message">محتوى الإشعار</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  placeholder="أدخل محتوى الإشعار"
                  className="text-right"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">نوع الإشعار</Label>
                  <Select value={newNotification.type} onValueChange={(value) => 
                    setNewNotification({...newNotification, type: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="audience">الجمهور المستهدف</Label>
                  <Select value={newNotification.targetAudience} onValueChange={(value) => 
                    setNewNotification({...newNotification, targetAudience: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audienceOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>توقيت الإرسال</Label>
                <Select value={newNotification.scheduleType} onValueChange={(value) => 
                  setNewNotification({...newNotification, scheduleType: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">إرسال فوري</SelectItem>
                    <SelectItem value="scheduled">جدولة الإرسال</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newNotification.scheduleType === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledDate">التاريخ</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={newNotification.scheduledDate}
                      onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduledTime">الوقت</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={newNotification.scheduledTime}
                      onChange={(e) => setNewNotification({...newNotification, scheduledTime: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label>قنوات الإرسال</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4 text-text-secondary" />
                      <span className="text-sm text-text-primary">إشعارات push</span>
                    </div>
                    <Switch
                      checked={newNotification.enablePush}
                      onCheckedChange={(checked) => 
                        setNewNotification({...newNotification, enablePush: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-text-secondary" />
                      <span className="text-sm text-text-primary">البريد الإلكتروني</span>
                    </div>
                    <Switch
                      checked={newNotification.enableEmail}
                      onCheckedChange={(checked) => 
                        setNewNotification({...newNotification, enableEmail: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-text-secondary" />
                      <span className="text-sm text-text-primary">داخل التطبيق</span>
                    </div>
                    <Switch
                      checked={newNotification.enableInApp}
                      onCheckedChange={(checked) => 
                        setNewNotification({...newNotification, enableInApp: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-row-reverse">
              <Button 
                onClick={handleCreateNotification}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-2" />
                    إنشاء الإشعار
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={sending}
              >
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">إجمالي الإشعارات</p>
                <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">تم الإرسال</p>
                <p className="text-2xl font-bold text-text-primary">{stats.sent}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">مجدولة</p>
                <p className="text-2xl font-bold text-text-primary">{stats.scheduled}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">مسودات</p>
                <p className="text-2xl font-bold text-text-primary">{stats.drafts}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Edit className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-admin">
          <CardHeader>
            <CardTitle className="text-text-primary text-center">إجمالي المستلمين</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-text-primary">{stats.totalRecipients.toLocaleString()}</p>
            <p className="text-sm text-text-secondary mt-1">مستخدم</p>
          </CardContent>
        </Card>

        <Card className="shadow-admin">
          <CardHeader>
            <CardTitle className="text-text-primary text-center">معدل الفتح</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-text-primary">
              {Math.round((stats.totalOpened / stats.totalRecipients) * 100)}%
            </p>
            <p className="text-sm text-text-secondary mt-1">
              {stats.totalOpened.toLocaleString()} من {stats.totalRecipients.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-admin">
          <CardHeader>
            <CardTitle className="text-text-primary text-center">معدل النقر</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-text-primary">
              {Math.round((stats.totalClicked / stats.totalOpened) * 100)}%
            </p>
            <p className="text-sm text-text-secondary mt-1">
              {stats.totalClicked.toLocaleString()} من {stats.totalOpened.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Table */}
      <Card className="shadow-admin">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-text-primary">قائمة الإشعارات</CardTitle>
              <CardDescription className="text-text-secondary">
                إدارة ومراقبة جميع الإشعارات المرسلة
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="البحث في الإشعارات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-full sm:w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="sent">تم الإرسال</SelectItem>
                  <SelectItem value="scheduled">مجدولة</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  {notificationTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedNotifications.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-surface-secondary rounded-lg">
              <span className="text-sm text-text-secondary">
                تم تحديد {selectedNotifications.length} إشعار
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleBulkAction('حذف')}
              >
                <Trash2 className="w-4 h-4 ml-2" />
                حذف المحدد
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedNotifications([])}
              >
                إلغاء التحديد
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-secondary">
                  <TableHead className="text-right w-12">
                    <Checkbox
                      checked={selectedNotifications.length === filteredNotifications.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedNotifications(filteredNotifications.map(n => n.id));
                        } else {
                          setSelectedNotifications([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-right font-semibold">النوع</TableHead>
                  <TableHead className="text-right font-semibold">العنوان</TableHead>
                  <TableHead className="text-right font-semibold">المحتوى</TableHead>
                  <TableHead className="text-right font-semibold">الجمهور</TableHead>
                  <TableHead className="text-right font-semibold">الحالة</TableHead>
                  <TableHead className="text-right font-semibold">التاريخ</TableHead>
                  <TableHead className="text-right font-semibold">الإحصائيات</TableHead>
                  <TableHead className="text-right font-semibold">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => {
                  const TypeIcon = getTypeIcon(notification.type);
                  return (
                    <TableRow key={notification.id} className="hover:bg-surface-secondary/50 transition-colors">
                      <TableCell>
                        <Checkbox
                          checked={selectedNotifications.includes(notification.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedNotifications([...selectedNotifications, notification.id]);
                            } else {
                              setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TypeIcon className="h-5 w-5 text-text-secondary" />
                      </TableCell>
                      <TableCell className="font-medium text-text-primary max-w-xs truncate">
                        {notification.title}
                      </TableCell>
                      <TableCell className="text-text-secondary max-w-xs truncate">
                        {notification.message}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {audienceOptions.find(a => a.value === notification.targetAudience)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(notification.status)}>
                          {getStatusText(notification.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {notification.sentAt 
                          ? new Date(notification.sentAt).toLocaleDateString('ar-EG')
                          : notification.scheduledFor 
                            ? new Date(notification.scheduledFor).toLocaleDateString('ar-EG')
                            : 'غير محدد'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-text-secondary">
                          <div>👥 {notification.recipients.toLocaleString()}</div>
                          <div>👀 {notification.opened.toLocaleString()}</div>
                          <div>👆 {notification.clicked.toLocaleString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-accent/20"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-accent/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}