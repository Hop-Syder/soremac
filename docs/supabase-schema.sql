-- ═══════════════════════════════════════════════════════════════════
-- Schéma Supabase — back-office SOREMAC (TDR §44–45)        @hopsyder
-- À exécuter une fois dans Supabase › SQL Editor.
-- Toutes les écritures passent par le serveur Next.js (clé service_role) :
-- aucune écriture n'est autorisée depuis le navigateur (RLS).
-- ═══════════════════════════════════════════════════════════════════

create table if not exists categories (
  slug            text primary key,
  name            text not null,
  short_name      text,
  description     text,
  image           text,
  size            text not null default 'md' check (size in ('xl','lg','md','sm')),
  related         text[] not null default '{}',
  position        int  not null default 0,
  seo_title       text,
  seo_description text
);

create table if not exists products (
  slug            text primary key,
  name            text not null,
  category        text not null references categories(slug) on update cascade,
  subcategory     text,
  brand           text,
  summary         text,
  presentation    text,
  usage           text,
  advice          text,
  gallery         jsonb not null default '[]',
  specs           jsonb not null default '{}',
  variants        jsonb not null default '[]',
  unit            text  not null default 'unité(s)',
  packaging       text,
  badge           text,
  authenticity    text,
  documents       jsonb not null default '[]',
  featured        boolean not null default false,
  popular         boolean not null default false,
  related         text[] not null default '{}',
  keywords        text[] not null default '{}',
  seo_title       text,
  seo_description text,
  status          text not null default 'draft' check (status in ('published','draft','archived')),
  updated_at      timestamptz not null default now()
);
create index if not exists products_category_idx on products(category);
create index if not exists products_status_idx on products(status);

create table if not exists quote_requests (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type       text not null check (type in ('devis','contact')),
  name       text not null,
  phone      text not null,
  email      text,
  company    text,
  subject    text,
  note       text,
  items      jsonb not null default '[]',
  status     text not null default 'nouveau' check (status in ('nouveau','en_traitement','traite','archive'))
);
create index if not exists quote_requests_status_idx on quote_requests(status, created_at desc);

-- RLS : lecture publique du catalogue publié, rien d'autre.
alter table categories     enable row level security;
alter table products       enable row level security;
alter table quote_requests enable row level security;
drop policy if exists "lecture publique" on categories;
drop policy if exists "lecture publique" on products;
create policy "lecture publique" on categories for select using (true);
create policy "lecture publique" on products   for select using (status = 'published');

-- Stockage des photos et fiches PDF (lecture publique, écriture serveur uniquement)
insert into storage.buckets (id, name, public)
values ('catalogue', 'catalogue', true)
on conflict (id) do nothing;
