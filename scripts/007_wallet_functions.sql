-- Create function to increment pending balance
create or replace function increment_pending_balance(wallet_id uuid, amount decimal)
returns void
language plpgsql
security definer
as $$
begin
  update public.wallets
  set pending_balance = pending_balance + amount
  where id = wallet_id;
end;
$$;

-- Create function to move pending to available balance
create or replace function complete_order_payment(wallet_id uuid, amount decimal)
returns void
language plpgsql
security definer
as $$
begin
  update public.wallets
  set 
    pending_balance = pending_balance - amount,
    balance = balance + amount,
    total_earned = total_earned + amount
  where id = wallet_id;
end;
$$;

-- Create function to process withdrawal
create or replace function process_withdrawal(wallet_id uuid, amount decimal)
returns void
language plpgsql
security definer
as $$
begin
  update public.wallets
  set 
    balance = balance - amount,
    total_withdrawn = total_withdrawn + amount
  where id = wallet_id
  and balance >= amount;
end;
$$;
