---
layout: post
title: PostgreSQL_Basic_From_Udemy
date: 2023-09-29 00:00:00 +0900
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


```

