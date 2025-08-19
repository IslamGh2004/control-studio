import { CategoryCard } from './CategoryCard';
import { Category } from '@/hooks/useCategories';
import { BookOpen } from 'lucide-react';

interface CategoriesGridProps {
  categories: Category[];
  loading?: boolean;
  onCategoryClick?: (category: Category) => void;
}

export const CategoriesGrid = ({ categories, loading, onCategoryClick }: CategoriesGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-surface-secondary rounded-2xl p-6 text-center">
              <div className="h-16 w-16 bg-muted rounded-xl mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          لا توجد فئات متاحة
        </h3>
        <p className="text-text-secondary">
          لم يتم العثور على أي فئات حالياً
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={category} 
          onClick={onCategoryClick}
        />
      ))}
    </div>
  );
};