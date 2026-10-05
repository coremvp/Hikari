-- This schema transition is for a fresh installation. Refuse to discard existing application data.
do $$
declare table_name text; populated boolean;
begin
  foreach table_name in array array['users','customers','subscriptions','products','prices','posts','user_email_list'] loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('select exists(select 1 from public.%I)', table_name) into populated;
      if populated then raise exception 'Hikari relaunch requires a fresh Supabase project; existing % data must be preserved and migrated separately', table_name; end if;
    end if;
  end loop;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.posts;
drop table if exists public.user_email_list;
drop table public.subscriptions;
drop table public.prices;
drop table public.products;
drop table public.customers;
drop table public.users;
drop type public.pricing_type;
drop type public.pricing_plan_interval;

create table public.customers (
  user_id uuid primary key references auth.users(id) on delete restrict,
  stripe_customer_id text not null unique
);
create table public.subscriptions (
  id text primary key,
  customer_id text not null references public.customers(stripe_customer_id) on delete restrict,
  status public.subscription_status not null,
  price_id text,
  cancel_at_period_end boolean not null,
  current_period_end timestamptz
);
create index subscriptions_customer_id_idx on public.subscriptions(customer_id);
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;
revoke all on table public.customers, public.subscriptions from public, anon, authenticated;
-- No client policies: application services access these tables through the server database connection.
