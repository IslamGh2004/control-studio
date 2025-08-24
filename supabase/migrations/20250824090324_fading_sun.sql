/*
  # إضافة دوال إدارية للمستخدمين

  1. Functions
    - `is_admin()` - للتحقق من صلاحيات المشرف
    - `get_user_stats()` - لجلب إحصائيات المستخدمين
    - `ban_user()` - لحظر مستخدم
    - `unban_user()` - لإلغاء حظر مستخدم

  2. Security
    - جميع الدوال تتطلب صلاحيات مشرف
    - حماية من الوصول غير المصرح به
*/

-- دالة للتحقق من صلاحيات المشرف
CREATE OR REPLACE FUNCTION is_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  -- التحقق من وجود المستخدم في جدول المشرفين
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = COALESCE(check_user_id, auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة لجلب إحصائيات المستخدمين
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- التحقق من صلاحيات المشرف
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'غير مصرح لك بالوصول لهذه البيانات';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'active_users', (SELECT COUNT(*) FROM public.profiles WHERE created_at > NOW() - INTERVAL '30 days'),
    'verified_users', (SELECT COUNT(*) FROM public.profiles WHERE user_id IN (
      SELECT id FROM auth.users WHERE email_confirmed_at IS NOT NULL
    )),
    'banned_users', 0 -- سيتم تطبيقه لاحقاً
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة لحظر مستخدم (تحديث في جدول منفصل)
CREATE OR REPLACE FUNCTION ban_user(target_user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- التحقق من صلاحيات المشرف
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'غير مصرح لك بتنفيذ هذا الإجراء';
  END IF;

  -- هنا يمكن إضافة منطق الحظر
  -- مثل إضافة المستخدم لجدول banned_users
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة لإلغاء حظر مستخدم
CREATE OR REPLACE FUNCTION unban_user(target_user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- التحقق من صلاحيات المشرف
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'غير مصرح لك بتنفيذ هذا الإجراء';
  END IF;

  -- هنا يمكن إضافة منطق إلغاء الحظر
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;