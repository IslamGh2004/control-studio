import { useState } from 'react';
import { Eye, EyeOff, HeadphonesIcon, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'admin123') {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم",
        });
        // Navigate to dashboard - in a real app, you'd use router
        window.location.href = '/admin';
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface shadow-admin-lg mb-4">
            <HeadphonesIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">مكتبة الصوت</h1>
          <p className="text-primary-light">لوحة تحكم المشرفين</p>
        </div>

        {/* Login Form */}
        <Card className="p-8 shadow-admin-lg border-0">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary mb-2">تسجيل الدخول</h2>
              <p className="text-text-secondary">أدخل بياناتك للوصول إلى لوحة التحكم</p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary font-medium">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 h-12 border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-primary font-medium">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10 h-12 border-border focus:border-primary"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 p-0 text-text-muted hover:text-text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-border ml-2" />
                <span className="text-text-secondary text-sm">تذكرني</span>
              </label>
              <a href="#" className="text-primary text-sm hover:text-primary-dark transition-colors">
                نسيت كلمة المرور؟
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 admin-button text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin ml-2"></div>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-surface-secondary rounded-lg border border-border">
              <p className="text-text-secondary text-sm mb-2">بيانات تجريبية:</p>
              <p className="text-text-primary text-sm"><strong>البريد:</strong> admin@example.com</p>
              <p className="text-text-primary text-sm"><strong>كلمة المرور:</strong> admin123</p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-primary-light text-sm">
            © 2024 مكتبة الصوت. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}