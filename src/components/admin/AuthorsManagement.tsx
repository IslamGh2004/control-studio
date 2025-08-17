import { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for authors
const mockAuthors = [
  {
    id: 1,
    name: 'د. إبراهيم الفقي',
    bio: 'خبير في التنمية البشرية والبرمجة اللغوية العصبية',
    avatar: '/placeholder.svg',
    booksCount: 15,
    isActive: true,
    createdAt: '2024-01-15',
    nationality: 'مصري'
  },
  {
    id: 2,
    name: 'نجيب محفوظ',
    bio: 'أديب مصري حائز على جائزة نوبل للآداب',
    avatar: '/placeholder.svg',
    booksCount: 28,
    isActive: true,
    createdAt: '2024-01-10',
    nationality: 'مصري'
  },
  {
    id: 3,
    name: 'د. طارق السويدان',
    bio: 'باحث ومحاضر في الإدارة والقيادة',
    avatar: '/placeholder.svg',
    booksCount: 12,
    isActive: true,
    createdAt: '2024-01-08',
    nationality: 'كويتي'
  },
  {
    id: 4,
    name: 'أحمد خالد توفيق',
    bio: 'كاتب مصري متخصص في أدب الرعب والخيال العلمي',
    avatar: '/placeholder.svg',
    booksCount: 42,
    isActive: false,
    createdAt: '2024-01-05',
    nationality: 'مصري'
  },
  {
    id: 5,
    name: 'د. مصطفى محمود',
    bio: 'فيلسوف وطبيب وكاتب مصري',
    avatar: '/placeholder.svg',
    booksCount: 18,
    isActive: true,
    createdAt: '2024-01-03',
    nationality: 'مصري'
  },
];

export default function AuthorsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [authors, setAuthors] = useState(mockAuthors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    bio: '',
    nationality: '',
    isActive: true
  });

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAuthor = () => {
    if (newAuthor.name.trim()) {
      const author = {
        id: authors.length + 1,
        name: newAuthor.name,
        bio: newAuthor.bio,
        nationality: newAuthor.nationality,
        avatar: '/placeholder.svg',
        booksCount: 0,
        isActive: newAuthor.isActive,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAuthors([...authors, author]);
      setNewAuthor({ name: '', bio: '', nationality: '', isActive: true });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditAuthor = (author: any) => {
    setEditingAuthor(author);
    setNewAuthor({
      name: author.name,
      bio: author.bio,
      nationality: author.nationality,
      isActive: author.isActive
    });
  };

  const handleUpdateAuthor = () => {
    if (editingAuthor && newAuthor.name.trim()) {
      setAuthors(authors.map(auth => 
        auth.id === editingAuthor.id 
          ? { ...auth, name: newAuthor.name, bio: newAuthor.bio, nationality: newAuthor.nationality, isActive: newAuthor.isActive }
          : auth
      ));
      setEditingAuthor(null);
      setNewAuthor({ name: '', bio: '', nationality: '', isActive: true });
    }
  };

  const handleDeleteAuthor = (id: number) => {
    setAuthors(authors.filter(auth => auth.id !== id));
  };

  const resetForm = () => {
    setNewAuthor({ name: '', bio: '', nationality: '', isActive: true });
    setEditingAuthor(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">إدارة المؤلفين</h1>
          <p className="text-text-secondary mt-1">إدارة مؤلفي الكتب الصوتية</p>
        </div>
        
        <Dialog open={isAddDialogOpen || !!editingAuthor} onOpenChange={(open) => {
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
              <Plus className="ml-2 h-4 w-4" />
              إضافة مؤلف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">
                {editingAuthor ? 'تعديل المؤلف' : 'إضافة مؤلف جديد'}
              </DialogTitle>
              <DialogDescription className="text-right">
                {editingAuthor ? 'قم بتعديل بيانات المؤلف' : 'أدخل بيانات المؤلف الجديد'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-right block">اسم المؤلف</Label>
                <Input
                  id="name"
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor({...newAuthor, name: e.target.value})}
                  placeholder="أدخل اسم المؤلف"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="nationality" className="text-right block">الجنسية</Label>
                <Input
                  id="nationality"
                  value={newAuthor.nationality}
                  onChange={(e) => setNewAuthor({...newAuthor, nationality: e.target.value})}
                  placeholder="أدخل جنسية المؤلف"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="bio" className="text-right block">السيرة الذاتية</Label>
                <Textarea
                  id="bio"
                  value={newAuthor.bio}
                  onChange={(e) => setNewAuthor({...newAuthor, bio: e.target.value})}
                  placeholder="أدخل السيرة الذاتية للمؤلف"
                  className="text-right"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Switch
                  checked={newAuthor.isActive}
                  onCheckedChange={(checked) => setNewAuthor({...newAuthor, isActive: checked})}
                />
                <Label>المؤلف نشط</Label>
              </div>
            </div>
            <DialogFooter className="flex-row-reverse">
              <Button 
                onClick={editingAuthor ? handleUpdateAuthor : handleAddAuthor}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                {editingAuthor ? 'حفظ التعديلات' : 'إضافة المؤلف'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">إجمالي المؤلفين</p>
                <p className="text-2xl font-bold text-text-primary">{authors.length}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent-glow/10 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">المؤلفين النشطين</p>
                <p className="text-2xl font-bold text-text-primary">{authors.filter(a => a.isActive).length}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-accent rounded-xl flex items-center justify-center">
                <Badge className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary-glow/10 border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">إجمالي الكتب</p>
                <p className="text-2xl font-bold text-text-primary">{authors.reduce((sum, auth) => sum + auth.booksCount, 0)}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-tertiary/10 to-tertiary-glow/10 border-tertiary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">متوسط الكتب لكل مؤلف</p>
                <p className="text-2xl font-bold text-text-primary">{Math.round(authors.reduce((sum, auth) => sum + auth.booksCount, 0) / authors.length)}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-tertiary rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card className="shadow-admin">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-text-primary">قائمة المؤلفين</CardTitle>
              <CardDescription className="text-text-secondary">
                إدارة وتحرير مؤلفي الكتب الصوتية
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="البحث في المؤلفين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-secondary">
                  <TableHead className="text-right font-semibold">المؤلف</TableHead>
                  <TableHead className="text-right font-semibold">الجنسية</TableHead>
                  <TableHead className="text-right font-semibold">السيرة الذاتية</TableHead>
                  <TableHead className="text-right font-semibold">عدد الكتب</TableHead>
                  <TableHead className="text-right font-semibold">الحالة</TableHead>
                  <TableHead className="text-right font-semibold">تاريخ الإضافة</TableHead>
                  <TableHead className="text-right font-semibold">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuthors.map((author) => (
                  <TableRow key={author.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={author.avatar} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-text-primary">{author.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">{author.nationality}</TableCell>
                    <TableCell className="text-text-secondary max-w-xs truncate">{author.bio}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-primary">
                        {author.booksCount} كتاب
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={author.isActive ? "default" : "secondary"}>
                        {author.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">{author.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAuthor(author)}
                          className="h-8 w-8 p-0 hover:bg-accent/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAuthor(author.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}