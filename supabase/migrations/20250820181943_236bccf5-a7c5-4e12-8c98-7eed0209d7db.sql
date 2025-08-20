-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admins 
    WHERE user_id = check_user_id
  );
$$;

-- Fix the get_categories_with_book_count function search path
CREATE OR REPLACE FUNCTION public.get_categories_with_book_count()
RETURNS TABLE(id bigint, name text, created_at timestamp with time zone, book_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.created_at,
    COUNT(b.id) AS book_count
  FROM
    public.categories AS c
  LEFT JOIN
    public.books AS b ON c.id = b.category_id
  GROUP BY
    c.id
  ORDER BY
    c.name;
END;
$$;

-- Enable RLS on authors table (detected as missing RLS)
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Create policies for authors table
CREATE POLICY "Authors are publicly readable"
ON public.authors
FOR SELECT
TO public
USING (true);

CREATE POLICY "Only authenticated users can modify authors"
ON public.authors
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);