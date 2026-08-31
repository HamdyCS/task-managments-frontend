import { motion } from "framer-motion";
import {
  MdAssignment,
  MdSearchOff,
  MdOutlineWarning,
} from "react-icons/md";

export default function DashboardNotFoundIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto h-56 mb-6 select-none">
      {/* Background 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="text-[100px] sm:text-[120px] font-bold text-muted-foreground/30 leading-none tracking-tighter">
          404
        </span>
      </motion.div>

      {/* Floating card - top left */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 left-6 bg-card border border-border shadow-sm rounded-lg p-2.5 flex items-center gap-2 w-32"
      >
        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center shrink-0">
          <MdAssignment className="w-3 h-3 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-1.5 bg-border/60 rounded w-full" />
          <div className="h-1.5 bg-border/40 rounded w-3/4" />
        </div>
      </motion.div>

      {/* Floating card - top right */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 right-4 bg-card border border-border shadow-sm rounded-lg p-2.5 flex items-center gap-2 w-28"
      >
        <div className="w-4 h-4 rounded-sm border-2 border-destructive/40 shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="h-1.5 bg-border/50 rounded w-full" />
          <div className="h-1.5 bg-border/30 rounded w-2/3" />
        </div>
      </motion.div>

      {/* Floating card - bottom left */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-10 bg-card border border-border shadow-sm rounded-lg p-2 flex items-center gap-2 w-24"
      >
        <div className="w-4 h-4 rounded-full bg-success/15 flex items-center justify-center shrink-0">
          <div className="w-2 h-2 rounded-full bg-success/50" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-1 bg-border/40 rounded w-full" />
          <div className="h-1 bg-border/30 rounded w-1/2" />
        </div>
      </motion.div>

      {/* Floating card - bottom right */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-8 bg-card border border-border shadow-sm rounded-lg p-2 flex items-center gap-2 w-36"
      >
        <div className="w-5 h-5 rounded bg-warning/15 flex items-center justify-center shrink-0">
          <MdOutlineWarning className="w-3 h-3 text-warning" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-1.5 bg-border/50 rounded w-full" />
          <div className="h-1.5 bg-border/30 rounded w-4/5" />
          <div className="h-1 bg-border/20 rounded w-1/2" />
        </div>
      </motion.div>

      {/* Floating search-off icon - center top */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-2 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm rounded-lg p-2 flex items-center justify-center w-10 h-10"
      >
        <MdSearchOff className="w-5 h-5 text-muted-foreground" />
      </motion.div>

      {/* Decorative connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M80 60 C 120 60, 140 90, 180 90"
          fill="transparent"
          stroke="currentColor"
          className="text-border/30"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <path
          d="M220 180 C 260 180, 280 160, 310 160"
          fill="transparent"
          stroke="currentColor"
          className="text-border/30"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <circle cx="80" cy="60" r="2.5" className="fill-primary/40" />
        <circle cx="310" cy="160" r="2.5" className="fill-warning/40" />
      </svg>
    </div>
  );
}
