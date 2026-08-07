import { motion } from "framer-motion";
import { FiX, FiSearch, FiImage } from "react-icons/fi";

export function NotFoundIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto h-64 mb-8">
      {/* Central 404 Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-[120px] leading-none font-bold text-border select-none tracking-tighter">
          404
        </h1>
      </div>

      {/* Floating Error Card */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-1/4 bg-card/80 backdrop-blur-md border border-border shadow-sm rounded-lg p-3 flex items-center gap-2 w-32"
      >
        <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <FiX className="w-4 h-4 text-destructive" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-2 bg-border/50 rounded w-full"></div>
          <div className="h-2 bg-border/30 rounded w-2/3"></div>
        </div>
      </motion.div>

      {/* Floating Search Card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-1/4 bg-card/80 backdrop-blur-md border border-border shadow-sm rounded-lg p-3 flex items-center gap-2 w-36"
      >
        <div className="w-6 h-6 rounded flex items-center justify-center">
          <FiSearch className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 bg-border/40 rounded w-full"></div>
          <div className="h-1.5 bg-border/40 rounded w-4/5"></div>
          <div className="h-1.5 bg-border/40 rounded w-1/2"></div>
        </div>
      </motion.div>

      {/* Floating Broken Image Icon */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1/3 right-8 bg-card/80 backdrop-blur-md border border-border/50 shadow-sm rounded-lg p-2 flex items-center justify-center w-12 h-12"
      >
        <FiImage className="w-6 h-6 text-muted-foreground" />
      </motion.div>

      {/* Decorative SVG Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="text-border/40"
          d="M100 150 C 150 150, 200 100, 250 150"
          fill="transparent"
          stroke="currentColor"
          strokeDasharray="4 4"
          strokeWidth="1.5"
        />
        <circle className="text-border" cx="100" cy="150" fill="currentColor" r="3" />
        <circle className="text-primary/50" cx="250" cy="150" fill="currentColor" r="3" />
      </svg>
    </div>
  );
}
