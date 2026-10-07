/**
 * Champ média : URL saisie à la main OU fichier envoyé vers Supabase Storage.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadMedia } from "@/app/admin/actions";
import { inputClass } from "./ui";
import { cn } from "@/lib/cn";

export function MediaInput({
  value,
  onChange,
  name,
  accept = "image/jpeg,image/png,image/webp,image/avif",
  preview = true,
  placeholder = "https://…",
}: {
  value: string;
  onChange: (v: string) => void;
  name?: string;
  accept?: string;
  preview?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadMedia(fd);
    setBusy(false);
    if (res.url) onChange(res.url);
    else setError(res.error ?? "Upload impossible.");
  }

  return (
    <div className="grid gap-1.5">
      <div className="flex gap-2">
        {preview && (
          <span className="relative size-11 shrink-0 overflow-hidden border border-line bg-paper-2">
            {value && /^https:\/\//.test(value) && <Image src={value} alt="" fill sizes="44px" className="object-cover" unoptimized />}
          </span>
        )}
        <input name={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(inputClass, "min-w-0 flex-1")} />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="flex h-11 shrink-0 items-center gap-2 border border-line bg-white px-3 text-sm font-medium hover:border-ink disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span className="max-sm:sr-only">Téléverser</span>
        </button>
        <input ref={ref} type="file" accept={accept} hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
