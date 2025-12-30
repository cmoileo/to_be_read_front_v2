import { createFileRoute } from "@tanstack/react-router";
import { LegalScreen } from "@repo/ui";

export const Route = createFileRoute("/legal")({
  component: LegalPage,
});

function LegalPage() {
  return <LegalScreen />;
}
