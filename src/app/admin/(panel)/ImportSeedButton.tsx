/** Bouton d'import du catalogue initial. @hopsyder */
"use client";

import { useActionState } from "react";
import { importSeed } from "@/app/admin/actions";
import { Notice, SubmitButton } from "@/components/admin/ui";

export function ImportSeedButton() {
  const [state, action] = useActionState(importSeed, null);
  return (
    <form action={action} className="grid gap-3">
      {state?.errors && <Notice tone="error">{state.errors[0]}</Notice>}
      {state?.message && <Notice tone="success">{state.message}</Notice>}
      <SubmitButton variant="dark" className="justify-self-start">Importer le catalogue initial</SubmitButton>
    </form>
  );
}
