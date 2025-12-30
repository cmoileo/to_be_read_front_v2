import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/debug-logs")({
  component: DebugLogsPage,
});

interface LogEntry {
  timestamp: string;
  message: string;
  level: "info" | "warn" | "error";
}

function DebugLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const navigate = Route.useNavigate();

  const loadLogs = () => {
    const existingLogs = sessionStorage.getItem("debug_logs");
    if (existingLogs) {
      try {
        const parsed = JSON.parse(existingLogs);
        setLogs(parsed);
      } catch (e) {
        // Ignore parse errors
      }
    }
  };

  useEffect(() => {
    loadLogs();
    // Auto-refresh every 2 seconds
    const interval = setInterval(loadLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    setLogs([]);
    sessionStorage.removeItem("debug_logs");
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-500";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={() => navigate({ to: "/settings" })}
          className="flex items-center gap-2 text-white"
        >
          <ArrowLeft size={20} />
          <span>Debug Logs ({logs.length})</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={loadLogs}
            className="px-3 py-1 text-sm bg-blue-800 text-white rounded flex items-center gap-1"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={clearLogs}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2 font-mono text-xs">
          {logs.length === 0 ? (
            <p className="text-gray-500">
              No logs captured. Make sure you're using the latest build with debug-logger.
            </p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-gray-500 min-w-[70px]">{log.timestamp}</span>
                <span className={getLevelColor(log.level)}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
        <p>Logs captured from app start. Max 200 logs kept.</p>
        <p>Auto-refreshes every 2 seconds.</p>
      </div>
    </div>
  );
}
