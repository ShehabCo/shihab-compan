-- Create wallet system for sellers

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  balance decimal(10, 2) not null default 0 check (balance >= 0),
  pending_balance decimal(10, 2) not null default 0 check (pending_balance >= 0),
  total_earned decimal(10, 2) not null default 0,
  total_withdrawn decimal(10, 2) not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create type transaction_type as enum ('earning', 'withdrawal', 'refund', 'commission');
create type transaction_status as enum ('pending', 'completed', 'failed', 'cancelled');

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  type transaction_type not null,
  amount decimal(10, 2) not null,
  status transaction_status not null default 'pending',
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;

-- Policies for wallets
create policy "wallets_select_own"
  on public.wallets for select
  using (auth.uid() = user_id);

create policy "wallets_insert_own"
  on public.wallets for insert
  with check (auth.uid() = user_id);

create policy "wallets_update_own"
  on public.wallets for update
  using (auth.uid() = user_id);

-- Policies for wallet_transactions
create policy "wallet_transactions_select_own"
  on public.wallet_transactions for select
  using (
    exists (
      select 1 from public.wallets
      where wallets.id = wallet_transactions.wallet_id
      and wallets.user_id = auth.uid()
    )
  );

-- Trigger for updated_at
create trigger wallets_updated_at
  before update on public.wallets
  for each row
  execute function public.handle_updated_at();

create trigger wallet_transactions_updated_at
  before update on public.wallet_transactions
  for each row
  execute function public.handle_updated_at();

-- Indexes
create index wallet_transactions_wallet_id_idx on public.wallet_transactions(wallet_id);
create index wallet_transactions_order_id_idx on public.wallet_transactions(order_id);
