---
layout: post
title: Programmers SQL
date: 2023-09-16 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: prosql.jpg # Add image post (optional)
tags: [sql] # add tag
---

## Programmers - REGEXP ( LIKE 여러 단어 )

```sql
SELECT
    animal_id
    , name
    , case 
        when sex_upon_intake regexp 'Neutered|Spayed'
        then 'O'
        else 'X'
    end as sex_upon_intake
from animal_ins
order by 1 asc;
```

<br/>
<hr>
<br/>

## Programmers - (가장 비싼 가격 정보 출력)
```sql
select 
    product_id
    , product_name
    , product_cd
    , category
    , price
from food_product
where price = (select max(price) from food_product);
```

<br/>
<hr>
<br/>

## Programmers - (입양 시각 구하기(1)) - LOCATE, HOUR
```sql
select * from 
( select
    case
        when substr( datetime, locate(' ', datetime)+1, 2 ) = '09'
        then 9
        when substr( datetime, locate(' ', datetime)+1, 2 ) = '10'
        then 10
        when substr( datetime, locate(' ', datetime)+1, 2 ) = '11'
        then 11
        when substr( datetime, locate(' ', datetime)+1, 2 ) = '12'
        then 12
        else 0
    end as hour
    , count(datetime) as count
from animal_outs
group by hour
order by hour asc ) t1
where hour != 0;
```
> locate() 로 ' ' 띄어쓰기 하나 되어있는 인덱스를 찾고 substr()

<br/>

```sql
SELECT 
    HOUR(DATETIME) AS HOUR
    , COUNT(DATETIME) AS COUNT
FROM ANIMAL_OUTS
WHERE HOUR(DATETIME) >= 9 AND HOUR(DATETIME) <= 12
GROUP BY HOUR 
ORDER BY HOUR;
```
> hour() 로 간단하게 datetime의 시간을 구할 수 있다. <br/>
> year(), month(), day(), hour(), minute(), second(), dayname(), monthname()

<br/>
<hr>
<br/>

## truncate()
```sql
select truncate(11233, -4)  from dual; -- 10000
select truncate(11233.1234, 1)  from dual; -- 11233.1
```
> 소수점을 기준으로 자르거나, 0으로 바꾼다. 

<br/>
<hr>
<br/>






