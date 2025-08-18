import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeadphonesIcon, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, resetPassword, user, loading } = useAuth();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Handle password reset flow
  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setActiveTab('reset');
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (!error) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password);
    
    if (!error) {
      setActiveTab('signin');
    }
    
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await resetPassword(email);
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <HeadphonesIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">مكتبة الصوت</h1>
          </div>
          <p className="text-primary-light">منصة الكتب الصوتية العربية</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-text-primary">
              مرحباً بك
            </CardTitle>
            <CardDescription className="text-center text-text-secondary">
              سجل دخولك للوصول إلى مكتبتك الصوتية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signin">دخول</TabsTrigger>
                <TabsTrigger value="signup">تسجيل</TabsTrigger>
                <TabsTrigger value="reset">استرداد</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">البريد الإلكتروني</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        dir="ltr"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-text-muted" />
                        ) : (
                          <Eye className="h-4 w-4 text-text-muted" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full admin-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        dir="ltr"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-text-muted" />
                        ) : (
                          <Eye className="h-4 w-4 text-text-muted" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      dir="ltr"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full admin-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              {/* Reset Password Tab */}
              <TabsContent value="reset" className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">البريد الإلكتروني</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full admin-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاسترداد'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-text-secondary hover:text-text-primary"
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;