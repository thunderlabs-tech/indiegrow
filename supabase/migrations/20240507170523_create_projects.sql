create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  name text not null,
  description text
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table projects
  enable row level security;

create policy "Auth users can see their own projects" on projects
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Auth users can insert their own projects" on projects
  for insert
 to authenticated
  with check (auth.uid() = user_id);

create policy "Auth users can update their projects" on projects
  for update
  to authenticated
  using (auth.uid() = user_id);
