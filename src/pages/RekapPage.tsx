import React, { useState } from "react";
import { useDailyRecapQuery } from "@/hooks/useTransactionQueries";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatUtils } from "@/utils/format";
import { csvExportUtils } from "@/utils/csvExport";
import { Download } from "lucide-react";

export const RekapPage: React.FC = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data: dailyRecaps = [], isLoading } = useDailyRecapQuery({
    fromDate: fromDate ? new Date(fromDate) : undefined,
    toDate: toDate ? new Date(toDate) : undefined,
  });

  const handleExport = () => {
    const exportData = dailyRecaps.map((recap) => ({
      date: formatUtils.formatDate(recap.date),
      totalSaving: recap.totalSaving,
      totalWithdraw: recap.totalWithdraw,
      net: recap.net,
    }));
    csvExportUtils.exportTransactionsSummaryToCSV(exportData);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
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
              Rekap Harian
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

        <Card>
          <CardContent className="pt-6">
            {dailyRecaps.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Tidak ada data
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                        Setoran
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                        Penarikan
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                        Net
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">
                        Jumlah Transaksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyRecaps.map((recap) => (
                      <tr
                        key={recap.date.toISOString()}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {formatUtils.formatDate(recap.date)}
                        </td>
                        <td className="px-4 py-3 text-right text-green-600 dark:text-green-400 font-medium">
                          +{formatUtils.formatCurrency(recap.totalSaving)}
                        </td>
                        <td className="px-4 py-3 text-right text-red-600 dark:text-red-400 font-medium">
                          -{formatUtils.formatCurrency(recap.totalWithdraw)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                          {formatUtils.formatCurrency(recap.net)}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                          {recap.transactionCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
