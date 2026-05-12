import { format, formatDistance } from "date-fns";
import { id } from "date-fns/locale";

export const formatUtils = {
  formatCurrency(value: number, locale: string = "id-ID"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  },

  formatNumber(value: number, locale: string = "id-ID"): string {
    return new Intl.NumberFormat(locale).format(value);
  },

  formatDate(date: Date | string, pattern: string = "dd/MM/yyyy"): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, pattern);
  },

  formatDateTime(
    date: Date | string,
    pattern: string = "dd/MM/yyyy HH:mm",
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, pattern);
  },

  formatRelativeTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistance(dateObj, new Date(), {
      addSuffix: true,
      locale: id,
    });
  },

  formatDateRange(from: Date, to: Date): string {
    return `${this.formatDate(from)} - ${this.formatDate(to)}`;
  },

  toCurrency(value: number): string {
    return this.formatCurrency(value);
  },

  toPercent(value: number, decimals: number = 2): string {
    return (value * 100).toFixed(decimals) + "%";
  },
};
