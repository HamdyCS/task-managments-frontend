import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations";
import type { TasksByStatusReportDto } from "../../../../dtos/admin/AdminReportDtos";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: TasksByStatusReportDto[];
}

const STATUS_COLORS: Record<string, string> = {
  Backlog: "#64748B",
  Todo: "#3B82F6",
  InProgress: "#8B5CF6",
  Review: "#F59E0B",
  Done: "#10B981",
};

const ALL_STATUSES = ["Backlog", "Todo", "InProgress", "Review", "Done"] as const;

export default function TaskStatusDistribution({ data }: Props) {
  const { t } = useTranslation();

  const statusKeyMap: Record<string, string> = {
    Backlog: t("dashboard.reports.status.Backlog"),
    Todo: t("dashboard.reports.status.Todo"),
    InProgress: t("dashboard.reports.status.InProgress"),
    Review: t("dashboard.reports.status.Review"),
    Done: t("dashboard.reports.status.Done"),
  };

  const countMap = new Map(data.map((item) => [item.taskStatus, item.count]));

  const normalized = ALL_STATUSES.map((status) => ({
    status,
    count: countMap.get(status) ?? 0,
  }));

  const total = normalized.reduce((sum, item) => sum + item.count, 0);

  const chartData: ChartData<"doughnut"> = {
    labels: normalized.map((item) => statusKeyMap[item.status] ?? item.status),
    datasets: [
      {
        data: normalized.map((item) => item.count),
        backgroundColor: normalized.map(
          (item) => STATUS_COLORS[item.status] ?? "#71717A",
        ),
        hoverBackgroundColor: normalized.map(
          (item) => STATUS_COLORS[item.status] ?? "#71717A",
        ),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "#18181B",
        titleColor: "#FFFFFF",
        bodyColor: "#E4E4E7",
        borderColor: "#3F3F46",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        callbacks: {
          label: (context) => {
            const value = context.parsed ?? 0;
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            return ` ${value} ${value === 1 ? t("dashboard.tasks.details.task") : t("dashboard.tasks.details.tasks")} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl p-6 shadow-sm"
    >
      <h2 className="font-semibold text-lg text-card-foreground mb-5">
        {t("dashboard.admin.reports.taskStatusDistribution")}
      </h2>

      {total === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
          {t("dashboard.admin.reports.empty.noTaskStatusData")}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[280px]">
          <div className="w-full max-w-[320px]">
            <Doughnut data={chartData} options={options} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
