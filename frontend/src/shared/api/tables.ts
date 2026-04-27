import client from './client';
import type { Table, TableSummary, OrderHistory } from '@/types';

export const getTables = () => client.get<Table[]>('/tables');

export const setupTable = (tableNumber: number, password: string) =>
  client.post<Table>('/tables', { table_number: tableNumber, password });

export const getTableSummary = (tableId: number) =>
  client.get<TableSummary>(`/tables/${tableId}/summary`);

export const completeSession = (tableId: number) =>
  client.post(`/tables/${tableId}/complete`);

export const getOrderHistory = (tableId: number, dateFilter?: string) =>
  client.get<OrderHistory[]>(`/tables/${tableId}/history`, {
    params: dateFilter ? { date_filter: dateFilter } : {},
  });
