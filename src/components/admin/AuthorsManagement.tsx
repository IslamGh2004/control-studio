import { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, BookOpen, Loader2 } from 'lucide-react';
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
import { useAdminAuthors } from '@/hooks/useAdminAuthors';

export default function AuthorsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    biography: '',
    image_url: ''
  });

  const { authors, loading, addAuthor, updateAuthor, deleteAuthor, stats } = useAdminAuthors();

  const filteredAuthors = authors.filter(author =>
    author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.biography?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAuthor = async () => {
    if (newAuthor.name.trim()) {
      const result = await addAuthor(newAuthor);
      if (result.success) {
        setNewAuthor({ name: '', biography: '', image_url: '' });
        setIsAddDialogOpen(false);
      }
    }
  };

  const handleEditAuthor = (author: any) => {
    setEditingAuthor(author);
    setNewAuthor({
      name: author.name || '',
      biography: author.biography || '',
      image_url: author.image_url || ''
    });
  };

  const handleUpdateAuthor = async () => {
    if (editingAuthor && newAuthor.name.trim()) {
      const result = await updateAuthor(editingAuthor.id, newAuthor);
      if (result.success) {
        setEditingAuthor(null);
        setNewAuthor({ name: '', biography: '', image_url: '' });
      }
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    await deleteAuthor(id);
  };

  const resetForm = () => {
    setNewAuthor({ name: '', biography: '', image_url: '' });
    setEditingAuthor(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
                <Label htmlFor="biography" className="text-right block">السيرة الذاتية</Label>
                <Textarea
                  id="biography"
                  value={newAuthor.biography}
                  onChange={(e) => setNewAuthor({...newAuthor, biography: e.target.value})}
                  placeholder="أدخل السيرة الذاتية للمؤلف"
                  className="text-right"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="image_url" className="text-right block">رابط الصورة</Label>
                <Input
                  id="image_url"
                  value={newAuthor.image_url}
                  onChange={(e) => setNewAuthor({...newAuthor, image_url: e.target.value})}
                  placeholder="أدخل رابط صورة المؤلف"
                  className="text-right"
                />
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
                <p className="text-2xl font-bold text-text-primary">{stats.totalAuthors}</p>
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
                <p className="text-2xl font-bold text-text-primary">{stats.totalAuthors}</p>
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
                <p className="text-2xl font-bold text-text-primary">0</p>
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
                <p className="text-2xl font-bold text-text-primary">0</p>
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
                          <AvatarImage src={author.image_url || '/placeholder.svg'} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {author.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-text-primary">{author.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary max-w-xs truncate">{author.biography || 'لا توجد سيرة ذاتية'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-primary">
                        0 كتاب
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        نشط
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {author.created_at ? new Date(author.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
                    </TableCell>
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