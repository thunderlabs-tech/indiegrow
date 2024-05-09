
create policy "Auth users can delete their projects" on projects
  for delete
  to authenticated
  using (auth.uid() = user_id);
