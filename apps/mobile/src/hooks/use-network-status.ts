import { useState, useEffect, useCallback } from "react";
import { NetworkService } from "../services/native";
import type { ConnectionStatus } from "@capacitor/network";

interface UseNetworkStatusResult {
  isOnline: boolean;
  connectionType: string;
  checkStatus: () => Promise<boolean>;
}

export function useNetworkStatus(): UseNetworkStatusResult {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: true,
    connectionType: "wifi",
  });

  useEffect(() => {
    NetworkService.getStatus().then(setStatus);

    const unsubscribe = NetworkService.addListener((newStatus) => {
      setStatus(newStatus);
    });

    return unsubscribe;
  }, []);

  const checkStatus = useCallback(async () => {
    const isOnline = await NetworkService.isOnline();
    return isOnline;
  }, []);

  return {
    isOnline: status.connected,
    connectionType: status.connectionType,
    checkStatus,
  };
}
