import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { FiCalendar, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "react-day-picker/style.css";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ value, onChange }: Props) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const isRtl = i18n.language === "ar";

  const displayFrom = value.from ? format(value.from, "MMM dd, yyyy") : "";
  const displayTo = value.to ? format(value.to, "MMM dd, yyyy") : "";

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      onChange({ from: range.from, to: range.to });
    } else {
      onChange({ from: undefined, to: undefined });
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ from: undefined, to: undefined });
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 bg-card border rounded-xl px-4 py-2.5 text-sm font-medium text-card-foreground hover:border-primary/30 transition-colors"
      >
        <FiCalendar size={16} className="text-muted-foreground" />
        {displayFrom && displayTo ? (
          <span>
            {displayFrom} — {displayTo}
          </span>
        ) : displayFrom ? (
          <span>
            {displayFrom} — {t("dashboard.admin.reports.datePicker.to")}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {t("dashboard.admin.reports.datePicker.placeholder")}
          </span>
        )}
        {(value.from || value.to) && (
          <FiX
            size={14}
            className="text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className={`absolute z-50 mt-2 bg-card border rounded-xl shadow-lg p-3 ${isRtl ? "right-0" : "left-0"}`}
          >
            <div className="">
              {/* From */}
              <DayPicker
                mode="single"
                selected={value.from}
                onSelect={(date) => {
                  handleSelect({
                    from: date,
                    to: value.to,
                  });
                }}
                dir={isRtl ? "rtl" : "ltr"}
              />

              {/* To */}
              <DayPicker
                mode="single"
                selected={value.to}
                onSelect={(date) => {
                  handleSelect({
                    from: value.from,
                    to: date,
                  });
                }}
                dir={isRtl ? "rtl" : "ltr"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
