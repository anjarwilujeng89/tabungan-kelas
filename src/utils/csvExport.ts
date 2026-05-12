import { Transaction } from "@/types/models";
import { format } from "date-fns";
import Papa from "papaparse";

export const csvExportUtils = {
  exportTransactionsToCSV(
    transactions: Transaction[],
    filename?: string,
  ): void {
    const data = transactions.map((trx) => ({
      "ID Transaksi": trx.id,
      "Nama Anggota": trx.memberName,
      "Tipe Transaksi":
        trx.transactionType === "tabungan" ? "Setoran" : "Penarikan",
      Jumlah: trx.amount.toLocaleString("id-ID"),
      Tanggal: format(new Date(trx.transactionDate), "dd/MM/yyyy"),
      Catatan: trx.notes || "-",
    }));

    const csv = Papa.unparse(data);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`,
    );
    element.setAttribute(
      "download",
      filename || `transactions-${new Date().getTime()}.csv`,
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },

  exportTransactionsSummaryToCSV(
    data: Array<{
      date: string;
      totalSaving: number;
      totalWithdraw: number;
      net: number;
    }>,
    filename?: string,
  ): void {
    const csvData = data.map((row) => ({
      Tanggal: row.date,
      "Total Setoran": row.totalSaving.toLocaleString("id-ID"),
      "Total Penarikan": row.totalWithdraw.toLocaleString("id-ID"),
      Net: row.net.toLocaleString("id-ID"),
    }));

    const csv = Papa.unparse(csvData);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`,
    );
    element.setAttribute(
      "download",
      filename || `recap-${new Date().getTime()}.csv`,
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },
};
