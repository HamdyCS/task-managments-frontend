import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations";
import type { TaskByPriorityDto } from "../../../../dtos/reports/ProjectReportDtos";

/** Register required Chart.js components for the Bar chart. */
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  data: TaskByPriorityDto[];
  isLoading: boolean;
}

/** Canonical list of all possible task priorities. */
const ALL_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

/** Fixed color palette per priority level. */
const PRIORITY_COLORS: Record<string, string> = {
  Low: "#10B981",
  Medium: "#3B82F6",
  High: "#F59E0B",
  Critical: "#EF4444",
};

export default function ProjectTaskPriorityChart({ data, isLoading }: Props) {
  const { t } = useTranslation();

  /** Maps priority enum values to their translated display labels. */
  const priorityKeyMap: Record<string, string> = {
    Low: t("dashboard.reports.priority.Low"),
    Medium: t("dashboard.reports.priority.Medium"),
    High: t("dashboard.reports.priority.High"),
    Critical: t("dashboard.reports.priority.Critical"),
  };

  /** Build a lookup map from the API response for O(1) access. */
  const countMap = new Map(
    data.map((item) => [item.taskPriority, item.count]),
  );

  /** Ensure all priorities appear in the chart, defaulting missing ones to 0. */
  const normalized = ALL_PRIORITIES.map((priority) => ({
    priority,
    count: countMap.get(priority) ?? 0,
  }));

  /** Maximum count — used to set the Y-axis upper bound with headroom. */
  const maxCount = Math.max(...normalized.map((item) => item.count), 0);

  /** Chart.js bar dataset — one bar per priority level. */
  const chartData: ChartData<"bar"> = {
    labels: normalized.map(
      (item) => priorityKeyMap[item.priority] ?? item.priority,
    ),
    datasets: [
      {
        data: normalized.map((item) => item.count),
        backgroundColor: normalized.map(
          (item) => PRIORITY_COLORS[item.priority] ?? "#71717A",
        ),
        hoverBackgroundColor: normalized.map(
          (item) => PRIORITY_COLORS[item.priority] ?? "#71717A",
        ),
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  /** Chart options — responsive, integer Y-axis, custom dark tooltip. */
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 8, bottom: 0, left: 0, right: 0 } },
    plugins: {
      legend: { display: false },
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
            const value = context.parsed.y ?? 0;
            return ` ${value} ${value === 1 ? "task" : "tasks"}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#71717A",
          font: { size: 12, weight: 500 },
          padding: 8,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: maxCount > 0 ? Math.max(2, Math.ceil(maxCount * 1.2)) : 2,
        border: { display: false },
        grid: { color: "#3F3F46", lineWidth: 0.5 },
        ticks: {
          color: "#71717A",
          font: { size: 11 },
          padding: 8,
          stepSize: 1,
          callback: (value) => {
            const number = Number(value);
            return Number.isInteger(number) ? number : "";
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
        {t("dashboard.reports.projectTaskPriority")}
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center h-[220px]">
          <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : normalized.every((item) => item.count === 0) ? (
        <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
          {t("dashboard.reports.noTasks")}
        </div>
      ) : (
        <div className="relative min-h-[220px]">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </motion.div>
  );
}
