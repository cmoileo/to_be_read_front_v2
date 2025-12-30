interface LogEntry {
  timestamp: string;
  message: string;
  level: "info" | "warn" | "error";
}

const MAX_LOGS = 200;

const initDebugLogger = () => {
  if ((window as any).__debugLoggerInitialized) {
    return;
  }
  (window as any).__debugLoggerInitialized = true;

  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  const addLog = (level: "info" | "warn" | "error", args: any[]) => {
    const message = args
      .map((arg) => {
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(" ");

    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      level,
    };

    try {
      const existingLogs = sessionStorage.getItem("debug_logs");
      const logs: LogEntry[] = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(newLog);
      const trimmedLogs = logs.slice(-MAX_LOGS);
      sessionStorage.setItem("debug_logs", JSON.stringify(trimmedLogs));
    } catch (e) {
    }
  };

  console.log = (...args: any[]) => {
    originalConsoleLog(...args);
    addLog("info", args);
  };

  console.warn = (...args: any[]) => {
    originalConsoleWarn(...args);
    addLog("warn", args);
  };

  console.error = (...args: any[]) => {
    originalConsoleError(...args);
    addLog("error", args);
  };

  console.log("=== DEBUG LOGGER INITIALIZED ===");
};

initDebugLogger();

export {};
