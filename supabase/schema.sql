create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key,
  email text unique,
  firstname text,
  created_at timestamp with time zone default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text,
  category text,
  total_steps integer,
  created_at timestamp with time zone default now()
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  exercise_slug text,
  status text,
  completion integer,
  updated_at timestamp with time zone default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  exercise_slug text,
  content jsonb,
  updated_at timestamp with time zone default now()
);

create unique index if not exists progress_user_exercise_idx
  on public.progress (user_id, exercise_slug);

create unique index if not exists answers_user_exercise_idx
  on public.answers (user_id, exercise_slug);

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.progress enable row level security;
alter table public.answers enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
drop policy if exists "Profiles are insertable by owner" on public.profiles;
drop policy if exists "Profiles are updatable by owner" on public.profiles;
drop policy if exists "Exercises are readable" on public.exercises;
drop policy if exists "Progress is readable by owner" on public.progress;
drop policy if exists "Progress is insertable by owner" on public.progress;
drop policy if exists "Progress is updatable by owner" on public.progress;
drop policy if exists "Answers are readable by owner" on public.answers;
drop policy if exists "Answers are insertable by owner" on public.answers;
drop policy if exists "Answers are updatable by owner" on public.answers;

create policy "Profiles are readable by owner"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Exercises are readable"
  on public.exercises
  for select
  to anon, authenticated
  using (true);

create policy "Progress is readable by owner"
  on public.progress
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Progress is insertable by owner"
  on public.progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Progress is updatable by owner"
  on public.progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Answers are readable by owner"
  on public.answers
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Answers are insertable by owner"
  on public.answers
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Answers are updatable by owner"
  on public.answers
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into public.exercises (slug, title, category, total_steps)
values (
  'mindset-lettre-septembre',
  'Exercice — La Lettre à la Toi de septembre (Terry)',
  'Mindset & Organisation',
  1
)
on conflict (slug) do update
set
  title = excluded.title,
  category = excluded.category,
  total_steps = excluded.total_steps;
