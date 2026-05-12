import React from "react";
import { useDashboardSummaryQuery } from "@/hooks/useReportQueries";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { formatUtils } from "@/utils/format";
import { TrendingUp, TrendingDown, Users, Wallet } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { data: dashboard, isLoading, error } = useDashboardSummaryQuery();

  if (isLoading) {
    return (
      <MainLayout>
        <DashboardSkeleton />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert
          variant="destructive"
          title="Error"
          description="Failed to load dashboard data"
        />
      </MainLayout>
    );
  }

  if (!dashboard) {
    return (
      <MainLayout>
        <Alert
          variant="default"
          title="No Data"
          description="Dashboard data is not available"
        />
      </MainLayout>
    );
  }

  const stats = [
    {
      title: "Total Tabungan",
      value: formatUtils.formatCurrency(dashboard.totalSaving),
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Total Pengambilan",
      value: formatUtils.formatCurrency(dashboard.totalWithdraw),
      icon: TrendingDown,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      title: "Saldo Kas",
      value: formatUtils.formatCurrency(dashboard.totalBalance),
      icon: Wallet,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Jumlah Anggota",
      value: dashboard.memberCount.toString(),
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Selamat datang di aplikasi manajemen tabungan kelas
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>
              {dashboard.latestTransactions.length} transaksi terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard.latestTransactions.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Belum ada transaksi
              </p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.latestTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
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
                          {formatUtils.formatDate(transaction.transactionDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Recap */}
        {dashboard.dailyRecap.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Rekap 7 Hari Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
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
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.dailyRecap.map((recap) => (
                      <tr
                        key={recap.date.toISOString()}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
