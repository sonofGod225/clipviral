-- Enable les extensions nécessaires
create extension if not exists "uuid-ossp";

-- Table des utilisateurs
create table public.users (
    id uuid references auth.users on delete cascade,
    email text,
    plan text default 'free',
    credits integer default 10,
    stripe_customer_id text,
    stripe_subscription_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
);

-- Table des projets vidéo
create table public.projects (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users on delete cascade not null,
    title text not null,
    script text not null,
    status text default 'draft',
    settings jsonb not null default '{
        "style": "realistic",
        "voiceId": "voice1",
        "subtitleSettings": {
            "font": "Arial",
            "size": 24,
            "color": "#FFFFFF",
            "backgroundColor": "#000000",
            "position": "bottom",
            "animation": "fade"
        },
        "musicSettings": {
            "volume": 50
        }
    }'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des scènes
create table public.scenes (
    id uuid default uuid_generate_v4() primary key,
    project_id uuid references public.projects on delete cascade not null,
    text text not null,
    image_url text,
    audio_url text,
    duration integer default 5,
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
create trigger handle_users_updated_at
    before update on public.users
    for each row
    execute function public.handle_updated_at();

create trigger handle_projects_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

create trigger handle_scenes_updated_at
    before update on public.scenes
    for each row
    execute function public.handle_updated_at();

-- Politiques de sécurité (RLS)
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.scenes enable row level security;

-- Politiques pour les utilisateurs
create policy "Les utilisateurs peuvent voir leur propre profil"
    on public.users for select
    using (auth.uid() = id);

create policy "Les utilisateurs peuvent mettre à jour leur propre profil"
    on public.users for update
    using (auth.uid() = id);

-- Politiques pour les projets
create policy "Les utilisateurs peuvent voir leurs propres projets"
    on public.projects for select
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent créer leurs propres projets"
    on public.projects for insert
    with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent mettre à jour leurs propres projets"
    on public.projects for update
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent supprimer leurs propres projets"
    on public.projects for delete
    using (auth.uid() = user_id);

-- Politiques pour les scènes
create policy "Les utilisateurs peuvent voir les scènes de leurs projets"
    on public.scenes for select
    using (
        exists (
            select 1
            from public.projects
            where id = project_id
            and user_id = auth.uid()
        )
    );

create policy "Les utilisateurs peuvent créer des scènes dans leurs projets"
    on public.scenes for insert
    with check (
        exists (
            select 1
            from public.projects
            where id = project_id
            and user_id = auth.uid()
        )
    );

create policy "Les utilisateurs peuvent mettre à jour les scènes de leurs projets"
    on public.scenes for update
    using (
        exists (
            select 1
            from public.projects
            where id = project_id
            and user_id = auth.uid()
        )
    );

create policy "Les utilisateurs peuvent supprimer les scènes de leurs projets"
    on public.scenes for delete
    using (
        exists (
            select 1
            from public.projects
            where id = project_id
            and user_id = auth.uid()
        )
    );

-- Index pour améliorer les performances
create index projects_user_id_idx on public.projects(user_id);
create index scenes_project_id_idx on public.scenes(project_id);
create index scenes_order_idx on public.scenes("order");

-- Bucket pour le stockage des fichiers
insert into storage.buckets (id, name, public) values ('videos', 'videos', true);
insert into storage.buckets (id, name, public) values ('images', 'images', true);
insert into storage.buckets (id, name, public) values ('audio', 'audio', true);

-- Politiques de stockage
create policy "Les fichiers sont accessibles publiquement"
    on storage.objects for select
    using ( bucket_id in ('videos', 'images', 'audio') );

create policy "Les utilisateurs authentifiés peuvent uploader des fichiers"
    on storage.objects for insert
    with check (
        auth.role() = 'authenticated' and
        bucket_id in ('videos', 'images', 'audio')
    ); 