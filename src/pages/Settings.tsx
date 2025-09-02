import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Volume2, Moon, Sun, Bell, Download, Trash2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import UserNavigation from '@/components/UserNavigation';
import { useAuth } from '@/hooks/useAuth';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoplay: boolean;
  downloadQuality: 'low' | 'medium' | 'high';
  defaultVolume: number;
  skipSilence: boolean;
  playbackSpeed: number;
  sleepTimer: boolean;
  offlineMode: boolean;
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    notifications: true,
    autoplay: false,
    downloadQuality: 'medium',
    defaultVolume: 70,
    skipSilence: false,
    playbackSpeed: 1.0,
    sleepTimer: false,
    offlineMode: false,
  });

  const handleNavigate = (page: string) => {
    console.log(`Navigate to: ${page}`);
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('audiobook-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('audiobook-settings', JSON.stringify(newSettings));
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعداداتك بنجاح",
    });
  };

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleClearCache = () => {
    // Clear app cache
    localStorage.removeItem('audiobook-cache');
    toast({
      title: "تم مسح التخزين المؤقت",
      description: "تم مسح جميع البيانات المؤقتة",
    });
  };

  const handleDeleteAccount = async () => {
    // Here you would implement account deletion
    toast({
      title: "حذف الحساب",
      description: "سيتم تنفيذ هذه الميزة قريباً",
      variant: "destructive",
    });
    setShowDeleteDialog(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowLogoutDialog(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      <UserNavigation onNavigate={handleNavigate} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary">الإعدادات</h1>
          </div>
          <p className="text-text-secondary">تخصيص تجربة الاستماع الخاصة بك</p>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">المظهر</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">المظهر</Label>
                  <p className="text-sm text-text-secondary">اختر مظهر التطبيق</p>
                </div>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value: 'light' | 'dark' | 'system') => 
                    handleSettingChange('theme', value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        فاتح
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        داكن
                      </div>
                    </SelectItem>
                    <SelectItem value="system">تلقائي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Audio Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">إعدادات الصوت</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base">مستوى الصوت الافتراضي</Label>
                  <span className="text-sm text-text-secondary">{settings.defaultVolume}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <Volume2 className="h-4 w-4 text-text-secondary" />
                  <Slider
                    value={[settings.defaultVolume]}
                    onValueChange={(value) => handleSettingChange('defaultVolume', value[0])}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">سرعة التشغيل الافتراضية</Label>
                <Select 
                  value={settings.playbackSpeed.toString()} 
                  onValueChange={(value) => handleSettingChange('playbackSpeed', parseFloat(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x - بطيء جداً</SelectItem>
                    <SelectItem value="0.75">0.75x - بطيء</SelectItem>
                    <SelectItem value="1.0">1.0x - عادي</SelectItem>
                    <SelectItem value="1.25">1.25x - سريع</SelectItem>
                    <SelectItem value="1.5">1.5x - سريع جداً</SelectItem>
                    <SelectItem value="2.0">2.0x - أسرع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">تشغيل تلقائي</Label>
                  <p className="text-sm text-text-secondary">تشغيل الكتاب التالي تلقائياً</p>
                </div>
                <Switch
                  checked={settings.autoplay}
                  onCheckedChange={(checked) => handleSettingChange('autoplay', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">تخطي الصمت</Label>
                  <p className="text-sm text-text-secondary">تخطي الفترات الصامتة</p>
                </div>
                <Switch
                  checked={settings.skipSilence}
                  onCheckedChange={(checked) => handleSettingChange('skipSilence', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Download Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">إعدادات التحميل</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">جودة التحميل</Label>
                  <p className="text-sm text-text-secondary">جودة الملفات المحملة</p>
                </div>
                <Select 
                  value={settings.downloadQuality} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    handleSettingChange('downloadQuality', value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفضة</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">وضع عدم الاتصال</Label>
                  <p className="text-sm text-text-secondary">تحميل الكتب للاستماع بدون إنترنت</p>
                </div>
                <Switch
                  checked={settings.offlineMode}
                  onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Notifications Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">الإشعارات</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-text-secondary" />
                  <div>
                    <Label className="text-base">تفعيل الإشعارات</Label>
                    <p className="text-sm text-text-secondary">إشعارات الكتب الجديدة والتحديثات</p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">مؤقت النوم</Label>
                  <p className="text-sm text-text-secondary">إيقاف التشغيل تلقائياً بعد فترة</p>
                </div>
                <Switch
                  checked={settings.sleepTimer}
                  onCheckedChange={(checked) => handleSettingChange('sleepTimer', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Account & Data */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">الحساب والبيانات</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">البريد الإلكتروني</Label>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <Button
                variant="outline"
                onClick={handleClearCache}
                className="w-full justify-start"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                مسح التخزين المؤقت
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(true)}
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                تسجيل الخروج
              </Button>

              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full justify-start"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                حذف الحساب
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف حسابك وجميع بياناتك نهائياً. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف الحساب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تسجيل الخروج</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في تسجيل الخروج؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;