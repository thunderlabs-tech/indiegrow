alter table community_posts
  enable row level security;

create policy "Auth users can manage community posts for their own projects" on community_posts
  for all
  to authenticated
  using (project_id in (select id from projects where user_id = auth.uid()));

