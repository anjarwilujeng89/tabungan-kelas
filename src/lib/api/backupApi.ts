import {
  BackupData,
  Member,
  Transaction,
  CashCategory,
  ApiResponse,
} from "@/types/models";
import { memberApi } from "./memberApi";
import { transactionApi } from "./transactionApi";
import { cashPositionApi } from "./cashPositionApi";

const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const BACKUP_VERSION = "1.0.0";

export const backupApi = {
  async createBackup(): Promise<ApiResponse<string>> {
    await delay();

    try {
      // Get all data
      const membersRes = await memberApi.getMembers();
      const transactionsRes = await transactionApi.getTransactions();
      const cashRes = await cashPositionApi.getCashCategories();

      if (!membersRes.success || !transactionsRes.success || !cashRes.success) {
        throw new Error("Failed to retrieve all data for backup");
      }

      const backupData: BackupData = {
        version: BACKUP_VERSION,
        timestamp: new Date(),
        members: membersRes.data || [],
        transactions: transactionsRes.data || [],
        cashCategories: cashRes.data || [],
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      return {
        success: true,
        data: jsonString,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async restoreBackup(jsonString: string): Promise<ApiResponse<void>> {
    await delay();

    try {
      const backupData: BackupData = JSON.parse(jsonString);

      // Validate version
      if (backupData.version !== BACKUP_VERSION) {
        throw new Error(
          `Backup version ${backupData.version} is not compatible with ${BACKUP_VERSION}`,
        );
      }

      // Validate required fields
      if (
        !Array.isArray(backupData.members) ||
        !Array.isArray(backupData.transactions) ||
        !Array.isArray(backupData.cashCategories)
      ) {
        throw new Error("Invalid backup format");
      }

      // Restore data by calling internal methods
      // Note: In a real app, you'd have a transaction-based restore
      // For now, we're using the mock data setters

      // @ts-ignore - accessing private methods
      memberApi._setMockData?.(backupData.members);
      // @ts-ignore - accessing private methods
      transactionApi._setMockData?.(backupData.transactions);
      // @ts-ignore - accessing private methods
      cashPositionApi._setMockData?.(backupData.cashCategories);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  validateBackupJson(jsonString: string): { valid: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);

      if (!data.version || !data.timestamp) {
        return { valid: false, error: "Missing version or timestamp" };
      }

      if (
        !Array.isArray(data.members) ||
        !Array.isArray(data.transactions) ||
        !Array.isArray(data.cashCategories)
      ) {
        return { valid: false, error: "Invalid data structure" };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  },
};
