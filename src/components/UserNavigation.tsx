import { HeadphonesIcon, User, LogOut, Settings, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserNavigationProps {
  onNavigate?: (page: string) => void;
}

const UserNavigation = ({ onNavigate }: UserNavigationProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate?.('library')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    مكتبتي
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('favorites')}>
                    <Heart className="mr-2 h-4 w-4" />
                    المفضلة
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    الملف الشخصي
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    الإعدادات
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" className="action-button" asChild>
                  <a href="/auth">تسجيل الدخول</a>
                </Button>
                <Button asChild className="admin-button">
                  <a href="/admin/login">لوحة التحكم</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavigation;