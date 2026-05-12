import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
  ApiResponse,
  DailyRecap,
} from "@/types/models";
import { memberApi } from "./memberApi";
import { startOfDay, endOfDay, format } from "date-fns";

const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock database with initial data
let transactions: Transaction[] = [
  {
    id: "trx-1",
    memberId: "1",
    memberName: "Andi Wijaya",
    transactionType: "tabungan",
    amount: 100000,
    transactionDate: new Date("2024-01-15"),
    notes: "Setoran awal",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "trx-2",
    memberId: "2",
    memberName: "Siti Nurhaliza",
    transactionType: "tabungan",
    amount: 150000,
    transactionDate: new Date("2024-01-16"),
    notes: "Setoran bulanan",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "trx-3",
    memberId: "3",
    memberName: "Budi Santoso",
    transactionType: "tabungan",
    amount: 120000,
    transactionDate: new Date("2024-01-17"),
    notes: "Setoran mingguan",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "trx-4",
    memberId: "1",
    memberName: "Andi Wijaya",
    transactionType: "pengambilan",
    amount: 50000,
    transactionDate: new Date("2024-01-20"),
    notes: "Penarikan uang",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
];

export const transactionApi = {
  async getTransactions(
    filter?: TransactionFilter,
  ): Promise<ApiResponse<Transaction[]>> {
    await delay();

    let results = [...transactions];

    if (filter?.fromDate) {
      const fromDate = startOfDay(filter.fromDate);
      results = results.filter((t) => t.transactionDate >= fromDate);
    }

    if (filter?.toDate) {
      const toDate = endOfDay(filter.toDate);
      results = results.filter((t) => t.transactionDate <= toDate);
    }

    if (filter?.memberId) {
      results = results.filter((t) => t.memberId === filter.memberId);
    }

    if (filter?.transactionType) {
      results = results.filter(
        (t) => t.transactionType === filter.transactionType,
      );
    }

    return {
      success: true,
      data: results.sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime(),
      ),
    };
  },

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    await delay();
    const transaction = transactions.find((t) => t.id === id);

    if (!transaction) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    return {
      success: true,
      data: transaction,
    };
  },

  async createTransaction(
    input: CreateTransactionInput,
  ): Promise<ApiResponse<Transaction>> {
    await delay();

    // Verify member exists
    const memberRes = await memberApi.getMemberById(input.memberId);
    if (!memberRes.success || !memberRes.data) {
      return {
        success: false,
        error: "Member not found",
      };
    }

    if (input.amount <= 0) {
      return {
        success: false,
        error: "Amount must be positive",
      };
    }

    const newTransaction: Transaction = {
      id: "trx-" + Date.now(),
      memberId: input.memberId,
      memberName: memberRes.data.name,
      transactionType: input.transactionType,
      amount: input.amount,
      transactionDate: input.transactionDate,
      notes: input.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transactions.push(newTransaction);
    return {
      success: true,
      data: newTransaction,
    };
  },

  async updateTransaction(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<ApiResponse<Transaction>> {
    await delay();

    const transactionIndex = transactions.findIndex((t) => t.id === id);
    if (transactionIndex === -1) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    if (input.amount !== undefined && input.amount <= 0) {
      return {
        success: false,
        error: "Amount must be positive",
      };
    }

    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...input,
      updatedAt: new Date(),
    };

    return {
      success: true,
      data: transactions[transactionIndex],
    };
  },

  async deleteTransaction(id: string): Promise<ApiResponse<void>> {
    await delay();

    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    transactions.splice(index, 1);
    return {
      success: true,
    };
  },

  async getDailyRecap(
    filter?: TransactionFilter,
  ): Promise<ApiResponse<DailyRecap[]>> {
    await delay();

    let filteredTransactions = [...transactions];

    if (filter?.fromDate) {
      const fromDate = startOfDay(filter.fromDate);
      filteredTransactions = filteredTransactions.filter(
        (t) => t.transactionDate >= fromDate,
      );
    }

    if (filter?.toDate) {
      const toDate = endOfDay(filter.toDate);
      filteredTransactions = filteredTransactions.filter(
        (t) => t.transactionDate <= toDate,
      );
    }

    // Group by date
    const groupedByDate = new Map<string, Transaction[]>();

    filteredTransactions.forEach((trx) => {
      const dateKey = format(new Date(trx.transactionDate), "yyyy-MM-dd");
      if (!groupedByDate.has(dateKey)) {
        groupedByDate.set(dateKey, []);
      }
      groupedByDate.get(dateKey)!.push(trx);
    });

    // Calculate daily recap
    const dailyRecaps: DailyRecap[] = Array.from(groupedByDate.entries())
      .map(([dateStr, trxs]) => {
        const totalSaving = trxs
          .filter((t) => t.transactionType === "tabungan")
          .reduce((sum, t) => sum + t.amount, 0);

        const totalWithdraw = trxs
          .filter((t) => t.transactionType === "pengambilan")
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          date: new Date(dateStr),
          totalSaving,
          totalWithdraw,
          net: totalSaving - totalWithdraw,
          transactionCount: trxs.length,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      success: true,
      data: dailyRecaps,
    };
  },

  // Export mock data
  _getMockData() {
    return {
      transactions: [...transactions],
    };
  },

  // For backup/restore
  _setMockData(data: Transaction[]) {
    transactions = [...data];
  },
};
