import { z } from "zod";

export const privacySettingsSchema = z.object({
  isPrivate: z.boolean(),
});

export type PrivacySettingsFormData = z.infer<typeof privacySettingsSchema>;
