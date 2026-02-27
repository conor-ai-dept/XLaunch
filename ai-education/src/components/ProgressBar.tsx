interface ProgressBarProps {
  progress: number; // 0 to 1
  size?: "sm" | "md";
}

export default function ProgressBar({
  progress,
  size = "md",
}: ProgressBarProps) {
  const percent = Math.round(progress * 100);
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-gray-200 rounded-full ${height}`}>
        <div
          className={`bg-indigo-600 ${height} rounded-full transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 font-medium w-10 text-right">
        {percent}%
      </span>
    </div>
  );
}
