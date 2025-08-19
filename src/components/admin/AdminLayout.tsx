import { useState } from 'react';
import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FolderOpen, 
  Users, 
  UserCog, 
  Bell, 
  Settings, 
  HeadphonesIcon,
  FileText,
  MessageSquare,
  Activity,
  LogOut,
  Search,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const navigation = [
  { name: 'لوحة الإحصائيات', href: '/admin', icon: LayoutDashboard },
  { name: 'إدارة الكتب', href: '/admin/books', icon: BookOpen },
  { name: 'إدارة الفئات', href: '/admin/categories', icon: FolderOpen },
  { name: 'إدارة المؤلفين', href: '/admin/authors', icon: HeadphonesIcon },
  { name: 'إدارة المستخدمين', href: '/admin/users', icon: Users },
  { name: 'إدارة المشرفين', href: '/admin/admins', icon: UserCog },
  { name: 'الإشعارات', href: '/admin/notifications', icon: Bell },
  { name: 'إدارة المحتوى', href: '/admin/cms', icon: FileText },
  { name: 'الدعم الفني', href: '/admin/support', icon: MessageSquare },
  { name: 'سجل النشاطات', href: '/admin/activity', icon: Activity },
  { name: 'إعدادات النظام', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, loading, adminSignOut, user } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-text-primary">جاري التحقق من الصلاحيات...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-64 bg-sidebar border-l border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                <HeadphonesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">مكتبة الصوت</h2>
                <p className="text-xs text-sidebar-foreground/70">لوحة التحكم</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="px-6 py-4 border-b border-sidebar-border">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-sidebar-accent rounded-lg p-3">
                <div className="text-lg font-bold text-sidebar-primary">1,247</div>
                <div className="text-xs text-sidebar-foreground/70">كتاب</div>
              </div>
              <div className="bg-sidebar-accent rounded-lg p-3">
                <div className="text-lg font-bold text-sidebar-primary">5,832</div>
                <div className="text-xs text-sidebar-foreground/70">مستخدم</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="ml-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                  {item.name === 'الإشعارات' && (
                    <Badge className="mr-auto bg-destructive text-destructive-foreground">
                      3
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={adminSignOut}
            >
              <LogOut className="ml-3 h-5 w-5" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:mr-64">
        {/* Top bar */}
        <header className="bg-surface border-b border-border h-16 flex items-center justify-between px-6 shadow-admin-sm">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="البحث في لوحة التحكم..."
                className="w-80 pr-10 bg-surface-secondary border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* Admin Profile */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">
                  {user?.email?.split('@')[0] || 'مشرف النظام'}
                </div>
                <div className="text-xs text-text-secondary">مدير النظام</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'M'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}