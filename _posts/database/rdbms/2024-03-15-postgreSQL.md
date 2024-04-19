---
title: PostgreSQL from Udemy
description: PostgreSQL
date: 2024-03-15
categories: [ Database, PostgreSQL ]
tags: [  Database, PostgreSQL ]
---

## TIMESTAMP

```sql
select now(); -- "2024-03-15 21:27:26.533895+09"
select timeofday(); -- "Fri Mar 15 21:27:05.744608 2024 KST"
select current_date; -- "2024-03-15"

select * from payment
where 1=1 
and extract(year from payment_date) = '2007'
and (extract(month from payment_date) = '1' -- 1월
or extract(quarter from payment_date) = '2') -- 2분기
;

select age(payment_date) from payment; -- 현재까지 경과 시간을 보여준다. 
select to_char(payment_date, 'MM-dd-YYYY') from payment;

-- 어떤 달에 지급이 이루어졌는지?
select distinct(to_char(payment_date, 'month')) from payment; -- may, march, february, april

-- 월급 요일이 월요일인 횟수 구하기
select count(1) from payment
where to_char(payment_date, 'day') like 'monday%'; -- 2948
select count(1) from payment
where extract(dow from payment_date) = 1; -- 2948

select left(first_name,1) || lower(last_name) || '@gmail.com' from customer;
```

## EXISTS

```sql
select c.first_name || ' ' || c.last_name as fullName from customer c inner join 
(select * from payment where amount > 11) p
on p.customer_id = c.customer_id;

select c.first_name || ' ' || c.last_name as fullName from customer c
where exists 
(
	select * from payment as p
	where 1=1
	and p.customer_id = c.customer_id
	and p.amount > 11
);
```

## SELF JOIN

```sql
-- 같은 길이를 가진 영화 짝을 모두 찾아라.
select f1.title, f2.title, f1.length from film f1
inner join film f2 on f1.film_id != f2.film_id
and f1.length = f2.length;
```
<img src="/assets/img/pgsqlScreenShot1.jpg" width="600px" />  
  
### ILIKE
```SQL
-- like 대소문자구분 o, ilike 대소문자구분 x
select * from cd.facilities f
where f.name ilike '%tennis%';
```

## DDL

```sql
-- create
create table account (
	user_id serial primary key
	, username varchar(50) unique not null
	, password varchar(50) not null
	, email varchar(200) unique not null
	, created_on timestamp not null
	, last_login timestamp
);

create table job(
	job_id serial primary key
	, job_name varchar(200) unique not null
);

create table account_job (
	user_id integer references account(user_id)
	, job_id integer references job(job_id)
	, hire_date timestamp
);

-- insert
insert into account 
	(username, password, email, created_on)
values 
	('ojg', 'ojg1234', 'ojg@gmail.com', current_timestamp);

-- returning : CUD 후 returning 뒤에 오는 컬럼들을 조회한다. 
update account
set last_login = current_timestamp
returning username, email, created_on, last_login;

-- alter
alter table account rename to users;
alter table users rename column userNm to userName;
alter table new_info alter column people drop/set not null;

alter table new_info drop column people;
alter table new_info drop column if exists people;
alter table new_info drop column people cascade;

-- 제약조건
create table example(
	ex_id serial primary key
	, age smallint check (age > 18)
	, parent_age smallint check (parent_age > age)
);

create table employees(
	emp_id serial primary key
	, first_name varchar(50) not null
	, last_name varchar(50) not null
	, birthdate date check (birthdate > '1979-12-31')
	, hire_date date check (hire_date > birthdate)
	, salary integer check (salary > 0)
);
```

## CASE

```sql
-- 특정 컬럼들의 데이터 갯수를 알아보고 싶을 경우 case를 사용할 수 있다. 
select
	sum(
		case rental_rate
			when 0.99 then 1
			else 0
		end
	) as bargains,
	sum(
		case rental_rate
			when 2.99 then 1
			else 0
		end
	) as regular,
	sum(
		case rental_rate
			when 4.99 then 1
			else 0
		end
	) as premium
from film;
```

## CAST

```sql
select cast('5' as integer);
-- = select '5'::integer;

select char_length(cast(inventory_id as varchar)) from rental;
```

## NULLIF

```sql
-- B가 없어 분모에 0이 들어갈 경우 에러발생. 에러방지로 nullif() 사용
select 
	(
		sum(case when department = 'A' then 1 else 0 end) /
		nullif(sum(case when department = 'B' then 1 else 0 end), 0)
	) as department_ratio
from depts;
```

## VIEW

```sql
-- view : 여러 테이블이 조인되어서 빈번히 사용될 때, view로 가상의 테이블을 만들어서 사용하자. 
create view customer_info as
select first_name, last_name, address from customer
inner join address 
on customer.address_id = address.address_id;

select * from customer_info;

create or replace view customer_info as 
select first_name, last_name, address, district from customer
inner join address 
on customer.address_id = address.address_id;

select * from customer_info;

alter view customer_info rename to c_info;

-- if exists : 에러방지
-- 고객의 정보가 존재하면 view를 삭제해라. 
drop view if exists c_info;
```
