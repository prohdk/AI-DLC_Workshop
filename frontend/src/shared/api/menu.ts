import client from './client';
import type { Category, MenuItem } from '@/types';

export const getCategories = () => client.get<Category[]>('/menu/categories');
export const getAdminCategories = () => client.get<Category[]>('/menu/admin/categories');
export const createCategory = (data: { name: string; display_order: number }) =>
  client.post<Category>('/menu/admin/categories', data);
export const updateCategory = (id: number, data: Partial<Category>) =>
  client.patch<Category>(`/menu/admin/categories/${id}`, data);
export const deleteCategory = (id: number) =>
  client.delete(`/menu/admin/categories/${id}`);

export const getMenuItems = (categoryId?: number) =>
  client.get<MenuItem[]>('/menu/items', { params: categoryId ? { category_id: categoryId } : {} });
export const getAdminMenuItems = (categoryId?: number) =>
  client.get<MenuItem[]>('/menu/admin/items', { params: categoryId ? { category_id: categoryId } : {} });
export const createMenuItem = (data: Partial<MenuItem>) =>
  client.post<MenuItem>('/menu/admin/items', data);
export const updateMenuItem = (id: number, data: Partial<MenuItem>) =>
  client.patch<MenuItem>(`/menu/admin/items/${id}`, data);
export const deleteMenuItem = (id: number) =>
  client.delete(`/menu/admin/items/${id}`);
export const reorderMenuItems = (items: { menu_item_id: number; display_order: number }[]) =>
  client.put('/menu/admin/items/order', items);
