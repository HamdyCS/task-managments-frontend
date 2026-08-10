import { motion } from "framer-motion";
import { Link, type To } from "react-router-dom";
import { staggerItem } from "../../animations";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  to?: To;
  type: "button" | "link";
  className?: string;
  isLoading?: boolean;
  Icon?: React.ReactNode;
  disabled?: boolean;
  ButtonType?: "submit" | "reset" | "button";
}

export default function Button({
  text,
  to,
  onClick,
  type,
  className = "",
  isLoading = false,
  Icon,
  disabled = false,
  ButtonType = "button",
}: ButtonProps) {
  return (
    <motion.div variants={staggerItem}>
      {type === "link" && to ? (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to={to}
            onClick={onClick}
            className={`bg-primary text-primary-foreground px-6 py-2 rounded-xl text-base font-semibold inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer ${className}`}
          >
            {Icon && Icon}
            {text}
          </Link>
        </motion.div>
      ) : (
        <motion.button
          type={ButtonType || "button"}
          onClick={onClick}
          disabled={isLoading || disabled}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className={`bg-primary text-primary-foreground px-8 h-12 rounded-xl text-base font-semibold inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        >
          {isLoading ? (
            <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <>
              {Icon && Icon}
              {text}
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
