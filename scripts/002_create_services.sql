-- Create services/gigs table for marketplace listings

create type service_status as enum ('draft', 'active', 'paused', 'deleted');
create type service_category as enum ('design', 'development', 'writing', 'marketing', 'video', 'music', 'business', 'other');

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category service_category not null,
  price decimal(10, 2) not null check (price >= 0),
  delivery_days integer not null check (delivery_days > 0),
  status service_status not null default 'draft',
  image_url text,
  gallery_urls text[],
  tags text[],
  views_count integer default 0,
  orders_count integer default 0,
  rating_average decimal(3, 2) default 0 check (rating_average >= 0 and rating_average <= 5),
  rating_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.services enable row level security;

-- Policies for services
create policy "services_select_active"
  on public.services for select
  using (status = 'active' or seller_id = auth.uid());

create policy "services_insert_own"
  on public.services for insert
  with check (auth.uid() = seller_id);

create policy "services_update_own"
  on public.services for update
  using (auth.uid() = seller_id);

create policy "services_delete_own"
  on public.services for delete
  using (auth.uid() = seller_id);

-- Trigger for updated_at
create trigger services_updated_at
  before update on public.services
  for each row
  execute function public.handle_updated_at();

-- Index for performance
create index services_seller_id_idx on public.services(seller_id);
create index services_category_idx on public.services(category);
create index services_status_idx on public.services(status);
