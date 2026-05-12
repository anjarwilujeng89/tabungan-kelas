import {
  CashCategory,
  CreateCashCategoryInput,
  UpdateCashCategoryInput,
  CashPositionSummary,
  ApiResponse,
} from "@/types/models";
import { transactionApi } from "./transactionApi";

const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock database
let cashCategories: CashCategory[] = [
  {
    id: "cash-1",
    name: "Kas Tunai",
    amount: 2000000,
    notes: "Uang tunai di brankas",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cash-2",
    name: "Deposito",
    amount: 5000000,
    notes: "Tabungan di bank",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const cashPositionApi = {
  async getCashCategories(): Promise<ApiResponse<CashCategory[]>> {
    await delay();
    return {
      success: true,
      data: [...cashCategories],
    };
  },

  async getCashCategoryById(id: string): Promise<ApiResponse<CashCategory>> {
    await delay();
    const category = cashCategories.find((c) => c.id === id);

    if (!category) {
      return {
        success: false,
        error: "Cash category not found",
      };
    }

    return {
      success: true,
      data: category,
    };
  },

  async createCashCategory(
    input: CreateCashCategoryInput,
  ): Promise<ApiResponse<CashCategory>> {
    await delay();

    const newCategory: CashCategory = {
      id: "cash-" + Date.now(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    cashCategories.push(newCategory);
    return {
      success: true,
      data: newCategory,
    };
  },

  async updateCashCategory(
    id: string,
    input: UpdateCashCategoryInput,
  ): Promise<ApiResponse<CashCategory>> {
    await delay();

    const categoryIndex = cashCategories.findIndex((c) => c.id === id);
    if (categoryIndex === -1) {
      return {
        success: false,
        error: "Cash category not found",
      };
    }

    cashCategories[categoryIndex] = {
      ...cashCategories[categoryIndex],
      ...input,
      updatedAt: new Date(),
    };

    return {
      success: true,
      data: cashCategories[categoryIndex],
    };
  },

  async deleteCashCategory(id: string): Promise<ApiResponse<void>> {
    await delay();

    const index = cashCategories.findIndex((c) => c.id === id);
    if (index === -1) {
      return {
        success: false,
        error: "Cash category not found",
      };
    }

    cashCategories.splice(index, 1);
    return {
      success: true,
    };
  },

  async getCashPositionSummary(): Promise<ApiResponse<CashPositionSummary>> {
    await delay();

    // Calculate total cash from categories
    const totalCash = cashCategories.reduce((sum, cat) => sum + cat.amount, 0);

    // Get all transactions
    const transRes = await transactionApi.getTransactions();
    if (!transRes.success || !transRes.data) {
      return {
        success: false,
        error: "Failed to calculate system balance",
      };
    }

    // Calculate system balance
    const systemBalance = transRes.data.reduce((sum, trx) => {
      if (trx.transactionType === "tabungan") {
        return sum + trx.amount;
      } else {
        return sum - trx.amount;
      }
    }, 0);

    const difference = totalCash - systemBalance;
    const isBalanced = Math.abs(difference) < 1; // Allow 1 unit difference due to rounding

    return {
      success: true,
      data: {
        totalCash,
        systemBalance,
        difference,
        isBalanced,
        categories: [...cashCategories],
      },
    };
  },

  // For backup/restore
  _getMockData() {
    return {
      cashCategories: [...cashCategories],
    };
  },

  _setMockData(data: CashCategory[]) {
    cashCategories = [...data];
  },
};
