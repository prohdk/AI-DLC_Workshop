import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCategories, getMenuItems } from '@/shared/api/menu';
import type { Category, MenuItem } from '@/types';
import Spinner from '@/shared/components/Spinner';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import CategoryTabBar from '../components/CategoryTabBar';
import MenuCard from '../components/MenuCard';
import CartBottomBar from '../components/CartBottomBar';
import { useNavigate } from 'react-router-dom';

export default function MenuPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getMenuItems()])
      .then(([catRes, itemRes]) => {
        setCategories(catRes.data);
        setItems(itemRes.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = activeCategory ? items.filter((i) => i.category_id === activeCategory && i.is_available) : items.filter((i) => i.is_available);

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 bg-white shadow-sm z-10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('menu.title')}</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/customer/orders')} className="px-3 py-1 text-sm border rounded min-h-[44px]" data-testid="menu-history-btn">
            {t('order.history')}
          </button>
          <LanguageSwitcher />
        </div>
      </header>
      <CategoryTabBar categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">{t('menu.noItems')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4">
          {filtered.map((item) => <MenuCard key={item.id} item={item} />)}
        </div>
      )}
      <CartBottomBar />
    </div>
  );
}
