import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cashPositionApi } from "@/lib/api/cashPositionApi";
import {
  CashCategory,
  CreateCashCategoryInput,
  UpdateCashCategoryInput,
} from "@/types/models";

export const CASH_CATEGORIES_QUERY_KEY = ["cashCategories"];
export const CASH_POSITION_SUMMARY_QUERY_KEY = ["cashPositionSummary"];

export const useCashCategoriesQuery = () => {
  return useQuery({
    queryKey: CASH_CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const response = await cashPositionApi.getCashCategories();
      if (!response.success) throw new Error(response.error);
      return response.data || [];
    },
  });
};

export const useCashCategoryQuery = (categoryId: string | undefined) => {
  return useQuery({
    queryKey: ["cashCategory", categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      const response = await cashPositionApi.getCashCategoryById(categoryId);
      if (!response.success) throw new Error(response.error);
      return response.data || null;
    },
    enabled: !!categoryId,
  });
};

export const useCashPositionSummaryQuery = () => {
  return useQuery({
    queryKey: CASH_POSITION_SUMMARY_QUERY_KEY,
    queryFn: async () => {
      const response = await cashPositionApi.getCashPositionSummary();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useCreateCashCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCashCategoryInput) => {
      const response = await cashPositionApi.createCashCategory(input);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: CASH_POSITION_SUMMARY_QUERY_KEY,
      });
    },
  });
};

export const useUpdateCashCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateCashCategoryInput;
    }) => {
      const response = await cashPositionApi.updateCashCategory(id, input);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: CASH_POSITION_SUMMARY_QUERY_KEY,
      });
    },
  });
};

export const useDeleteCashCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await cashPositionApi.deleteCashCategory(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: CASH_POSITION_SUMMARY_QUERY_KEY,
      });
    },
  });
};
