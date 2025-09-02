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
  Loader2,
  TrendingUp,
  Image,
  Music,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useAdminAuthors } from '@/hooks/useAdminAuthors';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import BookDetails from '@/components/BookDetails';
import { useCategories } from '@/hooks/useCategories';
import AnalyticsDialog from '@/components/admin/AnalyticsDialog';

export default function BooksManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [selectedBookDetails, setSelectedBookDetails] = useState<any>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    category_id: '',
    duration_in_seconds: 0,
    cover_url: '',
    audio_url: '',
    status: 'منشور'
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bulkBooks, setBulkBooks] = useState<Array<{
    audioFile: File;
    coverFile: File | null;
    title: string;
    author: string;
    description: string;
    category_id: string;
    status: string;
  }>>([]);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

  const { books, loading, addBook, updateBook, deleteBook, bulkUploadBooks, exportBooks, stats } = useAdminBooks();
  const { categories } = useCategories();

  const filteredBooks = books.filter(book => {
    const matchesSearch = (book.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (book.author?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || book.category_id?.toString() === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddBook = async () => {
    if (newBook.title.trim()) {
      setUploading(true);
      setUploadProgress(0);
      setIsAddDialogOpen(false);
      
      try {
        const bookData = {
          ...newBook,
          category_id: newBook.category_id ? parseInt(newBook.category_id) : null
        };
        
        setUploadProgress(30);
        const files = (coverFile && audioFile) ? { coverFile, audioFile } : undefined;
        setUploadProgress(60);
        const result = await addBook(bookData, files);
        setUploadProgress(100);
        
        if (result.success) {
          resetForm();
          setTimeout(() => setUploadProgress(0), 1000);
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
      audio_url: book.audio_url || '',
      status: book.status || 'منشور'
    });
  };

  const handleUpdateBook = async () => {
    if (editingBook && newBook.title.trim()) {
      setUploading(true);
      setUploadProgress(0);
      try {
        const bookData = {
          ...newBook,
          category_id: newBook.category_id ? parseInt(newBook.category_id) : null
        };
        
        setUploadProgress(30);
        const files: any = {};
        if (coverFile) files.coverFile = coverFile;
        if (audioFile) files.audioFile = audioFile;
        
        setUploadProgress(60);
        const result = await updateBook(editingBook.id, bookData, Object.keys(files).length > 0 ? files : undefined);
        setUploadProgress(100);
        
        if (result.success) {
          setEditingBook(null);
          resetForm();
          setTimeout(() => setUploadProgress(0), 1000);
        }
      } finally {
        setUploading(false);
      }
    }
  };

  const handleBulkFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
      
      if (audioFiles.length === 0) {
        alert('يرجى اختيار ملفات صوتية فقط');
        return;
      }

      const newBulkBooks = audioFiles.map(file => ({
        audioFile: file,
        coverFile: null,
        title: file.name.replace(/\.[^/.]+$/, ""),
        author: '',
        description: '',
        category_id: '',
        status: 'منشور'
      }));
      
      setBulkBooks(newBulkBooks);
      setIsBulkDialogOpen(true);
      event.target.value = '';
    }
  };

  const handleBulkCoverSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setBulkBooks(prev => prev.map((book, i) => 
        i === index ? { ...book, coverFile: file } : book
      ));
    }
    event.target.value = '';
  };

  const handleBulkUpload = async () => {
    setBulkUploading(true);
    setUploadProgress(0);
    setIsBulkDialogOpen(false);
    
    try {
      for (let i = 0; i < bulkBooks.length; i++) {
        const book = bulkBooks[i];
        const bookData = {
          title: book.title,
          author: book.author || 'غير محدد',
          description: book.description || 'تم رفعه بالدفعة',
          category_id: book.category_id ? parseInt(book.category_id) : null,
          status: book.status
        };
        
        const files: any = { audioFile: book.audioFile };
        if (book.coverFile) {
          files.coverFile = book.coverFile;
        }
        
        await addBook(bookData, files);
        setUploadProgress(((i + 1) / bulkBooks.length) * 100);
      }
      
      setBulkBooks([]);
      setTimeout(() => setUploadProgress(0), 1000);
    } finally {
      setBulkUploading(false);
    }
  };

  const updateBulkBook = (index: number, field: string, value: string) => {
    setBulkBooks(prev => prev.map((book, i) => 
      i === index ? { ...book, [field]: value } : book
    ));
  };

  const removeBulkBook = (index: number) => {
    setBulkBooks(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownload = async (book: any, type: 'cover' | 'audio' | 'both') => {
    try {
      if (type === 'cover' && book.cover_url) {
        const link = document.createElement('a');
        link.href = book.cover_url;
        link.download = `${book.title}_cover.jpg`;
        link.click();
      } else if (type === 'audio' && book.audio_url) {
        const link = document.createElement('a');
        link.href = book.audio_url;
        link.download = `${book.title}_audio.mp3`;
        link.click();
      } else if (type === 'both') {
        // Create a zip file with both files
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        
        if (book.cover_url) {
          try {
            const coverResponse = await fetch(book.cover_url);
            const coverBlob = await coverResponse.blob();
            zip.file(`${book.title}_cover.jpg`, coverBlob);
          } catch (e) {
            console.warn('Could not download cover image');
          }
        }
        
        if (book.audio_url) {
          try {
            const audioResponse = await fetch(book.audio_url);
            const audioBlob = await audioResponse.blob();
            zip.file(`${book.title}_audio.mp3`, audioBlob);
          } catch (e) {
            console.warn('Could not download audio file');
          }
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `${book.title}_files.zip`;
        link.click();
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('حدث خطأ في التحميل');
    }
  };

  const handleExport = async () => {
    await exportBooks();
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
      audio_url: '',
      status: 'منشور'
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
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAnalyticsOpen(true)}
            variant="outline"
            className="action-button"
          >
            <TrendingUp className="w-4 h-4 ml-2" />
            عرض التحليلات
          </Button>
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
                <div>
                  <Label htmlFor="status" className="text-right block">الحالة</Label>
                  <Select value={newBook.status} onValueChange={(value) => setNewBook({...newBook, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="منشور">منشور</SelectItem>
                      <SelectItem value="مسودة">مسودة</SelectItem>
                      <SelectItem value="مراجعة">مراجعة</SelectItem>
                    </SelectContent>
                  </Select>
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
              <p className="text-2xl font-bold text-text-primary">{filteredBooks.filter(b => b.status === 'منشور').length}</p>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="منشور">منشور</SelectItem>
                <SelectItem value="مراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="مسودة">مسودة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="file"
                multiple
                accept="audio/*"
                onChange={handleBulkFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={bulkUploading}
              />
              <Button variant="outline" className="action-button" disabled={bulkUploading}>
                {bulkUploading ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 ml-2" />
                )}
                رفع مجموعة كتب
              </Button>
            </div>
            <Button variant="outline" className="action-button" onClick={handleExport}>
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
                    {Math.floor(Math.random() * 1000)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`status-badge ${
                    book.status === 'منشور' ? 'bg-green-100 text-green-800' :
                    book.status === 'مسودة' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {book.status || 'منشور'}
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
                       <DropdownMenuItem onClick={() => setSelectedBookDetails(book)}>
                        <Eye className="w-4 h-4 ml-2" />
                        عرض التفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditBook(book)}>
                        <Edit3 className="w-4 h-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(book, 'cover')}>
                        <Image className="w-4 h-4 ml-2" />
                        تحميل الغلاف
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(book, 'audio')}>
                        <Music className="w-4 h-4 ml-2" />
                        تحميل الملف الصوتي
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(book, 'both')}>
                        <Archive className="w-4 h-4 ml-2" />
                        تحميل الكل (مضغوط)
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

      {/* Upload Progress Bar */}
      {(uploading || bulkUploading) && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {bulkUploading ? 'جاري رفع الكتب...' : 'جاري رفع الكتاب...'}
              </span>
              <span className="text-sm text-text-secondary">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">رفع مجموعة من الكتب</DialogTitle>
            <DialogDescription className="text-right">
              أدخل معلومات كل كتاب وأضف غلافه قبل الرفع
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {bulkBooks.map((book, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-text-primary">الكتاب {index + 1}</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeBulkBook(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-right block">العنوان</Label>
                    <Input
                      value={book.title}
                      onChange={(e) => updateBulkBook(index, 'title', e.target.value)}
                      className="text-right"
                      placeholder="عنوان الكتاب"
                    />
                  </div>
                  <div>
                    <Label className="text-right block">المؤلف</Label>
                    <Input
                      value={book.author}
                      onChange={(e) => updateBulkBook(index, 'author', e.target.value)}
                      className="text-right"
                      placeholder="اسم المؤلف"
                    />
                  </div>
                  <div>
                    <Label className="text-right block">الفئة</Label>
                    <Select 
                      value={book.category_id} 
                      onValueChange={(value) => updateBulkBook(index, 'category_id', value)}
                    >
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
                    <Label className="text-right block">الحالة</Label>
                    <Select 
                      value={book.status} 
                      onValueChange={(value) => updateBulkBook(index, 'status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="منشور">منشور</SelectItem>
                        <SelectItem value="مسودة">مسودة</SelectItem>
                        <SelectItem value="مراجعة">مراجعة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-right block">الوصف</Label>
                    <Textarea
                      value={book.description}
                      onChange={(e) => updateBulkBook(index, 'description', e.target.value)}
                      className="text-right"
                      placeholder="وصف الكتاب"
                      rows={2}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-right block">غلاف الكتاب</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBulkCoverSelect(index, e)}
                        className="flex-1"
                      />
                      {book.coverFile && (
                        <div className="flex items-center gap-2 text-sm text-success">
                          <Image className="w-4 h-4" />
                          تم اختيار الغلاف
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Music className="w-4 h-4" />
                    الملف الصوتي: {book.audioFile.name}
                  </div>
                  {book.coverFile && (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <Image className="w-4 h-4" />
                      الغلاف: {book.coverFile.name}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <DialogFooter className="flex-row-reverse">
            <Button 
              onClick={handleBulkUpload}
              className="bg-gradient-primary hover:bg-gradient-primary/90"
              disabled={bulkBooks.length === 0}
            >
              رفع جميع الكتب ({bulkBooks.length})
            </Button>
            <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Book Details Dialog */}
      {selectedBookDetails && (
        <BookDetails 
          book={selectedBookDetails} 
          onClose={() => setSelectedBookDetails(null)} 
        />
      )}

      {/* Analytics Dialog */}
      <AnalyticsDialog 
        open={isAnalyticsOpen} 
        onOpenChange={setIsAnalyticsOpen}
        books={books}
        categories={categories}
      />

      {/* Pagination */}
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