create table if not exists waiting_list (
	id serial primary key,
    user_id uuid references auth.users not null,
	email text not null,
	created_at timestamp with time zone default now()
);

alter table waiting_list
  enable row level security;


create policy "Anybody can insert into waiting list" on waiting_list
for insert to authenticated
with check (user_id = auth.uid());
;
