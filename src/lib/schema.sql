create extension if not exists pgcrypto;

create table if not exists members (
  id text primary key default encode(gen_random_bytes(9), 'hex'),
  name text not null,
  email text not null unique,
  role text not null default 'CLIENT',
  plan text not null default 'RESEARCH',
  status text not null default 'ACTIVE',
  billing_cycle text not null default 'MONTHLY',
  next_billing_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists strategies (
  id text primary key default encode(gen_random_bytes(9), 'hex'),
  title text not null,
  instrument text,
  type text not null,
  bias text,
  excerpt text not null,
  body text not null,
  min_plan text not null default 'RESEARCH',
  author text not null default 'BE4 Trading Desk',
  published_at timestamptz not null default now()
);

alter table members add column if not exists password_hash text;
alter table members add column if not exists stripe_customer_id text;
alter table members add column if not exists stripe_subscription_id text;
create unique index if not exists members_stripe_customer_id_idx on members (stripe_customer_id) where stripe_customer_id is not null;
create unique index if not exists members_stripe_subscription_id_idx on members (stripe_subscription_id) where stripe_subscription_id is not null;

create unique index if not exists members_email_lower_idx on members (lower(email));

create table if not exists password_reset_tokens (
  id text primary key default encode(gen_random_bytes(9), 'hex'),
  member_id text not null references members(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists password_reset_tokens_member_id_idx on password_reset_tokens (member_id);
