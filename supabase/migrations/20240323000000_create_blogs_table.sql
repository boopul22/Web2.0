-- Create blogs table
create table if not exists public.blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  excerpt text not null,
  image_url text,
  category text not null check (category in ('Travel', 'Lifestyle', 'Health')),
  read_time integer not null default 1,
  author_id uuid not null,
  author text not null default 'Anonymous',
  slug text not null unique,
  views integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  constraint blogs_slug_length check (char_length(slug) >= 3),
  constraint blogs_read_time_positive check (read_time > 0),
  constraint blogs_author_id_fk foreign key (author_id) references auth.users(id)
);

-- Create indexes for faster lookups
create index if not exists blogs_slug_idx on public.blogs(slug);
create index if not exists blogs_category_idx on public.blogs(category);
create index if not exists blogs_views_idx on public.blogs(views desc);

-- Enable RLS
alter table public.blogs enable row level security;

-- Create policies
create policy "Anyone can view blogs"
  on public.blogs for select
  using (true);

create policy "Authenticated users can create blogs"
  on public.blogs for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update blogs"
  on public.blogs for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete blogs"
  on public.blogs for delete
  using (auth.role() = 'authenticated');

-- Create function to handle updated_at
create or replace function public.handle_blogs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_blogs_updated_at
  before update on public.blogs
  for each row
  execute function public.handle_blogs_updated_at(); 