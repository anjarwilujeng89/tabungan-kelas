import React from "react";
import { useMemberDetailReportQuery } from "@/hooks/useReportQueries";
import { useMembersQuery } from "@/hooks/useMemberQueries";
import { useTransactionsQuery } from "@/hooks/useTransactionQueries";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatUtils } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams();
  const { data: report, isLoading, error } = useMemberDetailReportQuery(id);
  const { data: memberData } = useMembersQuery();
  const { data: allTransactions = [] } = useTransactionsQuery();

  const member = memberData?.find((m) => m.id === id);
  const memberTransactions = allTransactions.filter((t) => t.memberId === id);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </MainLayout>
    );
  }

  if (error || !report || !member) {
    return (
      <MainLayout>
        <Alert
          variant="destructive"
          title="Error"
          description="Data anggota tidak ditemukan"
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {member.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Detail anggota dan riwayat transaksi
          </p>
        </div>

        {/* Member Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nomor Buku
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {member.bookNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kelas
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {member.className}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bergabung Sejak
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatUtils.formatDate(member.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Setoran
                </p>
                <p className="text-lg font-medium text-green-600 dark:text-green-400">
                  {formatUtils.formatCurrency(report.totalSaving)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Penarikan
                </p>
                <p className="text-lg font-medium text-red-600 dark:text-red-400">
                  {formatUtils.formatCurrency(report.totalWithdraw)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Saldo
                </p>
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  {formatUtils.formatCurrency(report.balance)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            {memberTransactions.length === 0 ? (
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
                    {memberTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              transaction.transactionType === "tabungan"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {transaction.transactionType === "tabungan"
                              ? "Setoran"
                              : "Penarikan"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                          {formatUtils.formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {formatUtils.formatDate(transaction.transactionDate)}
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
      </div>
    </MainLayout>
  );
};
