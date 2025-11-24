import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/dialog";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Textarea } from "../components/textarea";
import { Label } from "../components/label";
import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import type { ProfileUpdateFormData } from "../schemas/profile.schema";

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProfileUpdateFormData) => void;
  isLoading?: boolean;
  defaultValues: {
    userName: string;
    biography: string | null;
    locale: "en" | "fr";
  };
}

export const ProfileEditDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  defaultValues,
}: ProfileEditDialogProps) => {
  const { t } = useTranslation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      userName: defaultValues.userName,
      biography: defaultValues.biography || "",
      locale: defaultValues.locale,
      avatar: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      const submitData: any = {
        userName: value.userName,
        biography: value.biography,
        locale: value.locale,
      };
      if (value.avatar) {
        submitData.avatar = value.avatar;
      }
      onSubmit(submitData);
      onClose();
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("profile.editProfile")}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="userName">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="userName">{t("profile.userName")}</Label>
                <Input
                  id="userName"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <p className="text-sm text-destructive">
                    {t(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="biography">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="biography">{t("profile.biography")}</Label>
                <Textarea
                  id="biography"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={4}
                />
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <p className="text-sm text-destructive">
                    {t(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="locale">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="locale">{t("profile.language")}</Label>
                <select
                  id="locale"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as "en" | "fr")}
                  onBlur={field.handleBlur}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            )}
          </form.Field>

          <div className="space-y-2">
            <Label htmlFor="avatar">{t("profile.avatar")}</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleAvatarChange}
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
