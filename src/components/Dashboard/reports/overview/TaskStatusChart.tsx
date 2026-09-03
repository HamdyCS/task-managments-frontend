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

/** Register the Chart.js components required by the Doughnut chart. */
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  backlog: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
}

/** Fixed color palette for each task status. */
const STATUS_COLORS = [
  "#64748B", // Backlog - Slate
  "#3B82F6", // Todo - Blue
  "#8B5CF6", // In Progress - Violet
  "#F59E0B", // Review - Amber
  "#10B981", // Done - Emerald
];

export default function TaskStatusChart({
  backlog,
  todo,
  inProgress,
  review,
  done,
}: Props) {
  const { t } = useTranslation();

  /** Chart.js dataset — one slice per status. */
  const data: ChartData<"doughnut"> = {
    labels: [
      t("dashboard.reports.status.Backlog"),
      t("dashboard.reports.status.Todo"),
      t("dashboard.reports.status.InProgress"),
      t("dashboard.reports.status.Review"),
      t("dashboard.reports.status.Done"),
    ],
    datasets: [
      {
        data: [backlog, todo, inProgress, review, done],
        backgroundColor: STATUS_COLORS,
        hoverBackgroundColor: STATUS_COLORS,
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  /** Chart.js options — responsive, donut cutout, custom tooltip. */
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
            const total = (context.dataset.data as number[]).reduce(
              (a, b) => a + b,
              0,
            );
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            return ` ${value} tasks (${pct}%)`;
          },
        },
      },
    },
  };

  /** Grand total across all statuses — used to decide between chart vs. empty state. */
  const total = backlog + todo + inProgress + review + done;

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl p-6 shadow-sm"
    >
      <h2 className="font-semibold text-lg text-card-foreground mb-5">
        {t("dashboard.reports.taskStatus")}
      </h2>

      {total === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
          {t("dashboard.reports.noTasks")}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[280px]">
          <div className="w-full max-w-[320px]">
            <Doughnut data={data} options={options} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
