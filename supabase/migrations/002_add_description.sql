-- 添加 description 列到 todos 表
alter table todos add column if not exists description text;
