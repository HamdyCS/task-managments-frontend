import { motion } from "framer-motion";
import { fadeIn } from "../../../animations";

export default function TasksSkeleton() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-72 bg-muted rounded animate-pulse" />
      </div>

      <div className="flex gap-4 items-center">
        <div className="h-10 w-56 bg-muted rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="flex gap-2">
        <div className="h-10 w-28 bg-muted rounded-lg animate-pulse" />
        <div className="h-10 w-28 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="flex gap-3 items-center">
        <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-10 w-20 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-muted rounded animate-pulse"
                style={{ width: `${80 + i * 20}px` }}
              />
            ))}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b last:border-b-0">
            <div className="flex gap-4 items-center">
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse ms-auto" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
