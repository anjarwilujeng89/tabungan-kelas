import React, { useState } from "react";
import { useTransactionSummaryQuery } from "@/hooks/useReportQueries";
import { useTransactionsQuery } from "@/hooks/useTransactionQueries";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatUtils } from "@/utils/format";
import { csvExportUtils } from "@/utils/csvExport";
import { Download } from "lucide-react";

export const ReportPage: React.FC = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const parsedFromDate = fromDate ? new Date(fromDate) : undefined;
  const parsedToDate = toDate ? new Date(toDate) : undefined;

  const { data: summary, isLoading } = useTransactionSummaryQuery(
    parsedFromDate,
    parsedToDate,
  );
  const { data: allTransactions = [] } = useTransactionsQuery({
    fromDate: parsedFromDate,
    toDate: parsedToDate,
  });

  const handleExport = () => {
    csvExportUtils.exportTransactionsToCSV(
      allTransactions,
      `laporan-transaksi-${formatUtils.formatDate(new Date(), "yyyy-MM-dd")}.csv`,
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Laporan Transaksi
            </h1>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Dari Tanggal"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            type="date"
            label="Sampai Tanggal"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {summary && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Total Setoran
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatUtils.formatCurrency(summary.totalSaving)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Total Penarikan
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatUtils.formatCurrency(summary.totalWithdraw)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Net
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatUtils.formatCurrency(summary.net)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Jumlah Transaksi
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.transactionCount}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Transaksi</CardTitle>
              </CardHeader>
              <CardContent>
                {allTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      Tidak ada transaksi
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                            Anggota
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                            Tipe
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                            Jumlah
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                            Tanggal
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                            Catatan
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTransactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                              {transaction.memberName}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  transaction.transactionType === "tabungan"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                              >
                                {transaction.transactionType === "tabungan"
                                  ? "Setoran"
                                  : "Penarikan"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                              {formatUtils.formatCurrency(transaction.amount)}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              {formatUtils.formatDate(
                                transaction.transactionDate,
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              {transaction.notes || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};
