import { useState } from 'react';
import { 
  Settings, 
  Save, 
  Upload, 
  Download, 
  Shield, 
  Database, 
  Mail, 
  Bell,
  Globe,
  Palette,
  Server,
  Key,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function SettingsManagement() {
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const { toast } = useToast();

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'مكتبة الكتب الصوتية',
    siteDescription: 'منصة شاملة للكتب الصوتية العربية',
    contactEmail: 'contact@audiobooks.com',
    supportPhone: '+966123456789',
    maxUploadSize: '500',
    allowedFormats: 'mp3,wav,m4a',
    enableRegistration: true,
    requireEmailVerification: true,
    autoPublishBooks: false,
    enableComments: true,
    enableRating: true,
    enableDownloads: true,
    maintenanceMode: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    enableSSL: true,
    fromEmail: 'noreply@audiobooks.com',
    fromName: 'مكتبة الكتب الصوتية',
    enableWelcomeEmail: true,
    enableNotifications: true
  });

  const [storageSettings, setStorageSettings] = useState({
    provider: 'supabase',
    maxStorageSize: '50',
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: '30',
    compressionEnabled: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: '24',
    maxLoginAttempts: '5',
    enableCaptcha: false,
    enableSSL: true,
    enableCSRF: true,
    allowedIPs: '',
    blockedIPs: ''
  });

  const handleSaveSettings = async (settingsType: string) => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم الحفظ بنجاح',
        description: `تم حفظ إعدادات ${settingsType} بنجاح`,
      });
    } catch (error) {
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ الإعدادات',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    try {
      // Simulate email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'تم إرسال البريد التجريبي',
        description: 'تم إرسال بريد إلكتروني تجريبي بنجاح',
      });
    } catch (error) {
      toast({
        title: 'فشل إرسال البريد',
        description: 'تحقق من إعدادات SMTP',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    try {
      for (let i = 0; i <= 100; i += 10) {
        setBackupProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      toast({
        title: 'تم إنشاء النسخة الاحتياطية',
        description: 'تم إنشاء نسخة احتياطية كاملة من البيانات',
      });
      
      // Download backup file
      const blob = new Blob(['backup-data'], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
    } finally {
      setIsBackingUp(false);
      setBackupProgress(0);
    }
  };

  const systemStatus = [
    { name: 'قاعدة البيانات', status: 'online', response: '12ms' },
    { name: 'التخزين', status: 'online', response: '8ms' },
    { name: 'البريد الإلكتروني', status: 'online', response: '45ms' },
    { name: 'النسخ الاحتياطي', status: 'warning', response: '2h ago' },
    { name: 'المراقبة', status: 'online', response: '5ms' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">إعدادات النظام</h1>
          <p className="text-text-secondary mt-1">إدارة وتكوين إعدادات المنصة</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleBackup}
            variant="outline"
            className="action-button"
            disabled={isBackingUp}
          >
            {isBackingUp ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 ml-2" />
            )}
            نسخة احتياطية
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card className="shadow-admin">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <Server className="h-5 w-5" />
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {systemStatus.map((service) => (
              <div key={service.name} className="text-center p-4 rounded-lg bg-surface-secondary">
                <div className="flex justify-center mb-2">
                  {service.status === 'online' && (
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  )}
                  {service.status === 'warning' && (
                    <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  )}
                  {service.status === 'offline' && (
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <p className="font-medium text-text-primary text-sm">{service.name}</p>
                <p className="text-xs text-text-secondary">{service.response}</p>
              </div>
            ))}
          </div>
          
          {isBackingUp && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">جاري إنشاء النسخة الاحتياطية...</span>
                <span className="text-sm text-text-primary">{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            عام
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            البريد
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            التخزين
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            الأمان
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="shadow-admin">
            <CardHeader>
              <CardTitle className="text-text-primary">الإعدادات العامة</CardTitle>
              <CardDescription className="text-text-secondary">
                إعدادات أساسية للمنصة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">بريد التواصل</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                    className="text-right"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">وصف الموقع</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                  className="text-right"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maxUploadSize">حجم الرفع الأقصى (MB)</Label>
                  <Input
                    id="maxUploadSize"
                    type="number"
                    value={generalSettings.maxUploadSize}
                    onChange={(e) => setGeneralSettings({...generalSettings, maxUploadSize: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="allowedFormats">الصيغ المسموحة</Label>
                  <Input
                    id="allowedFormats"
                    value={generalSettings.allowedFormats}
                    onChange={(e) => setGeneralSettings({...generalSettings, allowedFormats: e.target.value})}
                    className="text-right"
                    dir="ltr"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">إعدادات الوظائف</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'enableRegistration', label: 'السماح بالتسجيل' },
                    { key: 'requireEmailVerification', label: 'تأكيد البريد الإلكتروني' },
                    { key: 'autoPublishBooks', label: 'نشر الكتب تلقائياً' },
                    { key: 'enableComments', label: 'تفعيل التعليقات' },
                    { key: 'enableRating', label: 'تفعيل التقييم' },
                    { key: 'enableDownloads', label: 'السماح بالتحميل' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                      <Label htmlFor={setting.key} className="text-text-primary">{setting.label}</Label>
                      <Switch
                        id={setting.key}
                        checked={generalSettings[setting.key as keyof typeof generalSettings] as boolean}
                        onCheckedChange={(checked) => 
                          setGeneralSettings({...generalSettings, [setting.key]: checked})
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">وضع الصيانة</p>
                    <p className="text-sm text-text-secondary">إيقاف الوصول للمستخدمين مؤقتاً</p>
                  </div>
                </div>
                <Switch
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => 
                    setGeneralSettings({...generalSettings, maintenanceMode: checked})
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('العامة')}
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ الإعدادات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card className="shadow-admin">
            <CardHeader>
              <CardTitle className="text-text-primary">إعدادات البريد الإلكتروني</CardTitle>
              <CardDescription className="text-text-secondary">
                تكوين خادم البريد الإلكتروني والإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpHost">خادم SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">منفذ SMTP</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpUser">المستخدم</Label>
                  <Input
                    id="smtpUser"
                    type="email"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">كلمة المرور</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                <Label htmlFor="enableSSL" className="text-text-primary">تفعيل SSL</Label>
                <Switch
                  id="enableSSL"
                  checked={emailSettings.enableSSL}
                  onCheckedChange={(checked) => 
                    setEmailSettings({...emailSettings, enableSSL: checked})
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fromEmail">البريد المرسل</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">اسم المرسل</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    className="text-right"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleTestEmail}
                  variant="outline"
                  className="action-button"
                  disabled={testing}
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الاختبار...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 ml-2" />
                      اختبار البريد
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => handleSaveSettings('البريد الإلكتروني')}
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ الإعدادات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Settings */}
        <TabsContent value="storage">
          <Card className="shadow-admin">
            <CardHeader>
              <CardTitle className="text-text-primary">إعدادات التخزين</CardTitle>
              <CardDescription className="text-text-secondary">
                إدارة مساحة التخزين والنسخ الاحتياطي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="provider">مزود التخزين</Label>
                  <Select value={storageSettings.provider} onValueChange={(value) => 
                    setStorageSettings({...storageSettings, provider: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supabase">Supabase</SelectItem>
                      <SelectItem value="aws">Amazon S3</SelectItem>
                      <SelectItem value="google">Google Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxStorageSize">الحد الأقصى للتخزين (GB)</Label>
                  <Input
                    id="maxStorageSize"
                    type="number"
                    value={storageSettings.maxStorageSize}
                    onChange={(e) => setStorageSettings({...storageSettings, maxStorageSize: e.target.value})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">النسخ الاحتياطي</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="backupFrequency">تكرار النسخ</Label>
                    <Select value={storageSettings.backupFrequency} onValueChange={(value) => 
                      setStorageSettings({...storageSettings, backupFrequency: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">كل ساعة</SelectItem>
                        <SelectItem value="daily">يومي</SelectItem>
                        <SelectItem value="weekly">أسبوعي</SelectItem>
                        <SelectItem value="monthly">شهري</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="retentionDays">مدة الاحتفاظ (أيام)</Label>
                    <Input
                      id="retentionDays"
                      type="number"
                      value={storageSettings.retentionDays}
                      onChange={(e) => setStorageSettings({...storageSettings, retentionDays: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                  <Label htmlFor="autoBackup" className="text-text-primary">النسخ التلقائي</Label>
                  <Switch
                    id="autoBackup"
                    checked={storageSettings.autoBackup}
                    onCheckedChange={(checked) => 
                      setStorageSettings({...storageSettings, autoBackup: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                  <Label htmlFor="compressionEnabled" className="text-text-primary">ضغط الملفات</Label>
                  <Switch
                    id="compressionEnabled"
                    checked={storageSettings.compressionEnabled}
                    onCheckedChange={(checked) => 
                      setStorageSettings({...storageSettings, compressionEnabled: checked})
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('التخزين')}
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ الإعدادات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="shadow-admin">
            <CardHeader>
              <CardTitle className="text-text-primary">إعدادات الأمان</CardTitle>
              <CardDescription className="text-text-secondary">
                تكوين إعدادات الأمان والحماية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  تأكد من حفظ الإعدادات بعد أي تغيير لضمان تطبيق إجراءات الأمان الجديدة.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sessionTimeout">انتهاء الجلسة (ساعات)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">عدد محاولات تسجيل الدخول</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">إعدادات الحماية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'enableTwoFactor', label: 'التحقق بخطوتين' },
                    { key: 'enableCaptcha', label: 'تفعيل CAPTCHA' },
                    { key: 'enableSSL', label: 'إجبار HTTPS' },
                    { key: 'enableCSRF', label: 'حماية CSRF' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                      <Label htmlFor={setting.key} className="text-text-primary">{setting.label}</Label>
                      <Switch
                        id={setting.key}
                        checked={securitySettings[setting.key as keyof typeof securitySettings] as boolean}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, [setting.key]: checked})
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">تحكم IP</h3>
                <div>
                  <Label htmlFor="allowedIPs">عناوين IP المسموحة</Label>
                  <Textarea
                    id="allowedIPs"
                    value={securitySettings.allowedIPs}
                    onChange={(e) => setSecuritySettings({...securitySettings, allowedIPs: e.target.value})}
                    placeholder="192.168.1.1&#10;10.0.0.1"
                    className="text-left"
                    dir="ltr"
                    rows={3}
                  />
                  <p className="text-sm text-text-muted mt-1">عنوان IP واحد في كل سطر (اتركه فارغاً للسماح للجميع)</p>
                </div>
                <div>
                  <Label htmlFor="blockedIPs">عناوين IP المحظورة</Label>
                  <Textarea
                    id="blockedIPs"
                    value={securitySettings.blockedIPs}
                    onChange={(e) => setSecuritySettings({...securitySettings, blockedIPs: e.target.value})}
                    placeholder="192.168.1.100&#10;10.0.0.50"
                    className="text-left"
                    dir="ltr"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('الأمان')}
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ الإعدادات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}