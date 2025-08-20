-- Enable Row Level Security on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if current user is admin
-- This prevents recursive RLS issues
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admins 
    WHERE user_id = check_user_id
  );
$$;

-- Policy: Only admins can view admin records
CREATE POLICY "Admins can view admin records"
ON public.admins
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Policy: Only existing admins can insert new admin records
CREATE POLICY "Admins can insert admin records"
ON public.admins
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Policy: Only existing admins can delete admin records
CREATE POLICY "Admins can delete admin records"
ON public.admins
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Note: No UPDATE policy needed as admins table doesn't have updatable fields