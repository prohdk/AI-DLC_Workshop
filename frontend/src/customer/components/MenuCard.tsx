import { useTranslation } from 'react-i18next';
import { useCart } from '@/shared/contexts/CartContext';
import type { MenuItem } from '@/types';

export default function MenuCard({ item }: { item: MenuItem }) {
  const { t } = useTranslation();
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" data-testid={`menu-card-${item.id}`}>
      {item.image_url && (
        <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover" />
      )}
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{item.name}</h3>
        {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-blue-600">{item.price.toLocaleString()}원</span>
          <button
            onClick={() => addItem({ menuItemId: item.id, name: item.name, price: item.price })}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm min-h-[44px] min-w-[44px]"
            data-testid={`menu-card-add-${item.id}`}
          >
            {t('menu.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
