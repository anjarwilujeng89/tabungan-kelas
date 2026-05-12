import React, { useRef } from "react";
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
import { Modal, ModalContent, ModalFooter } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { backupApi } from "@/lib/api/backupApi";
import { Upload, AlertTriangle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const RestorePage: React.FC = () => {
  const { success: showSuccess, error: showError } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRestoring, setIsRestoring] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith(".json")) {
        showError("File harus berformat JSON");
        return;
      }

      setSelectedFile(file);
      setShowConfirm(true);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) return;

    try {
      setIsRestoring(true);
      const fileContent = await selectedFile.text();

      // Validate JSON before restoring
      const validation = backupApi.validateBackupJson(fileContent);
      if (!validation.valid) {
        throw new Error(validation.error || "Format backup tidak valid");
      }

      // Restore backup
      const response = await backupApi.restoreBackup(fileContent);
      if (!response.success) {
        throw new Error(response.error || "Gagal merestorasi backup");
      }

      // Invalidate all queries to refresh data
      await queryClient.invalidateQueries();

      showSuccess("Data berhasil direstorasi");
      setShowConfirm(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Gagal merestorasi backup",
      );
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Restore Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Pulihkan data aplikasi dari file backup
          </p>
        </div>

        <Alert variant="warning" title="Peringatan">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Data saat ini akan diganti</p>
              <p className="text-sm mt-1">
                Proses restore akan mengganti semua data saat ini dengan data
                dari file backup. Pastikan Anda sudah membuat backup data saat
                ini sebelum melanjutkan.
              </p>
            </div>
          </div>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Pilih File Backup</CardTitle>
            <CardDescription>
              Unggah file JSON backup yang ingin Anda restorasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-8 border-2 border-dashed hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Upload className="h-5 w-5" />
                <div className="text-center">
                  <p className="font-medium">Klik untuk memilih file</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    atau drag and drop file JSON
                  </p>
                </div>
              </Button>

              {selectedFile && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    File yang dipilih: {selectedFile.name}
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-400 mt-1">
                    Ukuran: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Restore</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Persyaratan File
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                <li>Format harus JSON (.json)</li>
                <li>File harus dari aplikasi Tabungan Kelas</li>
                <li>File tidak boleh diubah secara manual</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Proses Restore
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Setelah restore, semua data yang ada akan diganti dengan data
                dari file backup. Pastikan Anda tidak sedang menggunakan
                aplikasi di perangkat lain.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Restore Confirmation Modal */}
        <Modal
          isOpen={showConfirm}
          onClose={() => {
            setShowConfirm(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          title="Konfirmasi Restore"
          size="sm"
        >
          <ModalContent>
            <div className="space-y-4">
              <Alert variant="destructive" title="Perhatian">
                <p className="text-sm">
                  Semua data saat ini akan diganti. Tindakan ini tidak dapat
                  dibatalkan.
                </p>
              </Alert>
              <p className="text-gray-600 dark:text-gray-400">
                Apakah Anda yakin ingin melanjutkan restore data dari file{" "}
                <strong>{selectedFile?.name}</strong>?
              </p>
            </div>
          </ModalContent>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirm(false);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              isLoading={isRestoring}
              onClick={handleRestore}
            >
              Lanjutkan Restore
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </MainLayout>
  );
};
