import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  confirmText,
  cancelText,
  isLoading,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 "
            onClick={onClose}
          />
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-popover text-popover-foreground border border-border rounded-xl shadow-lg w-full max-w-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={onClose}
                  disabled={isLoading}
                  text={cancelText}
                  type={"button"}
                  className="w-25! p-2! text-sm"
                />

                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  text={confirmText}
                  type={"button"}
                  className="bg-red-700 w-25! p-2! text-sm"
                  isLoading={isLoading}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
