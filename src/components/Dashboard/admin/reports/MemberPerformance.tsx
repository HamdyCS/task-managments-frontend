import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations";
import { useAdminMemberPerformances } from "../../../../hooks/admin/useAdminMemberPerformances";
import MemberPerformanceTable from "./MemberPerformanceTable";

export default function MemberPerformance() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [counter, setCounter] = useState(0);

  const {
    allMembers,
    isLoading,
    isLoadingMore,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useAdminMemberPerformances(search || undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputRef.current?.value || "");
    }, 500);

    return () => clearTimeout(timer);
  }, [counter]);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 pb-4">
        <h2 className="font-semibold text-lg text-card-foreground mb-4">
          {t("dashboard.admin.reports.memberPerformance")}
        </h2>

        <div className="relative max-w-sm">
          <FiSearch
            size={16}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            ref={inputRef}
            onChange={(e) => setCounter((prev) => prev + 1)}
            placeholder={t("dashboard.admin.reports.searchMembers")}
            className="w-full bg-background border rounded-xl ps-9 pe-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {isError ? (
        <div className="px-6 py-8 text-center text-muted-foreground text-sm">
          {t("dashboard.admin.reports.error.memberPerformance")}
        </div>
      ) : isLoading ? (
        <div className="px-6 py-8 text-center text-muted-foreground text-sm">
          {t("dashboard.admin.reports.loading")}
        </div>
      ) : (
        <MemberPerformanceTable
          members={allMembers}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
        />
      )}
    </motion.div>
  );
}
