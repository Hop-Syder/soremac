/**
 * Éditeur de fiche produit (TDR §44–46) — toutes les données du modèle produit :
 * général, galerie multi-vues (upload, alt, rôle, ordre), caractéristiques, axes de variantes,
 * contenu éditorial, conditionnement, documents, produits associés, SEO (aperçu Google),
 * publication et mises en avant.
 * Le formulaire envoie un JSON unique, revalidé intégralement côté serveur.
 * @hopsyder
 */
"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import type { Product, ProductImage } from "@/lib/catalog/types";
import { saveProduct } from "@/app/admin/actions";
import { slugify } from "@/lib/admin/validate";
import { productUrl } from "@/lib/catalog/products";
import { Card, Field, Input, Notice, Select, StatusBadge, SubmitButton, Textarea } from "@/components/admin/ui";
import { MediaInput } from "@/components/admin/MediaInput";
import { cn } from "@/lib/cn";

type Opt = { slug: string; name: string };

const ROLES: { value: NonNullable<ProductImage["role"]>; label: string }[] = [
  { value: "main", label: "Vue principale" },
  { value: "side", label: "Vue secondaire" },
  { value: "detail", label: "Détail" },
  { value: "packaging", label: "Packaging" },
  { value: "texture", label: "Texture" },
  { value: "dimensions", label: "Dimensions" },
  { value: "usage", label: "Utilisation" },
  { value: "site", label: "En chantier" },
];

/** État d'édition : les listes « texte » restent du texte tant qu'on tape. */
interface Draft {
  name: string; slug: string; category: string; subcategory: string; brand: string;
  summary: string; presentation: string; usage: string; advice: string;
  gallery: ProductImage[];
  specs: { key: string; value: string }[];
  variants: { label: string; unit: string; options: string }[];
  unit: string; packaging: string; badge: string; authenticity: string;
  documents: { label: string; href: string }[];
  related: string[]; keywords: string;
  seoTitle: string; seoDescription: string;
  status: Product["status"]; featured: boolean; popular: boolean;
}

const toDraft = (p?: Product, defaultCategory = ""): Draft => ({
  name: p?.name ?? "", slug: p?.slug ?? "", category: p?.category ?? defaultCategory,
  subcategory: p?.subcategory ?? "", brand: p?.brand ?? "",
  summary: p?.summary ?? "", presentation: p?.presentation ?? "", usage: p?.usage ?? "", advice: p?.advice ?? "",
  gallery: p?.gallery ?? [],
  specs: Object.entries(p?.specs ?? {}).map(([key, value]) => ({ key, value })),
  variants: (p?.variants ?? []).map((v) => ({ label: v.label, unit: v.unit ?? "", options: v.options.join(", ") })),
  unit: p?.unit ?? "unité(s)", packaging: p?.packaging ?? "", badge: p?.badge ?? "", authenticity: p?.authenticity ?? "",
  documents: p?.documents ?? [], related: p?.related ?? [], keywords: (p?.keywords ?? []).join(", "),
  seoTitle: p?.seoTitle ?? "", seoDescription: p?.seoDescription ?? "",
  status: p?.status ?? "draft", featured: !!p?.featured, popular: !!p?.popular,
});

const split = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

const payloadOf = (d: Draft) => ({
  ...d,
  variants: d.variants.map((v) => ({ label: v.label, unit: v.unit, options: split(v.options) })),
  keywords: split(d.keywords),
});

