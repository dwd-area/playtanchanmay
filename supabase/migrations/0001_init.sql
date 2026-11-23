-- ========== TABLES ==========
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 24),
  avatar text,
  created_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null check (char_length(name) between 1 and 40),
  owner_id uuid not null references auth.users,
  max_players int not null default 10 check (max_players between 2 and 10),
  created_at timestamptz not null default now()
);

create table public.room_members (
  room_id uuid references public.rooms on delete cascade,
  user_id uuid references auth.users on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table public.messages (
  id bigint generated always as identity primary key,
  room_id uuid not null references public.rooms on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);
create index on public.messages (room_id, created_at desc);

create table public.images (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  path text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table public.image_reactions (
  image_id uuid references public.images on delete cascade,
  user_id uuid references auth.users on delete cascade,
  emoji text not null,
  primary key (image_id, user_id, emoji)
);

create table public.image_comments (
  id bigint generated always as identity primary key,
  image_id uuid not null references public.images on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  body text not null check (char_length(body) <= 300),
  created_at timestamptz not null default now()
);

create table public.game_results (
  id bigint generated always as identity primary key,
  room_id uuid not null references public.rooms on delete cascade,
  game_id text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table public.ai_usage (
  user_id uuid not null,
  day date not null default current_date,
  count int not null default 0,
  primary key (user_id, day)
);

-- ========== HELPERS ==========
create or replace function public.is_room_member(rid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from room_members where room_id = rid and user_id = auth.uid()
  );
$$;

create or replace function public.create_room(room_name text)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare r public.rooms; c text;
begin
  loop
    c := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from rooms where code = c);
  end loop;
  insert into rooms (code, name, owner_id) values (c, room_name, auth.uid()) returning * into r;
  insert into room_members (room_id, user_id) values (r.id, auth.uid());
  return r;
end $$;

create or replace function public.join_room(room_code text)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare r public.rooms;
begin
  select * into r from rooms where code = upper(room_code);
  if not found then raise exception 'ROOM_NOT_FOUND'; end if;
  if not exists (select 1 from room_members where room_id = r.id and user_id = auth.uid())
     and (select count(*) from room_members where room_id = r.id) >= r.max_players then
    raise exception 'ROOM_FULL';
  end if;
  insert into room_members (room_id, user_id) values (r.id, auth.uid()) on conflict do nothing;
  return r;
end $$;

create or replace function public.consume_ai_quota(max_per_day int)
returns boolean language plpgsql security definer set search_path = public as $$
declare used int;
begin
  insert into ai_usage (user_id, day, count) values (auth.uid(), current_date, 1)
  on conflict (user_id, day) do update set count = ai_usage.count + 1
  returning count into used;
  return used <= max_per_day;
end $$;

-- ========== RLS ==========
alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.messages enable row level security;
alter table public.images enable row level security;
alter table public.image_reactions enable row level security;
alter table public.image_comments enable row level security;
alter table public.game_results enable row level security;
alter table public.ai_usage enable row level security;

create policy "profiles read own or roommates" on public.profiles for select to authenticated
  using (id = auth.uid() or exists (
    select 1 from room_members a join room_members b on a.room_id = b.room_id
    where a.user_id = auth.uid() and b.user_id = profiles.id));
create policy "profiles insert own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles update own" on public.profiles for update to authenticated using (id = auth.uid());

create policy "rooms read members" on public.rooms for select to authenticated using (public.is_room_member(id));
create policy "rooms update owner" on public.rooms for update to authenticated using (owner_id = auth.uid());

create policy "members read" on public.room_members for select to authenticated using (public.is_room_member(room_id));
create policy "members leave" on public.room_members for delete to authenticated using (user_id = auth.uid());

create policy "messages read" on public.messages for select to authenticated using (public.is_room_member(room_id));
create policy "messages insert" on public.messages for insert to authenticated
  with check (user_id = auth.uid() and public.is_room_member(room_id));

create policy "images read" on public.images for select to authenticated using (public.is_room_member(room_id));
create policy "images insert" on public.images for insert to authenticated
  with check (user_id = auth.uid() and public.is_room_member(room_id));
create policy "images delete own" on public.images for delete to authenticated using (user_id = auth.uid());

create policy "reactions read" on public.image_reactions for select to authenticated
  using (exists (select 1 from images i where i.id = image_id and public.is_room_member(i.room_id)));
create policy "reactions write" on public.image_reactions for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from images i where i.id = image_id and public.is_room_member(i.room_id)));
create policy "reactions delete own" on public.image_reactions for delete to authenticated using (user_id = auth.uid());

create policy "comments read" on public.image_comments for select to authenticated
  using (exists (select 1 from images i where i.id = image_id and public.is_room_member(i.room_id)));
create policy "comments write" on public.image_comments for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from images i where i.id = image_id and public.is_room_member(i.room_id)));
create policy "comments delete own" on public.image_comments for delete to authenticated using (user_id = auth.uid());

create policy "results read" on public.game_results for select to authenticated using (public.is_room_member(room_id));
create policy "results insert" on public.game_results for insert to authenticated with check (public.is_room_member(room_id));

-- ai_usage: no policies, only reachable through consume_ai_quota()

-- ========== REALTIME (private channels named "room:<uuid>") ==========
create policy "room channel read" on realtime.messages for select to authenticated
  using (public.is_room_member(split_part((select realtime.topic()), ':', 2)::uuid));
create policy "room channel write" on realtime.messages for insert to authenticated
  with check (public.is_room_member(split_part((select realtime.topic()), ':', 2)::uuid));

-- ========== STORAGE (path: <room_id>/<user_id>/<file>) ==========
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('room-images', 'room-images', false, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict do nothing;

create policy "room images read" on storage.objects for select to authenticated
  using (bucket_id = 'room-images' and public.is_room_member(((storage.foldername(name))[1])::uuid));
create policy "room images upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'room-images'
    and public.is_room_member(((storage.foldername(name))[1])::uuid)
    and (storage.foldername(name))[2] = auth.uid()::text);
create policy "room images delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'room-images' and (storage.foldername(name))[2] = auth.uid()::text);

alter publication supabase_realtime add table public.messages;