-- Create messaging system for buyer-seller communication

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  attachment_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Policies for conversations
create policy "conversations_select_participant"
  on public.conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "conversations_insert_participant"
  on public.conversations for insert
  with check (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Policies for messages
create policy "messages_select_participant"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
    )
  );

create policy "messages_insert_participant"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations
      where conversations.id = conversation_id
      and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
    )
  );

-- Function to update last_message_at
create or replace function public.update_conversation_timestamp()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set last_message_at = now()
  where id = new.conversation_id;
  
  return new;
end;
$$;

create trigger update_conversation_timestamp_trigger
  after insert on public.messages
  for each row
  execute function public.update_conversation_timestamp();

-- Indexes
create index conversations_buyer_id_idx on public.conversations(buyer_id);
create index conversations_seller_id_idx on public.conversations(seller_id);
create index messages_conversation_id_idx on public.messages(conversation_id);
create index messages_sender_id_idx on public.messages(sender_id);
