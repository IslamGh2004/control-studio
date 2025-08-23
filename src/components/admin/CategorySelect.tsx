import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAdminCategories } from '@/hooks/useAdminCategories';

interface CategorySelectProps {
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
}

export default function CategorySelect({ value, onChange, placeholder = "اختر الفئة" }: CategorySelectProps) {
  const { categories, addCategory } = useAdminCategories();
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    
    const result = await addCategory(newCategory);
    if (result.success && result.data) {
      onChange(result.data.id);
      setNewCategory({ name: '', description: '' });
      setIsNewCategoryOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>الفئة</Label>
      <div className="flex gap-2">
        <Select value={value?.toString()} onValueChange={(val) => onChange(parseInt(val))}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة فئة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>اسم الفئة*</Label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم الفئة"
                />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل وصف الفئة"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCategory} className="flex-1">
                  إضافة الفئة
                </Button>
                <Button variant="outline" onClick={() => setIsNewCategoryOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}