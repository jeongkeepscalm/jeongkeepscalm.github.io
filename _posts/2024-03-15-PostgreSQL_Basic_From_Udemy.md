---
layout: post
title: PostgreSQL_Basic_From_Udemy
date: 2024-03-15 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: postgreSql.jpg # Add image post (optional)
tags: [postgreSQL] # add tag
---

### TIMESTAMP

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

### EXISTS

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

### SELF JOIN

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


