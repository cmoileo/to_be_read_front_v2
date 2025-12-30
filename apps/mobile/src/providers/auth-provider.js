import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { connectedUserKeys } from "@repo/stores";
import { MobileStorage } from "../services/mobile-storage.service";
import { MobileAuthService } from "../services/mobile-auth.service";
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    useEffect(() => {
        const hydrateAuth = async () => {
            const hasTokens = await MobileStorage.hasTokens();
            if (!hasTokens) {
                queryClient.setQueryData(connectedUserKeys.profile(), null);
                return;
            }
            try {
                const me = await MobileAuthService.getMe();
                queryClient.setQueryData(connectedUserKeys.profile(), me.user);
            }
            catch (error) {
                await MobileStorage.clearTokens();
                queryClient.setQueryData(connectedUserKeys.profile(), null);
                navigate({ to: "/onboarding" });
            }
        };
        hydrateAuth();
    }, [queryClient, navigate]);
    return _jsx(_Fragment, { children: children });
}
