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
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../../animations";
import type { TaskByStatus } from "../../../dtos/workspace/DashboardDto";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  data: TaskByStatus[];
  workspaceId: number;
}

const ALL_STATUSES = [
  "Backlog",
  "Todo",
  "InProgress",
  "Review",
  "Done",
] as const;

// Fixed colors chosen to work well in both light and dark mode.
const STATUS_COLORS = [
  "#64748B", // Backlog - Slate
  "#3B82F6", // Todo - Blue
  "#8B5CF6", // In Progress - Violet
  "#F59E0B", // Review - Amber
  "#10B981", // Done - Emerald
];

function normalizeData(
  data: TaskByStatus[],
): { status: string; count: number }[] {
  const countMap = new Map(data.map((item) => [item.taskStatus, item.count]));

  return ALL_STATUSES.map((status) => ({
    status,
    count: countMap.get(status) ?? 0,
  }));
}

export default function TaskDistribution({ data, workspaceId }: Props) {
  const { t } = useTranslation();

  const normalized = normalizeData(data);

  const chartData: ChartData<"bar"> = {
    labels: normalized.map((item) => item.status),

    datasets: [
      {
        data: normalized.map((item) => item.count),

        backgroundColor: STATUS_COLORS,
        hoverBackgroundColor: STATUS_COLORS,

        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,

        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  const maxCount = Math.max(...normalized.map((item) => item.count), 0);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      padding: {
        top: 8,
        bottom: 0,
        left: 0,
        right: 0,
      },
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

        padding: {
          top: 10,
          bottom: 10,
          left: 14,
          right: 14,
        },

        titleFont: {
          size: 13,
          weight: 600,
        },

        bodyFont: {
          size: 12,
          weight: 400,
        },

        titleMarginBottom: 4,

        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,

        usePointStyle: true,

        callbacks: {
          title: (items) => {
            return items[0]?.label ?? "";
          },

          label: (context) => {
            const value = context.parsed.y ?? 0;

            return ` ${value} ${value === 1 ? "task" : "tasks"}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#71717A",

          font: {
            size: 12,
            weight: 500,
          },

          padding: 8,
        },
      },

      y: {
        beginAtZero: true,

        suggestedMax: maxCount > 0 ? Math.max(2, Math.ceil(maxCount * 1.2)) : 2,

        border: {
          display: false,
        },

        grid: {
          color: "#3F3F46",
          lineWidth: 0.5,

          tickBorderDash: [4, 4],
        },

        ticks: {
          color: "#71717A",

          font: {
            size: 11,
          },

          padding: 8,

          stepSize: 1,

          callback: (value) => {
            const number = Number(value);

            return Number.isInteger(number) ? number : "";
          },
        },

        title: {
          display: true,

          text: t("dashboard.numberOfTasks"),

          color: "#71717A",

          font: {
            size: 11,
            weight: 500,
          },

          padding: {
            bottom: 4,
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
          {t("dashboard.taskDistribution")}
        </h2>
      </div>

      <div className="flex-1 relative min-h-[220px]">
        <Bar data={chartData} options={options} />
      </div>
    </motion.div>
  );
}
