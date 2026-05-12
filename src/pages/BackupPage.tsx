import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useToast } from "@/components/ui/Toast";
import { formatUtils } from "@/utils/format";
import { backupApi } from "@/lib/api/backupApi";
import { Download } from "lucide-react";
import { useMembersQuery } from "@/hooks/useMemberQueries";
import { useTransactionsQuery } from "@/hooks/useTransactionQueries";
import { useCashCategoriesQuery } from "@/hooks/useCashPositionQueries";

export const BackupPage: React.FC = () => {
  const { data: members = [] } = useMembersQuery();
  const { data: transactions = [] } = useTransactionsQuery();
  const { data: cashCategories = [] } = useCashCategoriesQuery();
  const { success: showSuccess, error: showError } = useToast();
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreateBackup = async () => {
    try {
      setIsCreating(true);
      const response = await backupApi.createBackup();
      if (!response.success || !response.data) {
        throw new Error("Failed to create backup");
      }

      // Download backup file
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        `data:application/json;charset=utf-8,${encodeURIComponent(response.data)}`,
      );
      element.setAttribute(
        "download",
        `backup-${formatUtils.formatDate(new Date(), "yyyy-MM-dd-HHmmss")}.json`,
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      showSuccess("Backup berhasil dibuat");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Gagal membuat backup");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Backup Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Unduh seluruh data aplikasi sebagai file JSON untuk keamanan
          </p>
        </div>

        <Alert variant="info" title="Informasi">
          <p>
            Backup akan mencakup semua anggota, transaksi, dan kategori kas.
            Simpan file ini di lokasi yang aman.
          </p>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Total Anggota
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {members.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Total Transaksi
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {transactions.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Kategori Kas
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {cashCategories.length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buat Backup</CardTitle>
            <CardDescription>
              Klik tombol di bawah untuk membuat dan mengunduh backup data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCreateBackup}
              isLoading={isCreating}
              size="lg"
              className="flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Buat dan Unduh Backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Backup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Format File
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                JSON (.json)
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Isi Backup
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                <li>Data semua anggota kelas</li>
                <li>Riwayat semua transaksi</li>
                <li>Kategori dan posisi kas</li>
                <li>Timestamp pembuatan backup</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Keamanan
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Simpan file backup di tempat yang aman dan tidak mudah diakses
                oleh orang lain
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
