// src/components/ui/CalendarPicker.tsx

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

interface CalendarPickerProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (date: string) => void;
  placeholder?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CalendarPicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: CalendarPickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [isOpen, setIsOpen] = useState(false);

  function formatLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  /**
   * Local calendar navigation state.
   * Only used when the user manually browses months.
   */
  const [localViewDate, setLocalViewDate] = useState<Date | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * External selected date
   */
  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  /**
   * Derived display/view date
   *
   * Priority:
   * 1. User-browsed month
   * 2. Selected external value
   * 3. Today
   */
  const viewDate = localViewDate ?? selectedDate ?? today;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  /**
   * Close on outside click
   */
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  /**
   * Build calendar grid
   */
  const firstDow = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstDow }, () => null),

    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];

  /**
   * Month navigation
   */
  const prevMonth = () =>
    setLocalViewDate((d) => {
      const base = d ?? selectedDate ?? today;

      return new Date(base.getFullYear(), base.getMonth() - 1, 1);
    });

  const nextMonth = () =>
    setLocalViewDate((d) => {
      const base = d ?? selectedDate ?? today;

      return new Date(base.getFullYear(), base.getMonth() + 1, 1);
    });

  /**
   * Prevent navigating fully into past months
   */
  const isPrevDisabled =
    year < today.getFullYear() ||
    (year === today.getFullYear() && month <= today.getMonth());

  /**
   * Select a date
   */
  const handleDayClick = (date: Date) => {
    if (date.getTime() < today.getTime()) return;

    onChange(formatLocalDate(date));

    /**
     * Return calendar control to external value
     */
    setLocalViewDate(null);

    setIsOpen(false);
  };

  /**
   * Clear selected date
   */
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();

    onChange("");

    /**
     * Reset view back to today
     */
    setLocalViewDate(null);
  };

  /**
   * Button display label
   */
  const displayLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div ref={containerRef} className="relative w-fit">
      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-gray-800 px-3 py-1.5 text-sm text-white transition hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-500"
      >
        <Calendar size={14} className="shrink-0 text-gray-400" />

        {displayLabel ? (
          <span>{displayLabel}</span>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}

        {value && (
          <span
            role="button"
            onClick={handleClear}
            className="ml-1 rounded text-gray-500 transition hover:text-gray-300"
          >
            <X size={12} />
          </span>
        )}
      </button>

      {/* ── Calendar dropdown ── */}
      {isOpen && (
        <div className="absolute left-0 -top-32 z-50 mt-1.5 w-64 rounded-xl border border-white/10 bg-gray-900 p-3 shadow-2xl shadow-black/40">
          {/* Month navigation */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              disabled={isPrevDisabled}
              className="rounded-md p-1 text-gray-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="text-sm font-semibold text-white">
              {MONTH_NAMES[month]} {year}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="rounded-md p-1 text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="mb-1 grid grid-cols-7">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="flex h-7 items-center justify-center text-[10px] font-medium uppercase tracking-wide text-gray-500"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              if (!date) {
                return <div key={`gap-${i}`} />;
              }

              const isPast = date.getTime() < today.getTime();

              const isToday = date.toDateString() === today.toDateString();

              const isSelected =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString();

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDayClick(date)}
                  className={[
                    "flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium transition",

                    isPast
                      ? "cursor-not-allowed text-gray-700"
                      : "cursor-pointer",

                    isSelected
                      ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/30"
                      : "",

                    !isSelected && isToday
                      ? "border border-cyan-500/30 text-cyan-400"
                      : "",

                    !isSelected && !isPast
                      ? "text-gray-300 hover:bg-white/5"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 border-t border-white/10 pt-2.5">
            <button
              type="button"
              onClick={() => handleDayClick(today)}
              className="w-full rounded-md py-1 text-center text-xs text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
