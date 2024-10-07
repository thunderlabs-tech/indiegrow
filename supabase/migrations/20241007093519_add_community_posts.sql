create table community_posts (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects not null on delete cascade,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,

    url text not null,
    title text not null,
    content text not null,
    score int not null,

    relevant boolean default null,

    unique (project_id, url)
);
