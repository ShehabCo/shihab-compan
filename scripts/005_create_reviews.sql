-- Create reviews and ratings system

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies for reviews
create policy "reviews_select_all"
  on public.reviews for select
  using (true); -- Anyone can view reviews

create policy "reviews_insert_buyer"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id
    and exists (
      select 1 from public.orders
      where orders.id = order_id
      and orders.buyer_id = auth.uid()
      and orders.status = 'completed'
    )
  );

create policy "reviews_update_own"
  on public.reviews for update
  using (auth.uid() = reviewer_id);

-- Trigger for updated_at
create trigger reviews_updated_at
  before update on public.reviews
  for each row
  execute function public.handle_updated_at();

-- Function to update service rating
create or replace function public.update_service_rating()
returns trigger
language plpgsql
as $$
begin
  update public.services
  set 
    rating_average = (
      select avg(rating)::decimal(3,2)
      from public.reviews
      where service_id = new.service_id
    ),
    rating_count = (
      select count(*)
      from public.reviews
      where service_id = new.service_id
    )
  where id = new.service_id;
  
  return new;
end;
$$;

create trigger update_service_rating_trigger
  after insert or update on public.reviews
  for each row
  execute function public.update_service_rating();

-- Indexes
create index reviews_service_id_idx on public.reviews(service_id);
create index reviews_seller_id_idx on public.reviews(seller_id);
create index reviews_reviewer_id_idx on public.reviews(reviewer_id);
