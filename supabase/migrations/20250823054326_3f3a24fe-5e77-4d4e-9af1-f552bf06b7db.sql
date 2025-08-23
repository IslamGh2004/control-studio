-- Add status column to books table
ALTER TABLE public.books 
ADD COLUMN status TEXT DEFAULT 'منشور' CHECK (status IN ('منشور', 'مسودة', 'مراجعة'));