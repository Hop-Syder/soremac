-- Schéma back-office SOREMAC (TDR §44–45) — @hopsyder
create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('devis','contact')),
  name text not null, phone text not null, email text, company text, subject text, note text,
  items jsonb not null default '[]',
  status text not null default 'nouveau' check (status in ('nouveau','en_traitement','traite','archive'))
);
alter table quote_requests enable row level security; -- écriture via service role uniquement

create table if not exists categories (
  slug text primary key, name text not null, description text, image text,
  position int default 0, seo_title text, seo_description text
);
create table if not exists products (
  slug text primary key, name text not null, category text references categories(slug),
  subcategory text, brand text, summary text, presentation text, usage text, advice text,
  gallery jsonb default '[]', specs jsonb default '{}', variants jsonb default '[]',
  unit text default 'unité(s)', packaging text, badge text, authenticity text, documents jsonb default '[]',
  featured bool default false, popular bool default false, related text[] default '{}',
  seo_title text, seo_description text,
  status text not null default 'draft' check (status in ('published','draft','archived')),
  updated_at timestamptz default now()
);
alter table categories enable row level security;
alter table products enable row level security;
create policy "lecture publique" on categories for select using (true);
create policy "lecture publique" on products for select using (status = 'published');
