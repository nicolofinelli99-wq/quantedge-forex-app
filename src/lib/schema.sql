create extension if not exists pgcrypto;

create table if not exists members (
  id text primary key default encode(gen_random_bytes(9), 'hex'),
  name text not null,
  email text not null unique,
  role text not null default 'CLIENT',
  plan text not null default 'BASIC',
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
  min_plan text not null default 'BASIC',
  author text not null default 'QuantEdge Desk',
  published_at timestamptz not null default now()
);
