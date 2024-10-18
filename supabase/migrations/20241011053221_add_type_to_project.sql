create type project_type as enum (
  'app',
  'website',
  'other'
);

alter table projects
add column type project_type default 'app';