export function ProductEditor({ product, categories, allProducts, saved }: { product?: Product; categories: Opt[]; allProducts: Opt[]; saved?: boolean }) {
  const [state, action] = useActionState(saveProduct.bind(null, product?.slug ?? null), null);
  const initial = useMemo(() => toDraft(product, categories[0]?.slug), [product, categories]);
  const [d, setD] = useState<Draft>(initial);
  const [slugTouched, setSlugTouched] = useState(!!product);
  const dirty = JSON.stringify(d) !== JSON.stringify(initial);

  // Alerte avant de quitter avec des modifications non enregistrées
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const setAt = <K extends "gallery" | "specs" | "variants" | "documents">(k: K, i: number, patch: Partial<Draft[K][number]>) =>
    setD((x) => ({ ...x, [k]: (x[k] as Draft[K][number][]).map((it, j) => (j === i ? { ...it, ...patch } : it)) }));
  const removeAt = (k: "gallery" | "specs" | "variants" | "documents", i: number) => setD((x) => ({ ...x, [k]: (x[k] as unknown[]).filter((_, j) => j !== i) }));
  const move = (i: number, dir: -1 | 1) =>
    setD((x) => {
      const g = [...x.gallery];
      const j = i + dir;
      if (j < 0 || j >= g.length) return x;
      [g[i], g[j]] = [g[j], g[i]];
      return { ...x, gallery: g };
    });

  const seoTitle = d.seoTitle || `${d.name || "Nom du produit"} — à Cotonou`;
  const seoDesc = d.seoDescription || d.summary || "Résumé du produit…";

  return (
    <form action={action} className="grid grid-cols-[minmax(0,1fr)] gap-6 pb-24">
      <input type="hidden" name="payload" value={JSON.stringify(payloadOf(d))} />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/produits" className="inline-flex items-center gap-1.5 text-sm text-steel hover:text-ink"><ArrowLeft size={14} /> Produits</Link>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase">{product ? d.name || product.name : "Nouveau produit"}</h1>
          {product && <div className="mt-2 flex items-center gap-3"><StatusBadge status={product.status} />
            {product.status === "published" && <a href={productUrl(product)} target="_blank" className="inline-flex items-center gap-1 text-sm underline underline-offset-4">Voir la fiche <ExternalLink size={13} /></a>}</div>}
        </div>
      </header>

      {saved && !dirty && !state && <Notice tone="success">Produit enregistré. Le site public est à jour.</Notice>}
      {state?.errors && <Notice tone="error"><strong>Corrigez les points suivants :</strong>{state.errors.map((e) => <span key={e}>• {e}</span>)}</Notice>}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid min-w-0 content-start gap-6">
          <Card title="Informations générales">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nom *" className="md:col-span-2">
                <Input value={d.name} required onChange={(e) => { set("name", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
              </Field>
              <Field label="Catégorie *">
                <Select value={d.category} onChange={(e) => set("category", e.target.value)}>
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Sous-catégorie / type" hint="Alimente le filtre « Type » du catalogue."><Input value={d.subcategory} onChange={(e) => set("subcategory", e.target.value)} /></Field>
              <Field label="Marque" hint="Alimente le filtre « Marque »."><Input value={d.brand} onChange={(e) => set("brand", e.target.value)} /></Field>
              <Field label="Slug (URL)" hint={<>/produits/{d.category}/<strong>{d.slug || "…"}</strong>{product && d.slug !== product.slug && " — ⚠ l'ancienne URL ne fonctionnera plus."}</>}>
                <Input value={d.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
              </Field>
              <Field label="Résumé *" hint={`${d.summary.length}/300 — affiché sur les cartes et en tête de fiche.`} className="md:col-span-2">
                <Textarea rows={2} maxLength={300} value={d.summary} onChange={(e) => set("summary", e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title={`Galerie · ${d.gallery.length} image(s)`} action={<span className="text-xs text-steel">Recommandé : 5 à 8 vues</span>}>
            <ol className="grid gap-3">
              {d.gallery.map((img, i) => (
                <li key={i} className="grid gap-2 border border-line p-3 md:grid-cols-[1fr_auto]">
                  <div className="grid gap-2">
                    <MediaInput value={img.src} onChange={(v) => setAt("gallery", i, { src: v })} />
                    <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
                      <Input placeholder="Texte alternatif * (ex. Barres de fer à béton Fe500 sur chantier)" value={img.alt} onChange={(e) => setAt("gallery", i, { alt: e.target.value })} />
                      <Select value={img.role ?? ""} onChange={(e) => setAt("gallery", i, { role: (e.target.value || undefined) as ProductImage["role"] })}>
                        <option value="">Rôle…</option>
                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </Select>
                    </div>
                  </div>
                  <RowTools onUp={i > 0 ? () => move(i, -1) : undefined} onDown={i < d.gallery.length - 1 ? () => move(i, 1) : undefined} onRemove={() => removeAt("gallery", i)} label={i === 0 ? "Principale" : `#${i + 1}`} />
                </li>
              ))}
            </ol>
            <AddButton onClick={() => set("gallery", [...d.gallery, { src: "", alt: d.name, role: d.gallery.length ? undefined : "main" }])}>Ajouter une image</AddButton>
          </Card>

          <Card title="Variantes" action={<span className="text-xs text-steel">Un produit, plusieurs déclinaisons (TDR §28)</span>}>
            <div className="grid gap-3">
              {d.variants.map((v, i) => (
                <div key={i} className="grid gap-2 border border-line p-3 sm:grid-cols-[160px_90px_1fr_auto]">
                  <Input placeholder="Axe (ex. Diamètre)" value={v.label} onChange={(e) => setAt("variants", i, { label: e.target.value })} />
                  <Input placeholder="Unité" value={v.unit} onChange={(e) => setAt("variants", i, { unit: e.target.value })} />
                  <Input placeholder="Options séparées par des virgules : 6, 8, 10, 12" value={v.options} onChange={(e) => setAt("variants", i, { options: e.target.value })} />
                  <RowTools onRemove={() => removeAt("variants", i)} />
                  {split(v.options).length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:col-span-4">
                      {split(v.options).map((o) => <span key={o} className="tabular border border-line px-1.5 py-0.5 text-xs">{o}{v.unit && ` ${v.unit}`}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <AddButton onClick={() => set("variants", [...d.variants, { label: "", unit: "", options: "" }])}>Ajouter un axe (grade, diamètre, conditionnement…)</AddButton>
          </Card>

          <Card title="Caractéristiques" action={<span className="text-xs text-steel">Uniquement des données vérifiées</span>}>
            <div className="grid gap-2">
              {d.specs.map((s, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.5fr_auto] gap-2">
                  <Input placeholder="Caractéristique" value={s.key} onChange={(e) => setAt("specs", i, { key: e.target.value })} />
                  <Input placeholder="Valeur" value={s.value} onChange={(e) => setAt("specs", i, { value: e.target.value })} />
                  <RowTools onRemove={() => removeAt("specs", i)} />
                </div>
              ))}
            </div>
            <AddButton onClick={() => set("specs", [...d.specs, { key: "", value: "" }])}>Ajouter une caractéristique</AddButton>
          </Card>

          <Card title="Contenu éditorial">
            <div className="grid gap-4">
              <Field label="Présentation"><Textarea rows={4} value={d.presentation} onChange={(e) => set("presentation", e.target.value)} /></Field>
              <Field label="Utilisation"><Textarea rows={2} value={d.usage} onChange={(e) => set("usage", e.target.value)} /></Field>
              <Field label="Conseils"><Textarea rows={2} value={d.advice} onChange={(e) => set("advice", e.target.value)} /></Field>
              <Field label="Message d'authenticité" hint="Ex. « Exigez l'authenticité du produit TOITUROL. »"><Input value={d.authenticity} onChange={(e) => set("authenticity", e.target.value)} /></Field>
            </div>
          </Card>

          <Card title="Documents (fiches techniques)">
            <div className="grid gap-2">
              {d.documents.map((doc, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[200px_1fr_auto]">
                  <Input placeholder="Libellé" value={doc.label} onChange={(e) => setAt("documents", i, { label: e.target.value })} />
                  <MediaInput value={doc.href} onChange={(v) => setAt("documents", i, { href: v })} accept="application/pdf" preview={false} />
                  <RowTools onRemove={() => removeAt("documents", i)} />
                </div>
              ))}
            </div>
            <AddButton onClick={() => set("documents", [...d.documents, { label: "Fiche technique", href: "" }])}>Ajouter un PDF</AddButton>
          </Card>

          <Card title="SEO">
            <div className="grid gap-4">
              <Field label="Titre SEO" hint={`${d.seoTitle.length}/70 — vide : généré automatiquement.`}><Input maxLength={70} value={d.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} /></Field>
              <Field label="Description SEO" hint={`${d.seoDescription.length}/170 — vide : résumé du produit.`}><Textarea rows={2} maxLength={170} value={d.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} /></Field>
              <Field label="Mots-clés de recherche interne" hint="Synonymes tapés par les clients, séparés par des virgules (ex. agglo, bloc)."><Input value={d.keywords} onChange={(e) => set("keywords", e.target.value)} /></Field>
              <div className="border border-line bg-paper p-4" aria-label="Aperçu Google">
                <p className="text-xs text-steel">soremac.com › produits › {d.category} › {d.slug}</p>
                <p className="mt-1 truncate text-lg text-[#1a0dab]">{seoTitle} | SOREMAC</p>
                <p className="line-clamp-2 text-sm text-steel">{seoDesc}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="grid min-w-0 content-start gap-6 xl:sticky xl:top-6">
          <Card title="Publication">
            <div className="grid gap-4">
              <Field label="Statut">
                <Select value={d.status} onChange={(e) => set("status", e.target.value as Draft["status"])}>
                  <option value="draft">Brouillon (invisible)</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </Select>
              </Field>
              <Toggle checked={d.featured} onChange={(v) => set("featured", v)} label="À la une" hint="Section « Les produits recherchés » de l'accueil." />
              <Toggle checked={d.popular} onChange={(v) => set("popular", v)} label="Populaire" />
            </div>
          </Card>
          <Card title="Commerce">
            <div className="grid gap-4">
              <p className="bg-paper p-3 text-xs text-steel">Le site affiche toujours « Prix sur demande » : aucun prix ni stock n'est publié.</p>
              <Field label="Unité de commande" hint="Utilisée dans le devis : barre(s), sac(s)…"><Input value={d.unit} onChange={(e) => set("unit", e.target.value)} /></Field>
              <Field label="Conditionnement"><Input value={d.packaging} onChange={(e) => set("packaging", e.target.value)} /></Field>
              <Field label="Badge" hint="Court : « Plus demandé », « Sika original »…"><Input maxLength={40} value={d.badge} onChange={(e) => set("badge", e.target.value)} /></Field>
            </div>
          </Card>
          <Card title={`Produits associés · ${d.related.length}`}>
            <div className="grid max-h-72 gap-1 overflow-y-auto">
              {allProducts.filter((p) => p.slug !== product?.slug).map((p) => (
                <label key={p.slug} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={d.related.includes(p.slug)}
                    onChange={(e) => set("related", e.target.checked ? [...d.related, p.slug] : d.related.filter((s) => s !== p.slug))}
                    className="size-4 accent-[#121314]"
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Barre d'enregistrement collante */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur lg:left-[240px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <span className={cn("text-sm", dirty ? "font-medium text-accent-2" : "text-steel")}>{dirty ? "Modifications non enregistrées" : "À jour"}</span>
          <div className="flex gap-2">
            {dirty && <button type="button" onClick={() => setD(initial)} className="h-12 px-4 text-sm font-medium text-steel hover:text-ink">Annuler</button>}
            <SubmitButton>{product ? "Enregistrer" : "Créer le produit"}</SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
}

function RowTools({ onUp, onDown, onRemove, label }: { onUp?: () => void; onDown?: () => void; onRemove: () => void; label?: string }) {
  const btn = "grid size-9 place-items-center text-steel hover:bg-paper hover:text-ink disabled:opacity-25";
  return (
    <div className="flex items-start gap-0.5 md:flex-col md:items-end">
      {label && <span className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-steel">{label}</span>}
      <div className="flex">
        {(onUp || onDown) && <>
          <button type="button" className={btn} disabled={!onUp} onClick={onUp} aria-label="Monter"><ArrowUp size={15} /></button>
          <button type="button" className={btn} disabled={!onDown} onClick={onDown} aria-label="Descendre"><ArrowDown size={15} /></button>
        </>}
        <button type="button" className={cn(btn, "hover:text-red-700")} onClick={onRemove} aria-label="Supprimer"><Trash2 size={15} /></button>
      </div>
    </div>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="mt-3 inline-flex items-center gap-2 border border-dashed border-ink/30 px-3 py-2 text-sm font-medium hover:border-ink">
      <Plus size={15} /> {children}
    </button>
  );
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span className="text-sm font-medium">{label}{hint && <span className="block text-xs font-normal text-steel">{hint}</span>}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative mt-0.5 h-6 w-10 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-accent after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
    </label>
  );
}
