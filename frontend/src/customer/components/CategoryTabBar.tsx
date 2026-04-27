import { useTranslation } from 'react-i18next';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  activeCategory: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryTabBar({ categories, activeCategory, onSelect }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b" data-testid="category-tab-bar">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] text-sm font-medium ${activeCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
        data-testid="category-tab-all"
      >
        {t('menu.allCategories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] text-sm font-medium ${activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          data-testid={`category-tab-${cat.id}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
