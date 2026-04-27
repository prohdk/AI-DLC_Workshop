import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getAdminCategories, getAdminMenuItems, createCategory, deleteCategory, createMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems } from '@/shared/api/menu';
import type { Category, MenuItem } from '@/types';
import Spinner from '@/shared/components/Spinner';
import ErrorMessage from '@/shared/components/ErrorMessage';
import ConfirmModal from '@/shared/components/ConfirmModal';

function SortableItem({ item, onEdit, onDelete }: { item: MenuItem; onEdit: (i: MenuItem) => void; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded shadow p-3 flex items-center justify-between" data-testid={`sortable-item-${item.id}`}>
      <div {...attributes} {...listeners} className="cursor-grab mr-3 text-gray-400">☰</div>
      <div className="flex-1">
        <span className="font-medium">{item.name}</span>
        <span className="ml-2 text-sm text-gray-500">{item.price.toLocaleString()}원</span>
      </div>
      <div className="flex gap-1">
        <button onClick={() => onEdit(item)} className="px-2 py-1 text-sm border rounded min-h-[44px]" data-testid={`edit-item-${item.id}`}>✏️</button>
        <button onClick={() => onDelete(item.id)} className="px-2 py-1 text-sm border rounded text-red-500 min-h-[44px]" data-testid={`delete-item-${item.id}`}>🗑</button>
      </div>
    </div>
  );
}

export default function MenuManagementPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Partial<MenuItem> & { isNew?: boolean } | null>(null);

  const load = async () => {
    const [c, m] = await Promise.all([getAdminCategories(), getAdminMenuItems()]);
    setCategories(c.data); setItems(m.data); setIsLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = selectedCat ? items.filter((i) => i.category_id === selectedCat) : items;

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await createCategory({ name: newCatName, display_order: categories.length });
    setNewCatName(''); load();
  }

  async function handleDeleteCategory(id: number) {
    try { await deleteCategory(id); load(); } catch { setError(t('common.error')); }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = filtered.findIndex((i) => i.id === active.id);
    const newIdx = filtered.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(filtered, oldIdx, newIdx);
    setItems((prev) => {
      const others = prev.filter((i) => !reordered.find((r) => r.id === i.id));
      return [...others, ...reordered];
    });
    reorderMenuItems(reordered.map((i, idx) => ({ menu_item_id: i.id, display_order: idx }))).catch(() => load());
  }

  async function handleSaveItem() {
    if (!editItem) return;
    try {
      if (editItem.isNew) {
        await createMenuItem({ category_id: editItem.category_id, name: editItem.name, price: editItem.price, description: editItem.description, image_url: editItem.image_url, display_order: filtered.length });
      } else if (editItem.id) {
        await updateMenuItem(editItem.id, { name: editItem.name, price: editItem.price, description: editItem.description, image_url: editItem.image_url, is_available: editItem.is_available });
      }
      setEditItem(null); load();
    } catch { setError(t('common.error')); }
  }

  async function handleDeleteItem() {
    if (!deleteId) return;
    try { await deleteMenuItem(deleteId); setDeleteId(null); load(); } catch { setError(t('common.error')); }
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('menu.management')}</h1>
        <button onClick={() => navigate('/admin/dashboard')} className="px-3 py-1 text-sm border rounded min-h-[44px]" data-testid="back-dashboard">{t('admin.dashboard')}</button>
      </header>
      <div className="p-4 flex gap-4">
        {/* Categories sidebar */}
        <div className="w-48 space-y-2">
          <form onSubmit={handleAddCategory} className="flex gap-1">
            <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder={t('menu.categoryName')} className="flex-1 p-2 border rounded text-sm min-h-[44px]" data-testid="add-category-input" />
            <button type="submit" className="px-2 bg-blue-600 text-white rounded min-h-[44px]" data-testid="add-category-btn">+</button>
          </form>
          <button onClick={() => setSelectedCat(null)} className={`w-full text-left px-3 py-2 rounded min-h-[44px] ${!selectedCat ? 'bg-blue-100 font-medium' : 'hover:bg-gray-200'}`}>{t('menu.allCategories')}</button>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-1">
              <button onClick={() => setSelectedCat(cat.id)} className={`flex-1 text-left px-3 py-2 rounded min-h-[44px] ${selectedCat === cat.id ? 'bg-blue-100 font-medium' : 'hover:bg-gray-200'}`} data-testid={`cat-select-${cat.id}`}>{cat.name}</button>
              <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 text-sm min-h-[44px] min-w-[44px]" data-testid={`cat-delete-${cat.id}`}>✕</button>
            </div>
          ))}
        </div>
        {/* Menu items */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium">{t('menu.title')}</h2>
            <button onClick={() => setEditItem({ isNew: true, category_id: selectedCat || categories[0]?.id, name: '', price: 0, description: '', image_url: '' })}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm min-h-[44px]" data-testid="add-menu-item-btn">{t('menu.addMenuItem')}</button>
          </div>
          <ErrorMessage message={error} />
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filtered.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {filtered.map((item) => <SortableItem key={item.id} item={item} onEdit={setEditItem} onDelete={setDeleteId} />)}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      {/* Edit/Create Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 space-y-3">
            <h2 className="text-lg font-bold">{editItem.isNew ? t('menu.addMenuItem') : t('menu.editMenuItem')}</h2>
            <input value={editItem.name || ''} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} placeholder={t('menu.name')} className="w-full p-2 border rounded min-h-[44px]" data-testid="edit-item-name" />
            <input type="number" value={editItem.price ?? ''} onChange={(e) => setEditItem({ ...editItem, price: parseInt(e.target.value) || 0 })} placeholder={t('menu.price')} className="w-full p-2 border rounded min-h-[44px]" data-testid="edit-item-price" />
            <textarea value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} placeholder={t('menu.description')} className="w-full p-2 border rounded" rows={2} data-testid="edit-item-desc" />
            <input value={editItem.image_url || ''} onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })} placeholder={t('menu.imageUrl')} className="w-full p-2 border rounded min-h-[44px]" data-testid="edit-item-image" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 border rounded min-h-[44px]">{t('common.cancel')}</button>
              <button onClick={handleSaveItem} className="px-4 py-2 bg-blue-600 text-white rounded min-h-[44px]" data-testid="edit-item-save">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
      {deleteId && <ConfirmModal message={t('menu.deleteConfirm')} onConfirm={handleDeleteItem} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
