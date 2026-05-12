import React, { useState } from "react";
import {
  useTransactionsQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
} from "@/hooks/useTransactionQueries";
import { useMembersQuery } from "@/hooks/useMemberQueries";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { Modal, ModalContent, ModalFooter } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionSchema,
  TransactionFormData,
} from "@/utils/validationSchemas";
import { useToast } from "@/components/ui/Toast";
import { csvExportUtils } from "@/utils/csvExport";
import { formatUtils } from "@/utils/format";
import { Plus, Download, Trash2 } from "lucide-react";

export const TransactionPage: React.FC = () => {
  const { data: members = [] } = useMembersQuery();
  const { data: transactions = [], isLoading, error } = useTransactionsQuery();
  const createMutation = useCreateTransactionMutation();
  const deleteMutation = useDeleteTransactionMutation();
  const { success: showSuccess, error: showError } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionDate: new Date(),
    },
  });

  const filteredTransactions = transactions.filter((t) => {
    if (fromDate && new Date(t.transactionDate) < new Date(fromDate))
      return false;
    if (toDate && new Date(t.transactionDate) > new Date(toDate)) return false;
    return true;
  });

  const totalSaving = filteredTransactions
    .filter((t) => t.transactionType === "tabungan")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdraw = filteredTransactions
    .filter((t) => t.transactionType === "pengambilan")
    .reduce((sum, t) => sum + t.amount, 0);

  const onSubmit = async (data: TransactionFormData) => {
    try {
      await createMutation.mutateAsync(data);
      showSuccess("Transaksi berhasil ditambahkan");
      setShowModal(false);
      reset();
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Gagal menambahkan transaksi",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      showSuccess("Transaksi berhasil dihapus");
      setDeleteConfirm(null);
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Gagal menghapus transaksi",
      );
    }
  };

  const handleExport = () => {
    csvExportUtils.exportTransactionsToCSV(
      filteredTransactions,
      `transaksi-${formatUtils.formatDate(new Date(), "yyyy-MM-dd")}.csv`,
    );
    showSuccess("Data berhasil diekspor");
  };

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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Transaksi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Total {filteredTransactions.length} transaksi
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Tambah Transaksi
            </Button>
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            title="Error"
            description="Gagal memuat data transaksi"
          />
        )}

        {/* Filters */}
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

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Total Setoran
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatUtils.formatCurrency(totalSaving)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Total Penarikan
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatUtils.formatCurrency(totalWithdraw)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Net
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatUtils.formatCurrency(totalSaving - totalWithdraw)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredTransactions.length === 0 ? (
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
                      <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                          {transaction.memberName}
                        </td>
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
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Transaction Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            reset();
          }}
          title="Tambah Transaksi Baru"
          size="md"
        >
          <ModalContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Select
                label="Anggota"
                error={errors.memberId?.message}
                {...register("memberId")}
                options={members.map((m) => ({ value: m.id, label: m.name }))}
              />

              <Select
                label="Tipe Transaksi"
                error={errors.transactionType?.message}
                {...register("transactionType")}
                options={[
                  { value: "tabungan", label: "Setoran" },
                  { value: "pengambilan", label: "Penarikan" },
                ]}
              />

              <Input
                type="number"
                label="Jumlah"
                placeholder="0"
                error={errors.amount?.message}
                {...register("amount", { valueAsNumber: true })}
              />

              <Input
                type="date"
                label="Tanggal Transaksi"
                error={errors.transactionDate?.message}
                {...register("transactionDate", {
                  setValueAs: (value) => (value ? new Date(value) : new Date()),
                })}
              />

              <Input
                label="Catatan (opsional)"
                placeholder="Masukkan catatan..."
                {...register("notes")}
              />

              <ModalFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    reset();
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" isLoading={createMutation.isPending}>
                  Tambah
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Hapus Transaksi"
          size="sm"
        >
          <ModalContent>
            <p className="text-gray-600 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus transaksi ini?
            </p>
          </ModalContent>
          <ModalFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              isLoading={deleteMutation.isPending}
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Hapus
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </MainLayout>
  );
};
