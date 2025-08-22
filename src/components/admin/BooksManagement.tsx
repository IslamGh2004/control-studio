import { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  Download,
  MoreHorizontal,
  Upload,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminBooks } from '@/hooks/useAdminBooks';
import { useCategories } from '@/hooks/useCategories';

export default function BooksManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    category_id: '',
    duration_in_seconds: 0,
    cover_url: '',
    audio_url: ''
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { books, loading, addBook, updateBook, deleteBook, stats } = useAdminBooks();
  const { categories } = useCategories();

  const filteredBooks = books.filter(book => {
    const matchesSearch = (book.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (book.author?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleAddBook = async () => {
    if (newBook.title.trim()) {
      setUploading(true);
      try {
        const bookData = {
          ...newBook,
          category_id: newBook.category_id ? parseInt(newBook.category_id) : null
        };
        
        const files = (coverFile && audioFile) ? { coverFile, audioFile } : undefined;
        const result = await addBook(bookData, files);
        
        if (result.success) {
          setNewBook({
            title: '',
            author: '',
            description: '',
            category_id: '',
            duration_in_seconds: 0,
            cover_url: '',
            audio_url: ''
          });
          setCoverFile(null);
          setAudioFile(null);
          setIsAddDialogOpen(false);
        }
      } finally {
        setUploading(false);
      }
    }
  };

  const handleEditBook = (book: any) => {
    setEditingBook(book);
    setNewBook({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      category_id: book.category_id?.toString() || '',
      duration_in_seconds: book.duration_in_seconds || 0,
      cover_url: book.cover_url || '',
      audio_url: book.audio_url || ''
    });
  };

  const handleUpdateBook = async () => {
    if (editingBook && newBook.title.trim()) {
      const result = await updateBook(editingBook.id, {
        ...newBook,
        category_id: newBook.category_id ? parseInt(newBook.category_id) : null
      });
      if (result.success) {
        setEditingBook(null);
        setNewBook({
          title: '',
          author: '',
          description: '',
          category_id: '',
          duration_in_seconds: 0,
          cover_url: '',
          audio_url: ''
        });
      }
    }
  };

  const handleDeleteBook = async (id: number) => {
    await deleteBook(id);
  };

  const resetForm = () => {
    setNewBook({
      title: '',
      author: '',
      description: '',
      category_id: '',
      duration_in_seconds: 0,
      cover_url: '',
      audio_url: ''
    });
    setCoverFile(null);
    setAudioFile(null);
    setEditingBook(null);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} ساعة ${minutes} دقيقة`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">إدارة الكتب</h1>
          <p className="text-text-secondary mt-1">إدارة وتنظيم مكتبة الكتب الصوتية</p>
        </div>
        <Dialog open={isAddDialogOpen || !!editingBook} onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-elegant"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة كتاب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right">
                {editingBook ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}
              </DialogTitle>
              <DialogDescription className="text-right">
                {editingBook ? 'قم بتعديل بيانات الكتاب' : 'أدخل بيانات الكتاب الجديد'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-right block">عنوان الكتاب</Label>
                <Input
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  placeholder="أدخل عنوان الكتاب"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="author" className="text-right block">المؤلف</Label>
                <Input
                  id="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  placeholder="أدخل اسم المؤلف"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-right block">الفئة</Label>
                <Select value={newBook.category_id} onValueChange={(value) => setNewBook({...newBook, category_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description" className="text-right block">الوصف</Label>
                <Textarea
                  id="description"
                  value={newBook.description}
                  onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                  placeholder="أدخل وصف الكتاب"
                  className="text-right"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-right block">المدة (يتم حسابها تلقائياً)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newBook.duration_in_seconds}
                  onChange={(e) => setNewBook({...newBook, duration_in_seconds: parseInt(e.target.value) || 0})}
                  placeholder="سيتم حساب المدة تلقائياً عند رفع الملف الصوتي"
                  className="text-right"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="cover_file" className="text-right block">صورة الغلاف</Label>
                <Input
                  id="cover_file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="text-right"
                />
                {coverFile && (
                  <p className="text-sm text-text-secondary mt-1">تم اختيار: {coverFile.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="audio_file" className="text-right block">الملف الصوتي</Label>
                <Input
                  id="audio_file"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="text-right"
                />
                {audioFile && (
                  <p className="text-sm text-text-secondary mt-1">تم اختيار: {audioFile.name}</p>
                )}
              </div>
            </div>
            <DialogFooter className="flex-row-reverse">
              <Button 
                onClick={editingBook ? handleUpdateBook : handleAddBook}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  editingBook ? 'حفظ التعديلات' : 'إضافة الكتاب'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
                disabled={uploading}
              >
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">إجمالي الكتب</p>
              <p className="text-2xl font-bold text-text-primary">{stats.totalBooks}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">كتب منشورة</p>
              <p className="text-2xl font-bold text-text-primary">{stats.totalBooks}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-success flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">متوسط المدة</p>
              <p className="text-2xl font-bold text-text-primary">{stats.avgDuration} دقيقة</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-warning flex items-center justify-center">
              <Filter className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">إجمالي التحميلات</p>
              <p className="text-2xl font-bold text-text-primary">{stats.totalDownloads}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="البحث في الكتب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="action-button">
                  <Filter className="w-4 h-4 ml-2" />
                  فلترة حسب الحالة
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  جميع الحالات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('منشور')}>
                  منشور
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('مراجعة')}>
                  قيد المراجعة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('مسودة')}>
                  مسودة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="action-button">
              <Upload className="w-4 h-4 ml-2" />
              رفع مجموعة كتب
            </Button>
            <Button variant="outline" className="action-button">
              <Download className="w-4 h-4 ml-2" />
              تصدير القائمة
            </Button>
          </div>
        </div>
      </Card>

      {/* Books Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-secondary">
              <TableHead className="text-right">الكتاب</TableHead>
              <TableHead className="text-right">المؤلف</TableHead>
              <TableHead className="text-right">الفئة</TableHead>
              <TableHead className="text-right">المدة</TableHead>
              <TableHead className="text-right">التحميلات</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ الإضافة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.id} className="hover:bg-card-hover transition-colors">
                <TableCell>
                   <div className="flex items-center space-x-3 space-x-reverse">
                    <img 
                      src={book.cover_url || '/placeholder.svg'} 
                      alt={book.title || 'كتاب'}
                      className="w-12 h-16 rounded-lg object-cover shadow-admin"
                    />
                    <div>
                      <div className="font-semibold text-text-primary">{book.title}</div>
                      <div className="text-text-muted text-sm">{book.duration_in_seconds ? formatDuration(book.duration_in_seconds) : 'غير محدد'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary">{book.author}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary-light text-primary border-primary/20">
                    {book.category || 'غير محدد'}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary">
                  {book.duration_in_seconds ? formatDuration(book.duration_in_seconds) : 'غير محدد'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-text-secondary">
                    <Download className="w-4 h-4 ml-1" />
                    0
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="status-badge bg-green-100 text-green-800">
                    منشور
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary">
                  {book.created_at ? new Date(book.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem>
                        <Eye className="w-4 h-4 ml-2" />
                        عرض التفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditBook(book)}>
                        <Edit3 className="w-4 h-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 ml-2" />
                        تحميل الملف
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
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination would go here */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">
          عرض {filteredBooks.length} من أصل {books.length} كتاب
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="action-button">السابق</Button>
          <Button variant="outline" size="sm" className="action-button">التالي</Button>
        </div>
      </div>
    </div>
  );
}