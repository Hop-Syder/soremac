/** Formulaire de création / édition d'une catégorie. @hopsyder */
"use client";

import { useActionState, useState } from "react";
import type { Category } from "@/lib/catalog/types";
import { saveCategory } from "@/app/admin/actions";
import { slugify } from "@/lib/admin/validate";
import { Field, Input, Notice, Select, SubmitButton, Textarea } from "@/components/admin/ui";
import { MediaInput } from "@/components/admin/MediaInput";

export function CategoryEditor({ category, all }: { category?: Category; all: { slug: string; name: string }[] }) {
  const [state, action] = useActionState(saveCategory.bind(null, category?.slug ?? null), null);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [image, setImage] = useState(category?.image ?? "");

  return (
    <form action={action} className="grid gap-4">
      {state?.errors && <Notice tone="error">{state.errors.map((e) => <span key={e}>{e}</span>)}</Notice>}
      {state?.message && <Notice tone="success">{state.message}</Notice>}
      <input type="hidden" name="position" value={category?.position ?? 0} />
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Nom *">
          <Input name="name" required value={name} onChange={(e) => { setName(e.target.value); if (!category) setSlug(slugify(e.target.value)); }} />
        </Field>
        <Field label="Nom court" hint="Affiché sur les cartes produit.">
          <Input name="shortName" defaultValue={category?.shortName} />
        </Field>
        <Field label="Slug (URL)" hint={category && slug !== category.slug ? "⚠ Modifier le slug change les URL (SEO)." : undefined}>
          <Input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </Field>
      </div>
      <Field label="Description"><Textarea name="description" rows={2} defaultValue={category?.description} /></Field>
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Field label="Image de la tuile"><MediaInput name="image" value={image} onChange={setImage} /></Field>
        <Field label="Taille sur la homepage">
          <Select name="size" defaultValue={category?.size ?? "md"}>
            <option value="xl">XL — tuile héros</option>
            <option value="lg">L — grande</option>
            <option value="md">M — moyenne</option>
            <option value="sm">S — petite</option>
          </Select>
        </Field>
      </div>
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium">Catégories associées <span className="font-normal text-steel">(« Souvent associé à »)</span></legend>
        <div className="flex flex-wrap gap-2">
          {all.filter((c) => c.slug !== category?.slug).map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2 border border-line px-2.5 py-1.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper">
              <input type="checkbox" name="related" value={c.slug} defaultChecked={category?.related.includes(c.slug)} className="sr-only" />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Titre SEO" hint="≤ 70 caractères."><Input name="seoTitle" maxLength={70} defaultValue={category?.seoTitle} /></Field>
        <Field label="Description SEO" hint="≤ 170 caractères."><Input name="seoDescription" maxLength={170} defaultValue={category?.seoDescription} /></Field>
      </div>
      <SubmitButton className="justify-self-start">{category ? "Enregistrer" : "Créer la catégorie"}</SubmitButton>
    </form>
  );
}
