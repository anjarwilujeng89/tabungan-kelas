import React, { useState } from "react";
import {
  useMembersQuery,
  useCreateMemberMutation,
  useDeleteMemberMutation,
} from "@/hooks/useMemberQueries";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Modal, ModalContent, ModalFooter } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberSchema, MemberFormData } from "@/utils/validationSchemas";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MembersPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: members, isLoading, error } = useMembersQuery();
  const createMutation = useCreateMemberMutation();
  const deleteMutation = useDeleteMemberMutation();
  const { success: showSuccess, error: showError } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  const filteredMembers =
    members?.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.bookNumber.includes(searchQuery),
    ) || [];

  const onSubmit = async (data: MemberFormData) => {
    try {
      await createMutation.mutateAsync(data);
      showSuccess("Anggota berhasil ditambahkan");
      setShowModal(false);
      reset();
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Gagal menambahkan anggota",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      showSuccess("Anggota berhasil dihapus");
      setDeleteConfirm(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Gagal menghapus anggota");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
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
              Anggota
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Total {members?.length || 0} anggota
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Anggota
          </Button>
        </div>

        {error && (
          <Alert
            variant="destructive"
            title="Error"
            description="Gagal memuat data anggota"
          />
        )}

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Cari berdasarkan nama atau nomor buku..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
        </div>

        {/* Members Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Tidak ada anggota
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                        Nama
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                        No Buku
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                        Kelas
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                          {member.name}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{member.bookNumber}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {member.className}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/members/${member.id}`)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm(member.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Member Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            reset();
          }}
          title="Tambah Anggota Baru"
          size="md"
        >
          <ModalContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama..."
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Nomor Buku / Absen"
                placeholder="Masukkan nomor buku..."
                error={errors.bookNumber?.message}
                {...register("bookNumber")}
              />

              <Input
                label="Kelas"
                placeholder="Contoh: X-A"
                error={errors.className?.message}
                {...register("className")}
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
          title="Hapus Anggota"
          size="sm"
        >
          <ModalContent>
            <p className="text-gray-600 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak
              dapat dibatalkan.
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
