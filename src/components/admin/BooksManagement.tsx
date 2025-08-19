import { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Download, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function BooksManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category_id: '',
    description: '',
    cover_url: '',
    audio_url: '',
    duration_in_seconds: 0
  });
  
  const { books, loading, fetchBooks } = useBooks();
  const { categories } = useCategories();
  const { toast } = useToast();

  const filteredBooks = books.filter(book => {
    const matchesSearch = (book.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (book.author?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('books')
        .insert([{
          title: newBook.title,
          author: newBook.author,
          category_id: newBook.category_id ? parseInt(newBook.category_id) : null,
          description: newBook.description,
          cover_url: newBook.cover_url,
          audio_url: newBook.audio_url,
          duration_in_seconds: newBook.duration_in_seconds || null
        }]);

      if (error) throw error;

      toast({
        title: "نجح الإضافة",
        description: "تم إضافة الكتاب بنجاح"
      });

      resetForm();
      setIsAddDialogOpen(false);
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "خطأ في الإضافة",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditBook = (book: any) => {
    setEditingBook(book);
    setNewBook({
      title: book.title || '',
      author: book.author || '',
      category_id: book.category_id?.toString() || '',
      description: book.description || '',
      cover_url: book.cover_url || '',
      audio_url: book.audio_url || '',
      duration_in_seconds: book.duration_in_seconds || 0
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateBook = async () => {
    if (!editingBook || !newBook.title || !newBook.author) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('books')
        .update({
          title: newBook.title,
          author: newBook.author,
          category_id: newBook.category_id ? parseInt(newBook.category_id) : null,
          description: newBook.description,
          cover_url: newBook.cover_url,
          audio_url: newBook.audio_url,
          duration_in_seconds: newBook.duration_in_seconds || null
        })
        .eq('id', editingBook.id);

      if (error) throw error;

      toast({
        title: "نجح التحديث",
        description: "تم تحديث الكتاب بنجاح"
      });

      resetForm();
      setIsAddDialogOpen(false);
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "خطأ في التحديث",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
      try {
        const { error } = await supabase
          .from('books')
          .delete()
          .eq('id', bookId);

        if (error) throw error;

        toast({
          title: "نجح الحذف",
          description: "تم حذف الكتاب بنجاح"
        });

        fetchBooks();
      } catch (error: any) {
        toast({
          title: "خطأ في الحذف",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setNewBook({
      title: '',
      author: '',
      category_id: '',
      description: '',
      cover_url: '',
      audio_url: '',
      duration_in_seconds: 0
    });
    setEditingBook(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">إدارة الكتب</h1>
          <p className="text-text-secondary mt-1">إدارة وتنظيم مكتبة الكتب الصوتية</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="admin-button">
              <Plus className="w-4 h-4 ml-2" />
              إضافة كتاب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBook ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الكتاب *</Label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    placeholder="أدخل عنوان الكتاب"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">المؤلف *</Label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    placeholder="أدخل اسم المؤلف"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button 
                className="admin-button" 
                onClick={editingBook ? handleUpdateBook : handleAddBook}
              >
                {editingBook ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="البحث في الكتب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-secondary">
              <TableHead>الكتاب</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>المدة</TableHead>
              <TableHead>تاريخ الإضافة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  جاري تحميل الكتب...
                </TableCell>
              </TableRow>
            ) : filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  لا توجد كتب متاحة
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{book.title || 'بدون عنوان'}</p>
                      <p className="text-sm text-gray-500">{book.author || 'مؤلف غير محدد'}</p>
                    </div>
                  </TableCell>
                  <TableCell>{book.category || 'غير محددة'}</TableCell>
                  <TableCell>
                    <Badge className={book.audio_url ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {book.audio_url ? 'منشور' : 'مسودة'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {book.duration_in_seconds ? `${Math.floor(book.duration_in_seconds / 60)} دقيقة` : 'غير محدد'}
                  </TableCell>
                  <TableCell>
                    {book.created_at ? new Date(book.created_at).toLocaleDateString('ar') : 'غير محدد'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditBook(book)}>
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}