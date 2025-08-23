import { useState } from 'react';
import { Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAdminAuthors } from '@/hooks/useAdminAuthors';

interface AuthorSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AuthorSelect({ value, onChange, placeholder = "اختر المؤلف" }: AuthorSelectProps) {
  const { authors, addAuthor } = useAdminAuthors();
  const [isNewAuthorOpen, setIsNewAuthorOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    biography: '',
    image_url: ''
  });

  const handleAddAuthor = async () => {
    if (!newAuthor.name.trim()) return;
    
    const result = await addAuthor(newAuthor);
    if (result.success) {
      onChange(newAuthor.name);
      setNewAuthor({ name: '', biography: '', image_url: '' });
      setIsNewAuthorOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>المؤلف</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.name}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {author.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={isNewAuthorOpen} onOpenChange={setIsNewAuthorOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة مؤلف جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>اسم المؤلف*</Label>
                <Input
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم المؤلف"
                />
              </div>
              <div>
                <Label>السيرة الذاتية</Label>
                <Textarea
                  value={newAuthor.biography}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, biography: e.target.value }))}
                  placeholder="أدخل السيرة الذاتية للمؤلف"
                  rows={3}
                />
              </div>
              <div>
                <Label>رابط الصورة</Label>
                <Input
                  value={newAuthor.image_url}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="أدخل رابط صورة المؤلف"
                  type="url"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAuthor} className="flex-1">
                  إضافة المؤلف
                </Button>
                <Button variant="outline" onClick={() => setIsNewAuthorOpen(false)}>
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