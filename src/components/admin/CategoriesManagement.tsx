import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Mock data for categories
const mockCategories = [
  {
    id: 1,
    name: 'التنمية البشرية',
    description: 'كتب في مجال تطوير الذات والنمو الشخصي',
    booksCount: 45,
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'الأدب العربي',
    description: 'الأعمال الأدبية العربية الكلاسيكية والمعاصرة',
    booksCount: 78,
    isActive: true,
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    name: 'العلوم والتكنولوجيا',
    description: 'كتب في مجال العلوم والابتكار التقني',
    booksCount: 32,
    isActive: true,
    createdAt: '2024-01-08'
  },
  {
    id: 4,
    name: 'التاريخ والحضارة',
    description: 'كتب تاريخية عن الحضارات والأحداث المهمة',
    booksCount: 56,
    isActive: false,
    createdAt: '2024-01-05'
  },
  {
    id: 5,
    name: 'الاقتصاد والأعمال',
    description: 'كتب في إدارة الأعمال والاقتصاد',
    booksCount: 23,
    isActive: true,
    createdAt: '2024-01-03'
  },
];

export default function CategoriesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(mockCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: categories.length + 1,
        name: newCategory.name,
        description: newCategory.description,
        booksCount: 0,
        isActive: newCategory.isActive,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '', isActive: true });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    });
  };

  const handleUpdateCategory = () => {
    if (editingCategory && newCategory.name.trim()) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: newCategory.name, description: newCategory.description, isActive: newCategory.isActive }
          : cat
      ));
      setEditingCategory(null);
      setNewCategory({ name: '', description: '', isActive: true });
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const resetForm = () => {
    setNewCategory({ name: '', description: '', isActive: true });
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">إدارة الفئات</h1>
          <p className="text-text-secondary mt-1">إدارة فئات الكتب الصوتية</p>
        </div>
        
        <Dialog open={isAddDialogOpen || !!editingCategory} onOpenChange={(open) => {
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
              إضافة فئة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">
                {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
              </DialogTitle>
              <DialogDescription className="text-right">
                {editingCategory ? 'قم بتعديل بيانات الفئة' : 'أدخل بيانات الفئة الجديدة'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-right block">اسم الفئة</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="أدخل اسم الفئة"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-right block">وصف الفئة</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="أدخل وصف الفئة"
                  className="text-right"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Switch
                  checked={newCategory.isActive}
                  onCheckedChange={(checked) => setNewCategory({...newCategory, isActive: checked})}
                />
                <Label>الفئة نشطة</Label>
              </div>
            </div>
            <DialogFooter className="flex-row-reverse">
              <Button 
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                {editingCategory ? 'حفظ التعديلات' : 'إضافة الفئة'}
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
                <p className="text-sm font-medium text-text-secondary">إجمالي الفئات</p>
                <p className="text-2xl font-bold text-text-primary">{categories.length}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent-glow/10 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">الفئات النشطة</p>
                <p className="text-2xl font-bold text-text-primary">{categories.filter(c => c.isActive).length}</p>
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
                <p className="text-2xl font-bold text-text-primary">{categories.reduce((sum, cat) => sum + cat.booksCount, 0)}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-tertiary/10 to-tertiary-glow/10 border-tertiary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">متوسط الكتب لكل فئة</p>
                <p className="text-2xl font-bold text-text-primary">{Math.round(categories.reduce((sum, cat) => sum + cat.booksCount, 0) / categories.length)}</p>
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
              <CardTitle className="text-text-primary">قائمة الفئات</CardTitle>
              <CardDescription className="text-text-secondary">
                إدارة وتحرير فئات الكتب الصوتية
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="البحث في الفئات..."
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
                  <TableHead className="text-right font-semibold">اسم الفئة</TableHead>
                  <TableHead className="text-right font-semibold">الوصف</TableHead>
                  <TableHead className="text-right font-semibold">عدد الكتب</TableHead>
                  <TableHead className="text-right font-semibold">الحالة</TableHead>
                  <TableHead className="text-right font-semibold">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right font-semibold">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <TableCell className="font-medium text-text-primary">{category.name}</TableCell>
                    <TableCell className="text-text-secondary max-w-xs truncate">{category.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-primary">
                        {category.booksCount} كتاب
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">{category.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          className="h-8 w-8 p-0 hover:bg-accent/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
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