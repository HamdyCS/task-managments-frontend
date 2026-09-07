import logo from "../../assets/logo.png";

export default function AuthSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <img
        src={logo}
        alt="WorkPilot"
        className="h-16 w-auto animate-pulse"
      />
      <span className="mt-6 h-1 w-24 overflow-hidden rounded-full bg-muted">
        <span className="block h-full w-full animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
      </span>
    </div>
  );
}
