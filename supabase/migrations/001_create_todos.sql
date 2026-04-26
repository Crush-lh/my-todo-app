-- 创建 todos 表
create table todos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

-- 开启行级安全（RLS）
alter table todos enable row level security;

-- 允许匿名访问（简单起见，生产环境建议加用户认证）
create policy "Allow all" on todos
  for all using (true) with check (true);
