import React from "react";
import {
  useCashPositionSummaryQuery,
  useCreateCashCategoryMutation,
  useUpdateCashCategoryMutation,
  useDeleteCashCategoryMutation,
  useCashCategoriesQuery,
} from "@/hooks/useCashPositionQueries";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Modal, ModalContent, ModalFooter } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatUtils } from "@/utils/format";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cashCategorySchema,
  CashCategoryFormData,
} from "@/utils/validationSchemas";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit2, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

export const CashPositionPage: React.FC = () => {
  const { data: summary, isLoading, error } = useCashPositionSummaryQuery();
  const { data: categories = [] } = useCashCategoriesQuery();
  const createMutation = useCreateCashCategoryMutation();
  const updateMutation = useUpdateCashCategoryMutation();
  const deleteMutation = useDeleteCashCategoryMutation();
  const { success: showSuccess, error: showError } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CashCategoryFormData>({
    resolver: zodResolver(cashCategorySchema),
  });

  const onSubmit = async (data: CashCategoryFormData) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, input: data });
        showSuccess("Kategori kas berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(data);
        showSuccess("Kategori kas berhasil ditambahkan");
      }
      setShowModal(false);
      setEditingId(null);
      reset();
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Gagal menyimpan kategori kas",
      );
    }
  };

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setValue("name", category.name);
      setValue("amount", category.amount);
      setValue("notes", category.notes);
      setEditingId(id);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      showSuccess("Kategori kas berhasil dihapus");
      setDeleteConfirm(null);
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Gagal menghapus kategori kas",
      );
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Posisi Kas
          </h1>
          <Button
            onClick={() => {
              setEditingId(null);
              reset();
              setShowModal(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>

        {error && (
          <Alert
            variant="destructive"
            title="Error"
            description="Gagal memuat data posisi kas"
          />
        )}

        {summary && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Total Kas
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatUtils.formatCurrency(summary.totalCash)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Saldo Sistem
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatUtils.formatCurrency(summary.systemBalance)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Selisih
                  </p>
                  <p
                    className={`text-2xl font-bold ${summary.isBalanced ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {formatUtils.formatCurrency(summary.difference)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Balance Status Alert */}
            {summary.isBalanced ? (
              <Alert variant="success" title="Status Seimbang">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Posisi kas sesuai dengan saldo sistem</span>
                </div>
              </Alert>
            ) : (
              <Alert variant="warning" title="Peringatan">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>
                    Terdapat selisih sebesar{" "}
                    {formatUtils.formatCurrency(Math.abs(summary.difference))}{" "}
                    antara posisi kas dan saldo sistem
                  </span>
                </div>
              </Alert>
            )}

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Kategori Kas</CardTitle>
              </CardHeader>
              <CardContent>
                {summary.categories.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      Tidak ada kategori kas
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {summary.categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </p>
                          {category.notes && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {category.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatUtils.formatCurrency(category.amount)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(category.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
            reset();
          }}
          title={editingId ? "Edit Kategori Kas" : "Tambah Kategori Kas"}
          size="md"
        >
          <ModalContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nama Kategori"
                placeholder="Contoh: Kas Tunai"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                type="number"
                label="Jumlah"
                placeholder="0"
                error={errors.amount?.message}
                {...register("amount", { valueAsNumber: true })}
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
                    setEditingId(null);
                    reset();
                  }}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  isLoading={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingId ? "Perbarui" : "Tambah"}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Hapus Kategori Kas"
          size="sm"
        >
          <ModalContent>
            <p className="text-gray-600 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus kategori kas ini?
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
