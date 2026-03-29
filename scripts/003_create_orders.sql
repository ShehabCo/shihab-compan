-- Create orders table for service purchases

create type order_status as enum ('pending', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed');

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete restrict,
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  status order_status not null default 'pending',
  price decimal(10, 2) not null,
  requirements text,
  delivery_files text[],
  delivery_note text,
  delivered_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policies for orders
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "orders_insert_buyer"
  on public.orders for insert
  with check (auth.uid() = buyer_id);

create policy "orders_update_participant"
  on public.orders for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Trigger for updated_at
create trigger orders_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

-- Indexes
create index orders_buyer_id_idx on public.orders(buyer_id);
create index orders_seller_id_idx on public.orders(seller_id);
create index orders_service_id_idx on public.orders(service_id);
create index orders_status_idx on public.orders(status);
