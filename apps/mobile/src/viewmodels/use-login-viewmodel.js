import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useConnectedUser } from "@repo/stores";
import { MobileAuthService } from "../services/mobile-auth.service";
import { MobileStorage } from "../services/mobile-storage.service";
export function useLoginViewModel() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useConnectedUser();
    const rememberMeRef = useRef(false);
    const loginMutation = useMutation({
        mutationFn: MobileAuthService.login,
        onSuccess: async (data) => {
            const accessToken = data.token.token;
            await MobileStorage.setAccessToken(accessToken);
            await MobileStorage.setRefreshToken(data.refreshToken);
            await MobileStorage.setRememberMe(rememberMeRef.current);
            setUser(data.user);
            navigate({ to: "/" });
        },
        onError: (err) => {
            setError(err.message || "Une erreur est survenue lors de la connexion");
        },
    });
    const login = (values) => {
        setError("");
        rememberMeRef.current = values.rememberMe ?? false;
        const { rememberMe: _, ...credentials } = values;
        loginMutation.mutate(credentials);
    };
    const navigateToRegister = () => {
        navigate({ to: "/register" });
    };
    const navigateToResetPassword = () => {
        navigate({ to: "/reset-password" });
    };
    return {
        login,
        isLoading: loginMutation.isPending,
        error,
        navigateToRegister,
        navigateToResetPassword,
    };
}
