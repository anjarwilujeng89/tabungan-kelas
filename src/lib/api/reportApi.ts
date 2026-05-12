import {
  DashboardSummary,
  Transaction,
  DailyRecap,
  ApiResponse,
} from "@/types/models";
import { memberApi } from "./memberApi";
import { transactionApi } from "./transactionApi";
import { subDays, format } from "date-fns";

const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const reportApi = {
  async getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    await delay();

    try {
      // Get all members
      const membersRes = await memberApi.getMembers();
      if (!membersRes.success || !membersRes.data) {
        throw new Error("Failed to fetch members");
      }

      // Get all transactions
      const transactionsRes = await transactionApi.getTransactions();
      if (!transactionsRes.success || !transactionsRes.data) {
        throw new Error("Failed to fetch transactions");
      }

      const allTransactions = transactionsRes.data;

      // Calculate summary
      const totalSaving = allTransactions
        .filter((t) => t.transactionType === "tabungan")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdraw = allTransactions
        .filter((t) => t.transactionType === "pengambilan")
        .reduce((sum, t) => sum + t.amount, 0);

      // Get recent transactions (last 10)
      const latestTransactions = allTransactions.slice(0, 10);

      // Get daily recap for last 7 days
      const fromDate = subDays(new Date(), 7);
      const recapRes = await transactionApi.getDailyRecap({
        fromDate,
      });

      const dailyRecap = recapRes.success && recapRes.data ? recapRes.data : [];

      return {
        success: true,
        data: {
          totalSaving,
          totalWithdraw,
          totalBalance: totalSaving - totalWithdraw,
          memberCount: membersRes.data.length,
          transactionCount: allTransactions.length,
          latestTransactions,
          dailyRecap,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async getTransactionSummary(
    fromDate?: Date,
    toDate?: Date,
  ): Promise<
    ApiResponse<{
      totalSaving: number;
      totalWithdraw: number;
      net: number;
      transactionCount: number;
    }>
  > {
    await delay();

    try {
      const transRes = await transactionApi.getTransactions({
        fromDate,
        toDate,
      });

      if (!transRes.success || !transRes.data) {
        throw new Error("Failed to fetch transactions");
      }

      const totalSaving = transRes.data
        .filter((t) => t.transactionType === "tabungan")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdraw = transRes.data
        .filter((t) => t.transactionType === "pengambilan")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        success: true,
        data: {
          totalSaving,
          totalWithdraw,
          net: totalSaving - totalWithdraw,
          transactionCount: transRes.data.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async getMemberDetailReport(memberId: string): Promise<
    ApiResponse<{
      memberName: string;
      totalSaving: number;
      totalWithdraw: number;
      balance: number;
      transactionCount: number;
      lastTransaction?: Transaction;
    }>
  > {
    await delay();

    try {
      const memberRes = await memberApi.getMemberById(memberId);
      if (!memberRes.success || !memberRes.data) {
        throw new Error("Member not found");
      }

      const transRes = await transactionApi.getTransactions({
        memberId,
      });

      if (!transRes.success || !transRes.data) {
        throw new Error("Failed to fetch transactions");
      }

      const totalSaving = transRes.data
        .filter((t) => t.transactionType === "tabungan")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdraw = transRes.data
        .filter((t) => t.transactionType === "pengambilan")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        success: true,
        data: {
          memberName: memberRes.data.name,
          totalSaving,
          totalWithdraw,
          balance: totalSaving - totalWithdraw,
          transactionCount: transRes.data.length,
          lastTransaction: transRes.data[0],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
