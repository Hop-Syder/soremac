/** Formulaire de connexion (useActionState). @hopsyder */
"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Field, Input, Notice, SubmitButton } from "@/components/admin/ui";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action] = useActionState(login, null);
  if (!configured)
    return (
      <Notice tone="info">
        Définissez <code>ADMIN_PASSWORD</code> et <code>ADMIN_SECRET</code> (32 caractères minimum) dans les variables d'environnement, puis redémarrez le serveur.
      </Notice>
    );
  return (
    <form action={action} className="grid gap-4">
      {state?.errors && <Notice tone="error">{state.errors[0]}</Notice>}
      <Field label="Mot de passe">
        <Input type="password" name="password" required autoComplete="current-password" autoFocus />
      </Field>
      <SubmitButton className="w-full">Se connecter</SubmitButton>
    </form>
  );
}
