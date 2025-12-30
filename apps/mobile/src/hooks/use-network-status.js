import { useState, useEffect, useCallback } from "react";
import { NetworkService } from "../services/native";
export function useNetworkStatus() {
    const [status, setStatus] = useState({
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
