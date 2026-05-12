import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Wallet,
  FileText,
  Calendar,
  TrendingUp,
  Save,
  Upload,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/utils/helpers";

const navItems = [
  {
    icon: BarChart3,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Users,
    label: "Anggota",
    path: "/members",
  },
  {
    icon: Wallet,
    label: "Transaksi",
    path: "/tabungan",
  },
  {
    icon: FileText,
    label: "Laporan",
    path: "/laporan",
  },
  {
    icon: Calendar,
    label: "Rekap Harian",
    path: "/rekap",
  },
  {
    icon: TrendingUp,
    label: "Posisi Kas",
    path: "/posisi-kas",
  },
  {
    icon: Save,
    label: "Backup",
    path: "/backup",
  },
  {
    icon: Upload,
    label: "Restore",
    path: "/restore",
  },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-40 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-20 transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
