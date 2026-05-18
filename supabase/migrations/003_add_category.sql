-- 添加 category 列到 todos 表
alter table todos add column if not exists category text;
