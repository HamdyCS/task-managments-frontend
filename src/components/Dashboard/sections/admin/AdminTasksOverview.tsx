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
import type { TasksOverviewDto } from "../../../../dtos/admin/AdminDashboardDto";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: TasksOverviewDto;
}

const ALL_STATUSES = [
  "Backlog",
  "Todo",
  "InProgress",
  "Review",
  "Done",
] as const;

const STATUS_LABELS: Record<string, string> = {
  Backlog: "Backlog",
  Todo: "To Do",
  InProgress: "In Progress",
  Review: "Review",
  Done: "Done",
};

const STATUS_COLORS = [
  "#64748B", // Backlog - Slate
  "#3B82F6", // Todo - Blue
  "#8B5CF6", // In Progress - Violet
  "#F59E0B", // Review - Amber
  "#10B981", // Done - Emerald
];

const STATUS_HOVER_COLORS = [
  "#475569",
  "#2563EB",
  "#7C3AED",
  "#D97706",
  "#059669",
];

function normalizeData(data: TasksOverviewDto): { status: string; count: number }[] {
  const countMap = new Map<string, number>([
    ["Backlog", data.backlogCount],
    ["Todo", data.todoCount],
    ["InProgress", data.inProgressCount],
    ["Review", data.reviewCount],
    ["Done", data.doneCount],
  ]);

  return ALL_STATUSES.map((status) => ({
    status,
    count: countMap.get(status) ?? 0,
  }));
}

export default function AdminTasksOverview({ data }: Props) {
  const { t } = useTranslation();

  const normalized = normalizeData(data);
  const totalCount = normalized.reduce((sum, item) => sum + item.count, 0);

  const chartData: ChartData<"doughnut"> = {
    labels: normalized.map((item) => STATUS_LABELS[item.status] ?? item.status),
    datasets: [
      {
        data: normalized.map((item) => item.count),
        backgroundColor: STATUS_COLORS,
        hoverBackgroundColor: STATUS_HOVER_COLORS,
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    layout: {
      padding: 4,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#18181B",
        titleColor: "#FFFFFF",
        bodyColor: "#E4E4E7",
        borderColor: "#3F3F46",
        borderWidth: 1,
        cornerRadius: 10,
        padding: { top: 10, bottom: 10, left: 14, right: 14 },
        titleFont: { size: 13, weight: 600 },
        bodyFont: { size: 12, weight: 400 },
        titleMarginBottom: 4,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const value = context.parsed ?? 0;
            const pct = totalCount > 0 ? Math.round((value / totalCount) * 100) : 0;
            return ` ${value} tasks (${pct}%)`;
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
      className="bg-card border rounded-xl p-6 shadow-sm flex flex-col"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold text-lg text-card-foreground">
          {t("dashboard.admin.tasksOverview.title")}
        </h2>
        <span className="text-sm text-muted-foreground font-medium">
          {totalCount} {t("dashboard.admin.tasksOverview.totalTasks")}
        </span>
      </div>

      <div className="flex-1 flex items-center gap-6 min-h-[220px]">
        {/* Doughnut */}
        <div className="relative w-[180px] h-[180px] shrink-0">
          <Doughnut data={chartData} options={options} />
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-semibold text-card-foreground">{totalCount}</span>
            <span className="text-xs text-muted-foreground">{t("dashboard.admin.tasksOverview.totalTasks")}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-1 gap-2.5">
          {normalized.map((item, i) => {
            const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
            return (
              <div key={item.status} className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[i] }}
                />
                <span className="text-sm text-muted-foreground flex-1 min-w-0 truncate">
                  {STATUS_LABELS[item.status]}
                </span>
                <span className="text-sm font-medium text-card-foreground tabular-nums">
                  {item.count}
                </span>
                <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
