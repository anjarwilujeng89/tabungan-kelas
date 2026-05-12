import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "@/lib/api/transactionApi";
import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
  DailyRecap,
} from "@/types/models";

export const TRANSACTIONS_QUERY_KEY = ["transactions"];
export const DAILY_RECAP_QUERY_KEY = ["dailyRecap"];

export const useTransactionsQuery = (filter?: TransactionFilter) => {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, filter],
    queryFn: async () => {
      const response = await transactionApi.getTransactions(filter);
      if (!response.success) throw new Error(response.error);
      return response.data || [];
    },
  });
};

export const useTransactionQuery = (transactionId: string | undefined) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      if (!transactionId) return null;
      const response = await transactionApi.getTransactionById(transactionId);
      if (!response.success) throw new Error(response.error);
      return response.data || null;
    },
    enabled: !!transactionId,
  });
};

export const useDailyRecapQuery = (filter?: TransactionFilter) => {
  return useQuery({
    queryKey: [DAILY_RECAP_QUERY_KEY, filter],
    queryFn: async () => {
      const response = await transactionApi.getDailyRecap(filter);
      if (!response.success) throw new Error(response.error);
      return response.data || [];
    },
  });
};

export const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTransactionInput) => {
      const response = await transactionApi.createTransaction(input);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DAILY_RECAP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });
};

export const useUpdateTransactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateTransactionInput;
    }) => {
      const response = await transactionApi.updateTransaction(id, input);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DAILY_RECAP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });
};

export const useDeleteTransactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await transactionApi.deleteTransaction(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DAILY_RECAP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });
};
