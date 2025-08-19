import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { Category } from '@/hooks/useCategories';

interface CategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <Card 
      className="stat-card group cursor-pointer hover:scale-105 transition-all duration-300"
      onClick={handleClick}
    >
      <div className="text-center">
        <div className="h-16 w-16 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="font-semibold text-text-primary mb-2">
          {category.name || 'فئة غير محددة'}
        </h3>
        
        {typeof category.book_count === 'number' && (
          <Badge variant="secondary" className="text-xs">
            {category.book_count} كتاب
          </Badge>
        )}
      </div>
    </Card>
  );
};