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
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import bookCover1 from '@/assets/book-cover-1.jpg';
import bookCover2 from '@/assets/book-cover-2.jpg';
import bookCover3 from '@/assets/book-cover-3.jpg';

const books = [
  {
    id: 1,
    title: 'أسرار التطوير الشخصي',
    author: 'د. محمد العربي',
    category: 'التنمية البشرية',
    cover: bookCover1,
    downloads: 1234,
    duration: '4 ساعات 30 دقيقة',
    status: 'منشور',
    dateAdded: '2024-01-15',
    size: '125 MB'
  },
  {
    id: 2,
    title: 'تاريخ الحضارة الإسلامية',
    author: 'أ. فاطمة حسن',
    category: 'التاريخ',
    cover: bookCover2,
    downloads: 987,
    duration: '6 ساعات 15 دقيقة',
    status: 'منشور',
    dateAdded: '2024-01-10',
    size: '178 MB'
  },
  {
    id: 3,
    title: 'قصص من التراث',
    author: 'أحمد الكاتب',
    category: 'الأدب',
    cover: bookCover3,
    downloads: 756,
    duration: '3 ساعات 45 دقيقة',
    status: 'مراجعة',
    dateAdded: '2024-01-08',
    size: '98 MB'
  },
  {
    id: 4,
    title: 'فن الإدارة الحديثة',
    author: 'سارة محمود',
    category: 'الأعمال',
    cover: bookCover1,
    downloads: 543,
    duration: '5 ساعات 20 دقيقة',
    status: 'منشور',
    dateAdded: '2024-01-05',
    size: '143 MB'
  },
  {
    id: 5,
    title: 'رحلة في عالم البرمجة',
    author: 'عبدالله التقني',
    category: 'التكنولوجيا',
    cover: bookCover2,
    downloads: 432,
    duration: '7 ساعات 10 دقيقة',
    status: 'مسودة',
    dateAdded: '2024-01-03',
    size: '201 MB'
  }
];

export default function BooksManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'منشور': return 'status-active';
      case 'مراجعة': return 'status-inactive';
      case 'مسودة': return 'status-blocked';
      default: return 'status-inactive';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">إدارة الكتب</h1>
          <p className="text-text-secondary mt-1">إدارة وتنظيم مكتبة الكتب الصوتية</p>
        </div>
        <Button className="admin-button">
          <Plus className="w-4 h-4 ml-2" />
          إضافة كتاب جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">إجمالي الكتب</p>
              <p className="text-2xl font-bold text-text-primary">1,247</p>
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
              <p className="text-2xl font-bold text-text-primary">987</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-success flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">قيد المراجعة</p>
              <p className="text-2xl font-bold text-text-primary">156</p>
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
              <p className="text-2xl font-bold text-text-primary">45.2K</p>
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
                      src={book.cover} 
                      alt={book.title}
                      className="w-12 h-16 rounded-lg object-cover shadow-admin"
                    />
                    <div>
                      <div className="font-semibold text-text-primary">{book.title}</div>
                      <div className="text-text-muted text-sm">{book.size}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary">{book.author}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary-light text-primary border-primary/20">
                    {book.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary">{book.duration}</TableCell>
                <TableCell>
                  <div className="flex items-center text-text-secondary">
                    <Download className="w-4 h-4 ml-1" />
                    {book.downloads.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusVariant(book.status)} status-badge`}>
                    {book.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary">{book.dateAdded}</TableCell>
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
                      <DropdownMenuItem>
                        <Edit3 className="w-4 h-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 ml-2" />
                        تحميل الملف
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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