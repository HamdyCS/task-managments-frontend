import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../../animations";
import type { TaskByStatus } from "../../../dtos/workspace/WorkSpaceDashboardDto";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: TaskByStatus[];
  workspaceId: number;
}

const STATUS_COLORS: Record<string, string> = {
  Backlog: "#9a9aa3",
  Todo: "#6b6b74",
  InProgress: "#6d68f4",
  Review: "#fbbf24",
  Done: "#34d399",
};

const STATUS_COLORS_DARK: Record<string, string> = {
  Backlog: "#9a9aa3",
  Todo: "#6b6b74",
  InProgress: "#6d68f4",
  Review: "#fbbf24",
  Done: "#34d399",
};

function getBarColors(data: TaskByStatus[]): string[] {
  const isDark = document.documentElement.classList.contains("dark");
  const palette = isDark ? STATUS_COLORS_DARK : STATUS_COLORS;
  return data.map((d) => palette[d.taskStatus] ?? "#9a9aa3");
}

export default function TaskDistribution({ data, workspaceId }: Props) {
  const { t } = useTranslation();

  const chartData = {
    labels: data.map((d) => d.taskStatus),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: getBarColors(data),
        borderRadius: 6,
        barThickness: 48,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 8,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "var(--muted-foreground)",
          font: { size: 12 },
        },
      },
      y: {
        grid: { color: "var(--border)" },
        ticks: {
          color: "var(--muted-foreground)",
          font: { size: 12 },
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-lg text-card-foreground">
          {t("dashboard.taskDistribution")}
        </h2>
        <Link
          to={`/dashboard/projects?workspaceId=${workspaceId}`}
          className="text-primary text-sm hover:underline flex items-center gap-1"
        >
          {t("dashboard.viewReport")} <FiArrowRight size={14} />
        </Link>
      </div>
      <div className="flex-1 relative min-h-[250px]">
        <Bar data={chartData} options={options} />
      </div>
    </motion.div>
  );
}
