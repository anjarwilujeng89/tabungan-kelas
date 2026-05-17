import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/utils/helpers";
import { ChevronDown } from "lucide-react";

interface SearchableSelectProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onSelect'> {
  error?: string;
  label?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  onSelectMember?: (value: string, label: string) => void;
  displayValue?: string;
}

export const SearchableSelect = React.forwardRef<HTMLInputElement, SearchableSelectProps>(
  (
    {
      className,
      error,
      label,
      helperText,
      options,
      onSelectMember,
      displayValue: initialDisplayValue,
      value: controlledValue,
      onChange,
      onBlur,
      name,
      ...props
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(initialDisplayValue || "");
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchValue.toLowerCase()),
    );

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string, label: string) => {
      setSelectedLabel(label);
      setSearchValue("");
      setIsOpen(false);
      onSelectMember?.(value, label);

      // Update the hidden input and trigger change event for react-hook-form
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = value;
        const event = new Event("change", { bubbles: true });
        hiddenInputRef.current.dispatchEvent(event);
      }

      if (onChange) {
        onChange({
          target: { value, name },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      setIsOpen(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
    };

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={hiddenInputRef}
            type="hidden"
            name={name}
            value={controlledValue || ""}
            {...props}
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Cari anggota..."
              value={isOpen ? searchValue : selectedLabel}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              onBlur={handleBlur}
              className={cn(
                "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-500",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                className,
              )}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {isOpen && filteredOptions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 border border-gray-300 rounded-lg bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
              <ul className="max-h-64 overflow-auto py-1">
                {filteredOptions.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value, opt.label)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isOpen && filteredOptions.length === 0 && searchValue.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 border border-gray-300 rounded-lg bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                Tidak ada anggota yang ditemukan
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

SearchableSelect.displayName = "SearchableSelect";
