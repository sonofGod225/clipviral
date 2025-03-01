-- Enable les extensions nécessaires
create extension if not exists "uuid-ossp";

-- Table des utilisateurs
create table public.users (
    id uuid primary key,
    email text not null unique,
    plan text not null default 'free' check (plan in ('free', 'premium')),
    credits integer not null default 10,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des projets vidéo
create table public.projects (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    title text not null,
    script text not null,
    status text not null default 'draft' check (status in ('draft', 'processing', 'completed', 'failed')),
    settings jsonb not null default '{
        "style": "realistic",
        "voiceId": "voice1",
        "subtitleSettings": {
            "font": "Inter",
            "size": 24,
            "color": "#FFFFFF",
            "backgroundColor": "rgba(0,0,0,0.7)",
            "position": "bottom",
            "animation": "fade"
        }
    }'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des scènes
create table public.scenes (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    text text not null,
    image_url text,
    audio_url text,
    duration integer not null default 5,
    "order" integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Fonction pour mettre à jour le timestamp updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Triggers pour mettre à jour updated_at
create trigger handle_projects_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

create trigger handle_scenes_updated_at
    before update on public.scenes
    for each row
    execute function public.handle_updated_at();

-- Politiques de sécurité Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.scenes enable row level security;

-- Politiques pour les utilisateurs
create policy "Users can view their own data"
    on public.users for select
    using (auth.uid() = id);

-- Politiques pour les projets
create policy "Users can view their own projects"
    on public.projects for select
    using (auth.uid() = user_id);

create policy "Users can create their own projects"
    on public.projects for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own projects"
    on public.projects for update
    using (auth.uid() = user_id);

create policy "Users can delete their own projects"
    on public.projects for delete
    using (auth.uid() = user_id);

-- Politiques pour les scènes
create policy "Users can view scenes of their projects"
    on public.scenes for select
    using (
        exists (
            select 1 from public.projects
            where id = project_id
            and user_id = auth.uid()
        )
    );

create policy "Users can create scenes in their projects"
    on public.scenes for insert
    with check (
        exists (
            select 1 from public.projects
            where id = project_id
            and user_id = auth.uid()
        )
    );

create policy "Users can update scenes in their projects"
    on public.scenes for update
    using (
        exists (
            select 1 from public.projects
            where id = project_id
            and user_id = auth.uid()
        )
    );

create policy "Users can delete scenes in their projects"
    on public.scenes for delete
    using (
        exists (
            select 1 from public.projects
            where id = project_id
            and user_id = auth.uid()
        )
    );

-- Index pour améliorer les performances
create index projects_user_id_idx on public.projects(user_id);
create index scenes_project_id_idx on public.scenes(project_id);
create index scenes_order_idx on public.scenes("order");

-- Buckets de stockage
insert into storage.buckets (id, name)
values 
    ('images', 'images'),
    ('audio', 'audio'),
    ('videos', 'videos');

-- Politiques de stockage
create policy "Users can view public files"
    on storage.objects for select
    using (bucket_id in ('images', 'audio', 'videos'));

create policy "Users can upload files"
    on storage.objects for insert
    with check (
        bucket_id in ('images', 'audio', 'videos')
        and auth.role() = 'authenticated'
    ); 