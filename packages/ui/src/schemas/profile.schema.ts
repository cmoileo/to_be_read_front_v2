import { z } from "zod";

export const profileUpdateSchema = z.object({
  userName: z
    .string()
    .min(3, "profile.validation.userNameTooShort")
    .max(30, "profile.validation.userNameTooLong")
    .regex(/^[a-zA-Z0-9_-]+$/, "profile.validation.userNameInvalidCharacters")
    .optional(),
  biography: z
    .string()
    .max(500, "profile.validation.biographyTooLong")
    .optional(),
  locale: z.enum(["en", "fr"]).optional(),
  avatar: z.instanceof(File).optional().nullable(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
