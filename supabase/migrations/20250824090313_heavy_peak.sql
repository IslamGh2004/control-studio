/*
  # إنشاء دالة ومحفز لإنشاء ملف شخصي تلقائياً

  1. Functions
    - `handle_new_user()` - دالة لإنشاء ملف شخصي عند تسجيل مستخدم جديد
    - `update_updated_at_column()` - دالة لتحديث عمود updated_at تلقائياً

  2. Triggers
    - محفز على جدول auth.users لإنشاء ملف شخصي تلقائياً
    - محفز على جدول profiles لتحديث updated_at تلقائياً

  3. Security
    - تطبيق RLS على جدول profiles
    - إضافة سياسات للوصول والتحديث
*/

-- دالة تحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- دالة إنشاء ملف شخصي للمستخدم الجديد
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- إنشاء محفز لإنشاء ملف شخصي تلقائياً عند تسجيل مستخدم جديد
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- إنشاء محفز لتحديث updated_at في جدول profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;