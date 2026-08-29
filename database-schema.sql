-- Optional production schema for a future Supabase/PostgreSQL backend.
create table if not exists talents (
  id text primary key,
  name text not null,
  age integer not null check (age between 4 and 25),
  gender text check (gender in ('female','male') or gender is null),
  training_years integer not null,
  image_url text,
  height_cm integer,
  skills jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id bigserial primary key,
  talent_id text not null references talents(id) on delete cascade,
  title text not null,
  type text,
  role text,
  year integer,
  created_at timestamptz not null default now()
);

create index if not exists talents_age_idx on talents(age);
create index if not exists talents_gender_idx on talents(gender);
create index if not exists talents_training_years_idx on talents(training_years);
create index if not exists projects_talent_id_idx on projects(talent_id);
