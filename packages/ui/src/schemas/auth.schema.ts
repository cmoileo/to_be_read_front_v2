import { z } from "zod";
import i18n from "../i18n/config";

export const getEmailSchema = () => z.string().email(i18n.t("auth.validation.emailInvalid"));

export const getUsernameSchema = () =>
  z
    .string()
    .min(3, i18n.t("auth.validation.usernameMin"))
    .max(32, i18n.t("auth.validation.usernameMax"))
    .transform((val) => val.toLowerCase())
    .refine((val) => /^[a-z0-9_]+$/.test(val), {
      message: i18n.t("auth.validation.usernameFormat"),
    });

export const getPasswordSchema = () =>
  z
    .string()
    .min(8, i18n.t("auth.validation.passwordMin"))
    .regex(/[A-Z]/, i18n.t("auth.validation.passwordUppercase"))
    .regex(/[a-z]/, i18n.t("auth.validation.passwordLowercase"))
    .regex(/[0-9]/, i18n.t("auth.validation.passwordNumber"))
    .regex(/[^a-zA-Z0-9]/, i18n.t("auth.validation.passwordSpecial"));

export const emailSchema = getEmailSchema();
export const usernameSchema = getUsernameSchema();
export const passwordSchema = getPasswordSchema();

export const getLoginSchema = () =>
  z.object({
    email: getEmailSchema(),
    password: z.string().min(8, i18n.t("auth.validation.passwordMin")),
  });

export const getRegisterSchema = () =>
  z
    .object({
      username: getUsernameSchema(),
      email: getEmailSchema(),
      password: getPasswordSchema(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18n.t("auth.validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

export const getResetPasswordRequestSchema = () =>
  z.object({
    email: getEmailSchema(),
  });

export const getResetPasswordConfirmSchema = () =>
  z
    .object({
      token: z.string().min(1, "Token requis"),
      password: getPasswordSchema(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18n.t("auth.validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

export const loginSchema = getLoginSchema();
export const registerSchema = getRegisterSchema();
export const resetPasswordRequestSchema = getResetPasswordRequestSchema();
export const resetPasswordConfirmSchema = getResetPasswordConfirmSchema();

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordRequestFormValues = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordConfirmFormValues = z.infer<typeof resetPasswordConfirmSchema>;
