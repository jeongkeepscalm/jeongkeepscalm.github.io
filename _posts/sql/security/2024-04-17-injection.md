---
title: SQL Injection Attack
description: SQL Injection Attack
date: 2024-04-17
categories: [ sql, security]
tags: [ sql, injection, security ]
---

<h2>How to do "SQL Injection Attack"?</h2>

```sql
-- 1. 로그인 창에서의 SQL Injection 
select * from memberInfo m
where m.id = #{id} and m.password = #{password}

-- 2. 쿼리파라미터의 SQL Injection 
select * from posts
where artist = 1 
union
select 1, id, password from users
where userName = 'test' 
```
> id 값에 '를 포함시켰을 경우, Syntax Error 가 발생하면 SQL Injection 의 표적이 되기 쉽다.  
> id의 값에 test' or 1=1 -- 를 넣게 되었을 시 test인 아이디가 존재하면 로그인이 가능하다.  

<h2> SQL Injection 예방법 </h2>

```sql
-- 1. parameteried query
  pool.query('select * from users where id = ?', '유저가 보낸 값')
  pool.execute('select * from users where id = ?', '유저가 보낸 값')

-- 2. stored procedure 
  create procedure citycount (in country char(3), out cities int)
  begin 
    select * from users 
    where CountryCode = country; 
  end

-- 3. ORM
  SQL Alchemy
  , JPA/Hibernate
  , Sequelize
  , TypeORM
  , Prisma
  , Drizzle
  , ...
```
> ORM은 복잡한 쿼리를 대신 작성해주며 injection을 알아서 예방해준다.  
