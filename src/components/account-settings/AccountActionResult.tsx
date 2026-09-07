import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

interface AccountActionResultProps {
  status: "loading" | "success" | "error";
  title: string;
  message: string;
}

export default function AccountActionResult({
  status,
  title,
  message,
}: AccountActionResultProps) {

  return (
    <div className="flex items-center justify-center p-6 ">
      <div className="text-center max-w-md">
        {status === "loading" && (
          <>
            <div className="mb-4 flex justify-center">
              <FiLoader className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <FiCheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <FiXCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
