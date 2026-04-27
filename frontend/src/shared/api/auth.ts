import client from './client';

export const adminLogin = (storeIdentifier: string, username: string, password: string) =>
  client.post<{ access_token: string }>('/auth/admin/login', {
    store_identifier: storeIdentifier, username, password,
  });

export const tableLogin = (storeIdentifier: string, tableNumber: number, password: string) =>
  client.post<{ access_token: string }>('/auth/table/login', {
    store_identifier: storeIdentifier, table_number: tableNumber, password,
  });
