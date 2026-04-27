import client from './client';
import type { Order, OrderStatus } from '@/types';

export const createOrder = (items: { menu_item_id: number; quantity: number }[]) =>
  client.post<Order>('/orders', { items });

export const getSessionOrders = () => client.get<Order[]>('/orders/session');

export const getTableOrders = (tableId: number) =>
  client.get<Order[]>(`/orders/table/${tableId}`);

export const updateOrderStatus = (orderId: number, status: OrderStatus) =>
  client.patch<Order>(`/orders/${orderId}/status`, { status });

export const deleteOrder = (orderId: number) =>
  client.delete(`/orders/${orderId}`);
