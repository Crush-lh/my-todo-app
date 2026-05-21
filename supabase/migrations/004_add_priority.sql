-- 添加 priority（优先级）列到 todos 表
alter table todos add column if not exists priority text;
