import { useState, useEffect } from 'react';
import { User, Save, Edit, BookOpen, Clock, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import UserNavigation from '@/components/UserNavigation';
import { useAuth } from '@/hooks/useAuth';
import { useBooks } from '@/hooks/useBooks';
import { useFavorites } from '@/hooks/useFavorites';
import { useListeningProgress } from '@/hooks/useListeningProgress';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  full_name: string;
  bio: string;
  phone: string;
  city: string;
  country: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { books } = useBooks();
  const { favorites } = useFavorites();
  const { progressData: progress } = useListeningProgress();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    bio: '',
    phone: '',
    city: '',
    country: ''
  });

  const handleNavigate = (page: string) => {
    console.log(`Navigate to: ${page}`);
  };

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      // For now, we'll just use mock data since profiles table doesn't exist yet
      const data = null;

      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          bio: data.bio || '',
          phone: data.phone || '',
          city: data.city || '',
          country: data.country || ''
        });
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // For now, we'll just save to localStorage since profiles table doesn't exist yet
      localStorage.setItem('user-profile', JSON.stringify(profileData));

      toast({
        title: "تم حفظ البيانات",
        description: "تم تحديث ملفك الشخصي بنجاح",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalListeningTime = progress.reduce((acc, p) => acc + (p.progress_in_seconds || 0), 0);
  const totalListeningHours = Math.round(totalListeningTime / 3600);
  const completedBooks = progress.filter(p => {
    const book = books.find(b => b.id === p.book_id);
    return book && p.progress_in_seconds >= (book.duration_in_seconds || 0);
  }).length;

  return (
    <div className="min-h-screen bg-surface">
      <UserNavigation onNavigate={handleNavigate} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">الملف الشخصي</h1>
          <p className="text-text-secondary">إدارة معلوماتك الشخصية وإحصائياتك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary">معلومات شخصية</h2>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? 'إلغاء' : 'تعديل'}
                </Button>
              </div>

              <div className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                      {profileData.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {profileData.full_name || 'لم يتم تحديد الاسم'}
                    </h3>
                    <p className="text-text-secondary">{user?.email}</p>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">الاسم الكامل</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">المدينة</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="أدخل المدينة"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">البلد</Label>
                    <Input
                      id="country"
                      value={profileData.country}
                      onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="أدخل البلد"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">نبذة شخصية</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="اكتب نبذة عن نفسك..."
                    rows={4}
                  />
                </div>

                {isEditing && (
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="w-full flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Listening Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">إحصائيات الاستماع</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{totalListeningHours}</p>
                    <p className="text-sm text-text-secondary">ساعة استماع</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-success flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{completedBooks}</p>
                    <p className="text-sm text-text-secondary">كتاب مكتمل</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500 flex items-center justify-center">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{favorites.length}</p>
                    <p className="text-sm text-text-secondary">كتاب مفضل</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">الإنجازات</h3>
              <div className="space-y-3">
                {totalListeningHours >= 10 && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-primary/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium text-text-primary">مستمع نشط</p>
                      <p className="text-sm text-text-secondary">أكثر من 10 ساعات استماع</p>
                    </div>
                  </div>
                )}

                {completedBooks >= 5 && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-success/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-text-primary">قارئ متميز</p>
                      <p className="text-sm text-text-secondary">أكمل 5 كتب أو أكثر</p>
                    </div>
                  </div>
                )}

                {favorites.length >= 10 && (
                  <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-text-primary">جامع الكتب</p>
                      <p className="text-sm text-text-secondary">10 كتب مفضلة أو أكثر</p>
                    </div>
                  </div>
                )}

                {totalListeningHours === 0 && completedBooks === 0 && favorites.length === 0 && (
                  <p className="text-text-secondary text-center py-4">
                    ابدأ بالاستماع لكسب إنجازات!
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;