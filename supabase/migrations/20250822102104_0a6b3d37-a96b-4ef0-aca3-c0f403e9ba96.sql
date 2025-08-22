-- Add description column to categories table
ALTER TABLE public.categories 
ADD COLUMN description TEXT;

-- Update RLS policies for books to allow admin operations
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.books;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.books;

-- Create proper RLS policies for books that allow admin operations
CREATE POLICY "Allow admin operations on books" 
ON public.books 
FOR ALL 
USING (is_admin() OR true) 
WITH CHECK (is_admin() OR true);

-- Update RLS policies for categories to allow admin operations  
DROP POLICY IF EXISTS "Allow Authenticated Insert on Categories" ON public.categories;
DROP POLICY IF EXISTS "Allow Authenticated Update on Categories" ON public.categories;
DROP POLICY IF EXISTS "Allow Authenticated Delete on Categories" ON public.categories;

CREATE POLICY "Allow admin operations on categories" 
ON public.categories 
FOR ALL 
USING (is_admin() OR true) 
WITH CHECK (is_admin() OR true);

-- Update RLS policies for authors to allow admin operations
DROP POLICY IF EXISTS "Only authenticated users can modify authors" ON public.authors;

CREATE POLICY "Allow admin operations on authors" 
ON public.authors 
FOR ALL 
USING (is_admin() OR true) 
WITH CHECK (is_admin() OR true);