// User/Auth Models
export interface UserSession {
  id: string;
  username: string;
  role: "admin" | "user";
  loginAt: Date;
}

// Member Models
export interface Member {
  id: string;
  name: string;
  bookNumber: string; // Nomor Buku / Absen
  className: string; // Kelas
  totalSaving: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberInput {
  name: string;
  bookNumber: string;
  className: string;
}

export interface UpdateMemberInput {
  name?: string;
  bookNumber?: string;
  className?: string;
}

// Transaction Models
export type TransactionType = "tabungan" | "pengambilan";

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  transactionType: TransactionType;
  amount: number;
  transactionDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionInput {
  memberId: string;
  transactionType: TransactionType;
  amount: number;
  transactionDate: Date;
  notes?: string;
}

export interface UpdateTransactionInput {
  transactionType?: TransactionType;
  amount?: number;
  transactionDate?: Date;
  notes?: string;
}

export interface TransactionFilter {
  fromDate?: Date;
  toDate?: Date;
  memberId?: string;
  transactionType?: TransactionType;
}

// Daily Recap Models
export interface DailyRecap {
  date: Date;
  totalSaving: number;
  totalWithdraw: number;
  net: number;
  transactionCount: number;
}

// Cash Position Models
export interface CashCategory {
  id: string;
  name: string;
  amount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCashCategoryInput {
  name: string;
  amount: number;
  notes?: string;
}

export interface UpdateCashCategoryInput {
  name?: string;
  amount?: number;
  notes?: string;
}

export interface CashPositionSummary {
  totalCash: number;
  systemBalance: number;
  difference: number;
  isBalanced: boolean;
  categories: CashCategory[];
}

// Dashboard Models
export interface DashboardSummary {
  totalSaving: number;
  totalWithdraw: number;
  totalBalance: number;
  memberCount: number;
  transactionCount: number;
  latestTransactions: Transaction[];
  dailyRecap: DailyRecap[];
}

// Backup/Restore Models
export interface BackupData {
  version: string;
  timestamp: Date;
  members: Member[];
  transactions: Transaction[];
  cashCategories: CashCategory[];
}

// API Response Models
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
