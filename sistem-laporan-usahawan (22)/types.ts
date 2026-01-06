
export type Category = 'Usahawan' | 'Agromakanan' | 'Agro TS';

export interface Report {
  id: string;
  month: string;
  year: string;
  pppkName: string;
  category: Category;
  entrepreneurName: string;
  debit: number;
  credit: number;
  netIncome: number;
  documentUrl?: string;
  submittedAt: string;
}

export type UserRole = 'USER' | 'ADMIN';

export interface UserSession {
  role: UserRole;
  pppkName?: string;
}
