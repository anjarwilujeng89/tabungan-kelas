import { useQuery } from "@tanstack/react-query";
import { reportApi } from "@/lib/api/reportApi";
import { DashboardSummary } from "@/types/models";

export const DASHBOARD_SUMMARY_QUERY_KEY = ["dashboardSummary"];
export const TRANSACTION_SUMMARY_QUERY_KEY = ["transactionSummary"];
export const MEMBER_DETAIL_REPORT_QUERY_KEY = ["memberDetailReport"];

export const useDashboardSummaryQuery = () => {
  return useQuery({
    queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
    queryFn: async () => {
      const response = await reportApi.getDashboardSummary();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useTransactionSummaryQuery = (fromDate?: Date, toDate?: Date) => {
  return useQuery({
    queryKey: [
      TRANSACTION_SUMMARY_QUERY_KEY,
      fromDate?.toISOString(),
      toDate?.toISOString(),
    ],
    queryFn: async () => {
      const response = await reportApi.getTransactionSummary(fromDate, toDate);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useMemberDetailReportQuery = (memberId: string | undefined) => {
  return useQuery({
    queryKey: [MEMBER_DETAIL_REPORT_QUERY_KEY, memberId],
    queryFn: async () => {
      if (!memberId) return null;
      const response = await reportApi.getMemberDetailReport(memberId);
      if (!response.success) throw new Error(response.error);
      return response.data || null;
    },
    enabled: !!memberId,
  });
};
